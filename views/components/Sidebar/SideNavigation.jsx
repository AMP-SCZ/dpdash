import React from 'react'
import { List, Divider } from '@mui/material'
import {
  SpaceDashboard,
  Group,
  ShowChart,
  DashboardCustomize,
  AdminPanelSettings,
  Flag,
} from '@mui/icons-material'
import NavItem from './NavItem'
import { routes } from '../../routes/routes'
import './SideNavigation.css'

const SideNavigation = ({ user }) => {
  return (
    <nav className="sidenav">
      <List>
        <NavItem Icon={SpaceDashboard} to={routes.main} label={'Dashboard'} />
        <NavItem Icon={Group} to={routes.participants} label={'Participants'} />
        <NavItem Icon={ShowChart} to={routes.charts} label={'Charts'} />
        <NavItem
          Icon={DashboardCustomize}
          to={routes.configs}
          label={'Configurations'}
        />
        {user.role === 'admin' && (
          <NavItem
            Icon={AdminPanelSettings}
            to={routes.admin}
            label={'Admin'}
          />
        )}
        <Divider light />
        <NavItem Icon={Flag} to={routes.main} label={'Help'} />
      </List>
    </nav>
  )
}

export default SideNavigation
