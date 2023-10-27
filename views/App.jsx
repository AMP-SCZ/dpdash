import React, { useState, useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar'
import {
  AuthContext,
  ConfigurationsContext,
  NotificationContext,
  SidebarContext,
  DimensionsContext,
} from './contexts'
import Router from './routes'
import { styles } from './styles'
import { NOTIFICATION_DEFAULT } from '../constants'

import 'react-virtualized/styles.css'

const App = (props) => {
  const [configurations, setConfigurations] = useState([])
  const [openSidebar, setOpenSidebar] = useState(true)
  const [notification, setNotification] = useState(NOTIFICATION_DEFAULT)
  const [user, setUser] = useState(null)
  const [width, setWidth] = useState(0)

  const handleNotificationClose = () => setNotification(NOTIFICATION_DEFAULT)
  const handleResize = () => setWidth(window.innerWidth)

  useEffect(() => {
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <DimensionsContext.Provider value={[width, setWidth]}>
      <SidebarContext.Provider value={[openSidebar, setOpenSidebar]}>
        <NotificationContext.Provider value={[notification, setNotification]}>
          <ConfigurationsContext.Provider
            value={[configurations, setConfigurations]}
          >
            <AuthContext.Provider value={[user, setUser]}>
              <Router {...props} user={user} setUser={setUser} />
              <Snackbar
                open={notification.open}
                message={notification.message}
                autoHideDuration={2000}
                onClose={handleNotificationClose}
              />
            </AuthContext.Provider>
          </ConfigurationsContext.Provider>
        </NotificationContext.Provider>
      </SidebarContext.Provider>
    </DimensionsContext.Provider>
  )
}

export default App
