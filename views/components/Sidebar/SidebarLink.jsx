import React, { forwardRef } from 'react'
import { NavLink } from 'react-router-dom'
import './SidebarLink.css'

const SidebarLink = forwardRef((props, ref) => (
  <NavLink
    ref={ref}
    to={props.to}
    className={({ isActive }) =>
      isActive ? 'SidebarLink_link-active' : 'SidebarLink_link'
    }
  >
    {props.children}
  </NavLink>
))

export default SidebarLink
