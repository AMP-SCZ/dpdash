import React from 'react'
import { Drawer } from '@mui/material'
import SidebarLogo from './SidebarLogo'
import SideNavigation from './SideNavigation'
import SidebarFooter from './SidebarFooter'
import './Sidebar.css'

const Sidebar = ({ user, sidebarOpen, onLogout }) => {
  return (
    <Drawer variant="permanent" open={sidebarOpen}>
      <SidebarLogo />
      <SideNavigation user={user} />
      <SidebarFooter user={user} onLogout={onLogout} />
    </Drawer>
  )
}

export default Sidebar
