import {useState, useEffect} from 'react'

const CATEGORIES = ['health','work','finance','education','hobby','other']

const emptyForm = {title:'', description:'', category:'other', deadline:'', steps:[]}

const GoalForm = ({onSubmit, onCancel, initialData}) => {

  const [form, setForm] = useState(emptyForm)
  const [stepInput, setStepInput] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'other',
        deadline: initialData.deadline
          ? new Date(initialData.deadline).toISOString().split('T')[0]
          : '',
        steps: initialData.steps || [],
      })
    } else {
      setForm(emptyForm)
    }
  }, [initialData])

  const updateForm = (e) => {
    setForm({...form, [e.target.name]:e.target.value})
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.deadline) e.deadline = 'Deadline must be set'
    if (form.title.length > 40) e.title = 'Title must be under 40 characters'
    if (form.description.length > 100) e.description = 'Description must be under 100 characters'
    if (form.deadline) {
      const selected = new Date(form.deadline)
      selected.setHours(0,0,0,0)
      const today = new Date()
      today.setHours(0,0,0,0)
      if (selected < today) e.deadline = 'Deadline cannot be in the past'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const addStep = () => {
    if (!stepInput.trim()) return
    setForm({...form, steps:[...form.steps, {title:stepInput.trim(), completed:false}]})
    setStepInput('')
  }

  const removeStep = (index) => {
    setForm({...form, steps:form.steps.filter((_,i) => i !== index)})
  }

  const toggleStep = (index) => {
    const updated = form.steps.map((s,i) => i === index ? {...s, completed:!s.completed} : s)
    setForm({...form, steps:updated})
  }

  const submitForm = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(form)
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>{initialData ? 'Edit goal' : 'New goal'}</h3>

        <form onSubmit={submitForm} noValidate>

          <div style={styles.field}>
            <label style={styles.label}>Title *</label>
            <input
              style={{...styles.input, ...(errors.title ? styles.inputError : {})}}
              name="title" value={form.title} onChange={updateForm}
              placeholder="Create a MERN application"
            />
            {errors.title && <span style={styles.error}>{errors.title}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              style={{...styles.input, ...styles.textarea, ...(errors.description ? styles.inputError : {})}}
              name="description" value={form.description} onChange={updateForm}
              placeholder="This is my plan for creating a perfect MERN application..."
              rows={3}
            />
            {errors.description && <span style={styles.error}>{errors.description}</span>}
          </div>

          <div style={styles.row}>
            <div style={{...styles.field, flex:1}}>
              <label style={styles.label}>Category</label>
              <select style={styles.input} name="category" value={form.category} onChange={updateForm}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{...styles.field, flex:1}}>
              <label style={styles.label}>Deadline</label>
              <input
                style={{...styles.input, ...(errors.deadline ? styles.inputError : {})}}
                type="date" name="deadline" value={form.deadline} onChange={updateForm}
              />
              {errors.deadline && <span style={styles.error}>{errors.deadline}</span>}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Steps</label>
            <div style={styles.stepInput}>
              <input
                style={{...styles.input, flex:1}}
                value={stepInput}
                onChange={e => setStepInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addStep())}
                placeholder="Add a step and press Enter"
              />
              <button type="button" style={styles.addStepBtn} onClick={addStep}>Add</button>
            </div>

            {form.steps.map((step, i) => (
              <div key={i} style={styles.stepRow}>
                <input
                  type="checkbox"
                  checked={step.completed}
                  onChange={() => toggleStep(i)}
                />
                <span style={{
                  flex:1, fontSize:'14px',
                  textDecoration: step.completed ? 'line-through' : 'none',
                  color: step.completed ? '#aaa' : '#333',
                }}>
                  {step.title}
                </span>
                <button type="button" style={styles.removeBtn} onClick={() => removeStep(i)}>Remove</button>
              </div>
            ))}
          </div>

          <div style={styles.buttons}>
            <button type="button" style={styles.cancelBtn} onClick={onCancel}>Cancel</button>
            <button type="submit" style={styles.submitBtn}>
              {initialData ? 'Save changes' : 'Add goal'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: {position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100},
  modal: {background:'#fff', borderRadius:'16px', padding:'2rem', width:'100%', maxWidth:'520px', maxHeight:'90vh', overflowY:'auto'},
  title: {margin:'0 0 1.5rem', fontSize:'20px'},
  field: {marginBottom:'14px'},
  label: {display:'block', marginBottom:'5px', fontSize:'13px', fontWeight:'500', color:'#444'},
  input: {width:'100%', padding:'9px 12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', boxSizing:'border-box', outline:'none'},
  inputError: {borderColor:'#e53935'},
  textarea: {resize:'vertical', fontFamily:'inherit'},
  error: {color:'#e53935', fontSize:'12px', marginTop:'4px', display:'block'},
  row: {display:'flex', gap:'12px'},
  stepInput: {display:'flex', gap:'8px', marginBottom:'8px'},
  addStepBtn: {padding:'9px 16px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer'},
  stepRow: {display:'flex', alignItems:'center', gap:'8px', padding:'6px 0', borderBottom:'1px solid #f5f5f5'},
  removeBtn: {background:'none', border:'none', color:'#c62828', cursor:'pointer', fontSize:'13px'},
  buttons: {display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'1.5rem'},
  cancelBtn: {padding:'10px 20px', background:'transparent', border:'1px solid #ddd', borderRadius:'8px', cursor:'pointer'},
  submitBtn: {padding:'10px 20px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer'},
}

export default GoalForm