import {useState} from 'react'
import {Link, useNavigation} from 'react-router-dom'
import {useAuth} from '../context/authContext'

const registerView = () => {
  const register = useAuth()
  const navigate = useNavigation()

  const [data, setData] = useState({name:'',email:'',password:'',cpassword:''})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateData = (e) => {
    setData({...data, [e.target.name]:e.target.value})
  }

  const validate = () => {
    if(!data.name || !data.email || !data.password || !data.cpassword){
      setError("All fields must be filled in")
      return false
    }
    if (data.name.length<6) {
      setError('Name must contain at least 6 chjaracters')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      setError('Email must be valid')
      return false
    }
    if (data.password.length<6) {
      setError('Password must contain at least 6 characters')
      return false
    }
    if (data.password !== data.confirmPassword) {
      setError('Different passwords entered')
      return false
    }
    return true
  }

  const submitRegistration = async (e) => {
    if(!validate()) return
    setLoading(true)
    try{
      await register(data.name,data.email,data.password)
      navigate('/dashboard')
    }catch(error){
      setError(error.response?.data?.message)
    }finally{
      setLoading(false)
    }
  }

  return(
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style = {styles.title}>Create an account</h2>
        <p style={styles.subtitle}>Fill in your information</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={submitRegistration} noValidate>
          {[
            {label: 'Username', name:'name', type:'text', placeholder:'s101587'},
            {label: 'Email address', name:'email', type:'email', placeholder:'s101587@pollub.edu.pl'},
            {label: 'Password', name:'password', type:'password', placeholder:'********'},
            {label: 'Confirm password', name:'cpassword', type:'password', placeholder:'********'},
          ].map(({label,name,type,placeholder}) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input style={styles.input} type={type} name={name} value={data[name]} onChange={updateData} placeholder={placeholder}/>
            </div>
          ))}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating your account...' : "Click here to registeer"}
          </button>
        </form>
        <p style={styles.link}>
          Already have an accout? <Link to="/login">Login </Link>
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

export default registerView