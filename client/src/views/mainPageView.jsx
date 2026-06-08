import {useState, useEffect} from 'react'
import {useAuth} from '../context/authContext'
import GoalCard from '../components/GoalCard'
import GoalForm from '../components/GoalForm'
import {getGoals, createGoal, updateGoal, deleteGoal} from '../api/goals'

const CATEGORIES = ['all','health','work','finance','education','hobby','other']
const STATUSES = ['all','in-progress','completed','failed']

const MainPageView = () => {

  const {user, logout} = useAuth()

  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchGoals()
  }, [filterCategory, filterStatus])

  const fetchGoals = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filterCategory !== 'all') params.category = filterCategory
      if (filterStatus !== 'all') params.status = filterStatus
      const {data} = await getGoals(params)
      setGoals(data)
    } catch(err) {
      console.error('Failed to fetch goals:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (formData) => {
    try {
      const {data} = await createGoal(formData)
      setGoals([data, ...goals])
      setShowForm(false)
    } catch(err) {
      console.error('Failed to create goal:', err)
    }
  }

  const handleUpdate = async (formData) => {
    try {
      const {data} = await updateGoal(editingGoal._id, formData)
      setGoals(goals.map(g => g._id === data._id ? data : g))
      setEditingGoal(null)
    } catch(err) {
      console.error('Failed to update goal:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return
    try {
      await deleteGoal(id)
      setGoals(goals.filter(g => g._id !== id))
    } catch(err) {
      console.error('Failed to delete goal:', err)
    }
  }

  const stats = {
    total: goals.length,
    'in-progress': goals.filter(g => g.status === 'in-progress').length,
    completed: goals.filter(g => g.status === 'completed').length,
    avgProgress: goals.length
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
      : 0,
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>Workflow</h1>
        <div style={styles.navRight}>
          <span style={styles.userName}>Hello, {user?.name}</span>
          <button style={styles.logoutBtn} onClick={logout}>Sign out</button>
        </div>
      </nav>

      <main style={styles.main}>

        <div style={styles.statsRow}>
          {[
            {label:'All goals', value: stats.total},
            {label:'in-progress', value: stats['in-progress']},
            {label:'Completed', value: stats.completed},
            {label:'Average progress', value: `${stats.avgProgress}%`},
          ].map(({label, value}) => (
            <div key={label} style={styles.statCard}>
              <span style={styles.statValue}>{value}</span>
              <span style={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        <div style={styles.toolbar}>
          <div style={styles.filters}>
            <select style={styles.select} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select style={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button style={styles.addBtn} onClick={() => setShowForm(true)}>New goal</button>
        </div>

        {loading ? (
          <p style={styles.info}>Loading...</p>
        ) : goals.length === 0 ? (
          <p style={styles.info}>No goals yet. Add your first one!</p>
        ) : (
          <div style={styles.grid}>
            {goals.map(goal => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onEdit={setEditingGoal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      </main>

      {showForm && (
        <GoalForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingGoal && (
        <GoalForm
          initialData={editingGoal}
          onSubmit={handleUpdate}
          onCancel={() => setEditingGoal(null)}
        />
      )}

    </div>
  )
}

const styles = {
  container: {minHeight:'100vh', background:'#f5f5f5'},
  nav: {background:'#fff', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.08)'},
  logo: {margin:0, color:'#4f46e5', fontSize:'20px'},
  navRight: {display:'flex', alignItems:'center', gap:'16px'},
  userName: {color:'#444', fontSize:'14px'},
  logoutBtn: {padding:'8px 16px', background:'transparent', border:'1px solid #ddd', borderRadius:'8px', cursor:'pointer'},
  main: {maxWidth:'960px', margin:'2rem auto', padding:'0 1rem'},
  statsRow: {display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'12px', marginBottom:'1.5rem'},
  statCard: {background:'#fff', borderRadius:'12px', padding:'1rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)'},
  statValue: {fontSize:'28px', fontWeight:'700', color:'#4f46e5'},
  statLabel: {fontSize:'12px', color:'#888'},
  toolbar: {display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'},
  filters: {display:'flex', gap:'8px'},
  select: {padding:'8px 12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', background:'#fff', cursor:'pointer'},
  addBtn: {padding:'10px 20px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'500'},
  grid: {display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'16px'},
  info: {textAlign:'center', color:'#888', marginTop:'3rem'},
}

export default MainPageView