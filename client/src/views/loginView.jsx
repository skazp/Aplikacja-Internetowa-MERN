import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../context/authContext'

const LoginView = () => {

  const {login} = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState({email:'',password:''})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateData = (e) => {
    setData({...data, [e.target.name]:e.target.value})
  }

  const validate = () => {
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      setError('Email must be valid')
      return false
    }
    if (data.password.length<6) {
      setError('Password must contain at least 6 characters')
      return false
    }
    return true
  }

  const submitLogin = async (e) => {
    e.preventDefault()
    if(!validate()) return
    setLoading(true)
    try{
      await login(data.email,data.password)
      navigate('/mainpage')
    }catch(error){
      const data = error.response?.data
      if (data?.errors) {
        setError(data.errors.map(e => e.msg).join(', '))
      } else {
        setError(data.message)
      }
    }finally{
      setLoading(false)
    }
  }

  return(
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style = {styles.title}>Sign into your account</h2>
        <p style={styles.subtitle}>Fill in your information</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={submitLogin} noValidate>
          {[
            {label: 'Email address', name:'email', type:'email', placeholder:'s101587@pollub.edu.pl'},
            {label: 'Password', name:'password', type:'password', placeholder:'********'},
          ].map(({label,name,type,placeholder}) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input style={styles.input} type={type} name={name} value={data[name]} onChange={updateData} placeholder={placeholder}/>
            </div>
          ))}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging into your account...' : "Click here to sign in"}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an accout? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container:{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card:{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
  title:{ margin: '0 0 4px', fontSize: '24px' },
  subtitle:{ margin: '0 0 24px', color: '#666' },
  error:{ background: '#fee', color: '#c00', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  field:{ marginBottom: '16px' },
  label:{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' },
  input:{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' },
  button:{ width: '100%', padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', marginTop: '8px' },
  link:{ textAlign: 'center', marginTop: '16px', fontSize: '14px' },
}

export default LoginView