import './App.css'
import { Routes, Route } from "react-router-dom";
import Context from './context/Context'
import Signup from './pages/Signup';
import Login from './pages/Login';
import Layout from './Outlet/Layout';
import Main from './pages/Main';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';

function App() {

  return (

    <Context>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot' element={<ForgotPassword />} />
        <Route path='/' element={<Layout />} >
          <Route path='/' element={<Main /> }  />
          <Route path='/settings' element={<Settings /> }  />
        </Route>
      </Routes>
    </Context>

  )
}

export default App
