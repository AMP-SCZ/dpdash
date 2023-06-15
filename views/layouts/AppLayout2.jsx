import React, { useState, useEffect } from 'react'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

import getAvatar from '../fe-utils/avatarUtil'
import getCounts from '../fe-utils/countUtil'
import { fetchSubjects } from '../fe-utils/fetchUtil'

const AppLayoutTwo = ({ user, classes, title, children, theme }) => {
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

  return (
    <div className={classes.root}>
      <Header
        handleDrawerToggle={toggleDrawer}
        title={title}
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
        {children}
      </div>
    </div>
  )
}

export default AppLayoutTwo
