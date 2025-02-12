import './App.css'
import { Routes, Route } from "react-router-dom";
import Context from './context/Context'
import Signup from './pages/Signup';
import Login from './pages/Login';
import Layout from './Outlet/Layout';
import Main from './pages/Main';
import Settings from './pages/Settings';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {

  return (

    <Context>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<ProtectedRoute />}  >
          <Route path='/' element={<Layout />} >
            <Route index element={<Main />} />
            <Route path='/settings' element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </Context>

  )
}

export default App
