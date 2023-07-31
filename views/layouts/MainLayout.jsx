import React, { useState, useEffect, useContext } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
import classNames from 'classnames'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

import api from '../api'
import getCounts from '../fe-utils/countUtil'
import { fetchSubjects } from '../fe-utils/fetchUtil'
import {
  AuthContext,
  ConfigurationsContext,
  NotificationContext,
  SidebarContext,
} from '../contexts'
import { headerTitle } from './helpers'

const MainLayout = ({ classes, theme }) => {
  const temporary = 'temporary'
  const persistent = 'persistent'
  const dashboard = 'dashboard'
  const [configurations, setConfigurations] = useContext(ConfigurationsContext)
  const [, setNotification] = useContext(NotificationContext)
  const [openSidebar, setOpenSidebar] = useContext(SidebarContext)
  const [showHeader, setShowHeader] = useState(false)
  const [user, setUser] = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [subjects, setSubjects] = useState([])
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [sideBarState, setSideBarState] = useState({
    totalDays: 0,
    totalStudies: 0,
    totalSubjects: 0,
  })
  const handleSidebarOpen = () => setOpenSidebar(!openSidebar)
  const fetchUsers = async () => {
    try {
      const usersList = await api.users.loadAll()
      setUsers(usersList)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const loadAllConfigurations = async (userId) => {
    try {
      const configurations = await api.userConfigurations.all(userId)

      setConfigurations(configurations)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const handleDashboardContent = () => {
    if (pathname.includes(dashboard)) {
      setPersistSidebar(temporary)
      setShowHeader(false)
    } else {
      setPersistSidebar(persistent)
      setShowHeader(true)
    }
  }

  const processDates = (options) => {
    const momentSetting = {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'MM/DD/YYYY',
    }
    const nowT = moment().local()
    for (var i = 0; i < options.length; i++) {
      var row = options[i]
      var syncedT = moment.utc(row.synced).local()
      var syncedL = moment(syncedT.format('YYYY-MM-DD')).calendar(
        null,
        momentSetting
      )
      var days = nowT.diff(syncedT, 'days')
      var color = days > 14 ? '#de1d16' : '#14c774'
      options[i]['synced'] = syncedL
      options[i]['lastSyncedColor'] = color
    }
    return options
  }
  useEffect(() => {
    fetchSubjects().then((acl) => {
      const extractSubjectsFromAcl = processDates(
        acl.map(({ subjects }) => subjects).flat()
      )
      setSubjects(extractSubjectsFromAcl)
      setSideBarState(getCounts({ acl }))
    })
    fetchUsers()
    loadAllConfigurations(user.uid)
  }, [])
  useEffect(() => {
    handleDashboardContent()
  }, [pathname])

  return (
    <div className={classes.root}>
      <Header
        configurations={configurations}
        onClose={handleSidebarOpen}
        title={headerTitle(pathname)}
        isAccountPage={false}
        onShow={showHeader}
        user={user}
      />
      <Sidebar
        onPersist={persistSidebar}
        onClose={handleSidebarOpen}
        sidebarOpen={openSidebar}
        totalDays={sideBarState.totalDays}
        totalStudies={sideBarState.totalStudies}
        totalSubjects={sideBarState.totalSubjects}
      />
      <div className={classNames(classes.content, classes.contentPadded)}>
        <Outlet
          context={{
            classes,
            configurations,
            navigate,
            openSidebar,
            setConfigurations,
            setOpenSidebar,
            setNotification,
            setUser,
            setUsers,
            subjects,
            theme,
            user,
            users,
          }}
        />
      </div>
    </div>
  )
}
export default MainLayout
