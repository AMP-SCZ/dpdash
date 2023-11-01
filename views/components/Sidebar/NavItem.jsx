import React from 'react'
import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import SidebarLink from './SidebarLink'

const NavItem = ({ to, Icon, label }) => {
  return (
    <ListItem component={SidebarLink} to={to} sx={{ width: 228 }}>
      <ListItemIcon sx={{ minWidth: 40 }}>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={label} sx={{ color: 'text.primary' }} />
    </ListItem>
  )
}

export default NavItem
