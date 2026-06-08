import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {AuthProvider} from './context/authContext'
import PrivateRoute from './components/privateRoute'
import LoginView from './views/loginView'
import RegisterView from './views/registerView'
import MainPageView from './views/mainPageView'


const App = () => {
  return(
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Navigate to="/mainpage" replace/>}/>
          <Route path='/register' element={<RegisterView/>}/>
          <Route path='/login' element={<LoginView/>}/>

          <Route path='/mainpage' element={
            <PrivateRoute>
              <MainPageView/>
            </PrivateRoute>
          }/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App