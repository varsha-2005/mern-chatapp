import { Outlet } from 'react-router-dom'
import Header from './Header'
const Layout = () => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className='mt-9'>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
