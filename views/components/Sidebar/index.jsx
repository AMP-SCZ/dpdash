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
      PaperProps={{
        sx: {
          padding: '8px',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '253px',
        },
      }}
    >
      <SidebarLogo />
      <SideNavigation user={user} />
      <SidebarFooter user={user} onLogout={onLogout} />
    </Drawer>
  )
}

export default Sidebar
