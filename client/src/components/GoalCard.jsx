const CATEGORY_COLORS = {
  health: {bg:'#e8f5e9', text:'#2e7d32'},
  work: {bg:'#e3f2fd', text:'#1565c0'},
  finance: {bg:'#fff8e1', text:'#f57f17'},
  education: {bg:'#f3e5f5', text:'#6a1b9a'},
  hobby: {bg:'#fce4ec', text:'#880e4f'},
  other: {bg:'#f5f5f5', text:'#424242'},
}

const STATUS_LABELS = {
  'in-progress': {label:'In-progress', color:'#2e7d32'},
  completed: {label:'Completed', color:'#1565c0'},
  failed: {label:'Failed', color:'#b71c1c'},
}

const GoalCard = ({goal, onEdit, onDelete}) => {

  const cat = CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.other
  const status = STATUS_LABELS[goal.status] || STATUS_LABELS['in-progress']

  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div style={styles.card}>

      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={{...styles.badge, background:cat.bg, color:cat.text}}>
            {goal.category}
          </span>
          <span style={{...styles.status, color:status.color}}>
            {status.label}
          </span>
        </div>
        <div style={styles.actions}>
          <button style={styles.editBtn} onClick={() => onEdit(goal)}>Edit</button>
          <button style={styles.deleteBtn} onClick={() => onDelete(goal._id)}>Delete</button>
        </div>
      </div>

      <h3 style={styles.title}>{goal.title}</h3>
      {goal.description && <p style={styles.desc}>{goal.description}</p>}

      {daysLeft !== null && (
        <p style={{...styles.deadline, color: daysLeft < 7 ? '#c62828' : '#555'}}>
          {daysLeft > 0
            ? `${daysLeft} days left`
            : daysLeft === 0
            ? 'Deadline is today'
            : 'Deadline passed'}
        </p>
      )}

      <div style={styles.progressWrapper}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Progress</span>
          <span style={styles.progressValue}>{goal.progress}%</span>
        </div>
        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width:`${goal.progress}%`,
            background: goal.progress === 100 ? '#2e7d32' : '#4f46e5',
          }}/>
        </div>
      </div>

      {goal.steps.length > 0 && (
        <div style={styles.steps}>
          {goal.steps.map((step, i) => (
            <div key={i} style={styles.step}>
              <span style={{color: step.completed ? '#2e7d32' : '#aaa'}}>
                {step.completed ? 'Done' : 'Pending'}
              </span>
              <span style={{
                fontSize:'14px',
                textDecoration: step.completed ? 'line-through' : 'none',
                color: step.completed ? '#aaa' : '#333',
              }}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

const styles = {
  card: {background:'#fff', borderRadius:'12px', padding:'1.25rem', boxShadow:'0 1px 6px rgba(0,0,0,0.08)', display:'flex', flexDirection:'column', gap:'10px'},
  header: {display:'flex', justifyContent:'space-between', alignItems:'center'},
  headerLeft: {display:'flex', alignItems:'center', gap:'8px'},
  badge: {padding:'2px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'500'},
  status: {fontSize:'12px'},
  actions: {display:'flex', gap:'4px'},
  editBtn: {background:'none', border:'1px solid #ddd', borderRadius:'6px', cursor:'pointer', fontSize:'13px', padding:'4px 10px'},
  deleteBtn: {background:'none', border:'1px solid #ddd', borderRadius:'6px', cursor:'pointer', fontSize:'13px', padding:'4px 10px', color:'#c62828'},
  title: {margin:0, fontSize:'16px', fontWeight:'600'},
  desc: {margin:0, fontSize:'14px', color:'#666', lineHeight:'1.5'},
  deadline: {margin:0, fontSize:'13px'},
  progressWrapper: {display:'flex', flexDirection:'column', gap:'4px'},
  progressHeader: {display:'flex', justifyContent:'space-between'},
  progressLabel: {fontSize:'13px', color:'#555'},
  progressValue: {fontSize:'13px', fontWeight:'600', color:'#4f46e5'},
  progressBar: {height:'8px', background:'#eee', borderRadius:'99px', overflow:'hidden'},
  progressFill: {height:'100%', borderRadius:'99px', transition:'width 0.4s ease'},
  steps: {display:'flex', flexDirection:'column', gap:'6px', borderTop:'1px solid #f0f0f0', paddingTop:'10px'},
  step: {display:'flex', alignItems:'center', gap:'8px'},
}

export default GoalCard