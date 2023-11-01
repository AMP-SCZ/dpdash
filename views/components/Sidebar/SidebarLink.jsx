import { forwardRef } from 'react'
import { NavLink } from 'react-router-dom'
import './SidebarLink.css'

const SidebarLink = forwardRef((props, ref) => (
  <NavLink
    ref={ref}
    to={props.to}
    className={({ isActive }) =>
      isActive ? 'sidenav_link-active' : 'sidenav_link'
    }
  >
    {props.children}
  </NavLink>
))

export default SidebarLink
