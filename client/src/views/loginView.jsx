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
      setError(error.response?.data?.message)
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
  container: {},
  card: {},
  title: {},
  subtitle: {},
  error: {},
  field: {},
  label: {},
  input: {},
  button: {},
  link: {},
}

export default LoginView