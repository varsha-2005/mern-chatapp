import './App.css'
import { Routes, Route } from "react-router-dom";
import Context from './context/Context'
import Signup from './pages/Signup';
import Login from './pages/Login';
import Layout from './Outlet/Layout';
import Main from './pages/Main';

function App() {

  return (

    <Context>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Layout />} >
          <Route path='/' element={<Main /> }  />
        </Route>
      </Routes>
    </Context>

  )
}

export default App
