import { Outlet } from 'react-router-dom'
import SidebarNavigation from '../components/SidebarNavigation'

function AppLayout() {
  return (
    <div className="h-screen overflow-hidden bg-slate-100 text-slate-800 lg:grid lg:grid-cols-[230px_minmax(0,1fr)]">
      <SidebarNavigation />
      <div className="min-w-0 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
