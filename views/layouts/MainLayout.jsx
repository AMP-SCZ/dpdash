import React, { useState, useEffect, useContext } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

import getAvatar from '../fe-utils/avatarUtil'
import getCounts from '../fe-utils/countUtil'
import { fetchSubjects } from '../fe-utils/fetchUtil'
import { AuthContext } from '../contexts/AuthContext'
import { headerTitle } from './helpers'
import RequireAuth from '../components/hoc/RequiredAuth'

const MainLayout = ({ classes, theme }) => {
  const user = useContext(AuthContext)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [openDrawer, setOpenDrawer] = useState(false)
  const [sideBarState, setSideBarState] = useState({
    totalDays: 0,
    totalStudies: 0,
    totalSubjects: 0,
  })
  const [avatar, setAvatar] = useState('')

  const toggleDrawer = () => setOpenDrawer(!openDrawer)

  useEffect(() => {
    fetchSubjects().then((acl) => {
      setSideBarState(getCounts({ acl }))
    })
    setAvatar(getAvatar({ user }))
  }, [])

  if (!user) navigate('/login')
  return (
    <div className={classes.root}>
      <Header
        handleDrawerToggle={toggleDrawer}
        title={headerTitle(pathname)}
        isAccountPage={false}
        classes={classes}
      />
      <Sidebar
        avatar={avatar}
        handleDrawerToggle={toggleDrawer}
        mobileOpen={openDrawer}
        totalDays={sideBarState.totalDays}
        totalStudies={sideBarState.totalStudies}
        totalSubjects={sideBarState.totalSubjects}
        user={user}
        classes={classes}
        theme={theme}
      />
      <div className={`${classes.content} ${classes.contentPadded}`}>
        <RequireAuth>
          <Outlet context={{ user, classes, theme }} />
        </RequireAuth>
      </div>
    </div>
  )
}

export default MainLayout
