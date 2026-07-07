import { Outlet } from 'react-router-dom'
import SidebarNavigation from '../components/SidebarNavigation'

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 lg:grid lg:grid-cols-[230px_minmax(0,1fr)]">
      <SidebarNavigation />
      <Outlet />
    </div>
  )
}

export default AppLayout
