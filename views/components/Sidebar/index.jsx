import React from 'react'
import { Drawer } from '@mui/material'
import SidebarLogo from './SidebarLogo'
import SideNavigation from './SideNavigation'
import SidebarFooter from './SidebarFooter'

const Sidebar = ({ user, sidebarOpen, onLogout }) => {
  return (
    <Drawer
      variant="permanent"
      open={sidebarOpen}
      sx={{ height: '100vh' }}
      PaperProps={{ sx: { padding: '8px', position: 'static' } }}
    >
      <SidebarLogo />
      <SideNavigation user={user} />
      <SidebarFooter user={user} onLogout={onLogout} />
    </Drawer>
  )
}

export default Sidebar
