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
      sx={{
        flexShrink: 0,
        boxSizing: 'border-box',
        width: '248px',
        height: '100vh',
      }}
      PaperProps={{ sx: { padding: '8px' } }}
    >
      <SidebarLogo />
      <SideNavigation user={user} />
      <SidebarFooter user={user} onLogout={onLogout} />
    </Drawer>
  )
}

export default Sidebar
