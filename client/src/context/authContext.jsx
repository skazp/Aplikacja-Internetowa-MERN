import { createContext, useContext, useState, useEffect} from 'react'
import api from '../api/axios'

const authContext = createContext()

export const AuthProvider = ({children}) => {
  const[user,setUser] = useState(null)
  const[loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    if(savedUser&&savedToken){
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  },[])

  const register = async (name, email, password) => {
    const {data} = await api.post('/auth/register', {name, email, password})
    localStorage.setItem('user', JSON.stringify({_id:data._id, name:data.name, email:data.email,}))
    localStorage.setItem('token', data.token)
    setUser({_id:data._id, name:data.name, email:data.email})
  }

  const login = async (email, password) => {
    const {data} = await api.post('/auth/login', {email, password})
    localStorage.setItem('user', JSON.stringify({_id:data._id, name:data.name, email:data.email}))
    localStorage.setItem('token', data.token)
    setUser({_id:data._id, name:data.name, email:data.email})
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
  }

  return(
  <authContext.Provider value={{user,loading,register,login,logout}}>
    {children}
  </authContext.Provider>
)

}

export const useAuth = () => useContext(authContext)  