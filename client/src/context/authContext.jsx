import { createContext, useContext, useState, useEffect} from 'react'
import api from '../api/axios'

const authContext = createContext()

export const authProvider = ({children}) => {
  const[user,setUser] = useState(null)
  const[loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    if(savedUser&&savedToken){
      setUser(savedUser)
    }
    setLoading(false)
  },[])

  const register = async (name, email, password) => {
    
  }

  const login = async (email, password) => {

  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
  }
}