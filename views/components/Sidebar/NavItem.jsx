import React from 'react'
import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import SidebarLink from './SidebarLink'

const NavItem = ({ to, Icon, label }) => {
  return (
    <ListItem component={SidebarLink} to={to}>
      <ListItemIcon sx={{ minWidth: 40, alignSelf: 'center' }}>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={label} sx={{ color: 'text.primary' }} />
    </ListItem>
  )
}

export default NavItem
