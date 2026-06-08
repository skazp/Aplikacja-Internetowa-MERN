import useAuth from '../context/authContext'

const privateRoute = ({children}) => {
  const {user,loading} = useAuth()

  if(loading) return <div>Loading...</div>

  return user ? children : <Navigate to="/login" replace/>
}

export default privateRoute