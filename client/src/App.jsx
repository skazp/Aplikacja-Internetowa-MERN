import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {authProvider} from './context/authContext'
import privateRoute from './components/privateRoute'
import loginView from './views/loginView'
import registerView from './views/registerView'
import mainPageView from './views/mainPageView'


const App = () => {
  return(
    <BrowserRouter>
      <authProvider>
        <Routes>
          <Route path='/' element={<Navigate to="/mainpage" replace/>}/>
          <Route path='/register' element={<registerView/>}/>
          <Route path='/login' element={<loginView/>}/>

          <Route path='/mainpage' element={
            <privateRoute>
              <mainPageView/>
            </privateRoute>
          }/>
        </Routes>
      </authProvider>
    </BrowserRouter>
  )
}