import React, { useState, useEffect } from 'react'
import {
  CssBaseline,
  StyledEngineProvider,
  createTheme,
  ThemeProvider,
} from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import {
  AuthContext,
  ConfigurationsContext,
  NotificationContext,
  DimensionsContext,
} from './contexts'
import Router from './routes'
import { NOTIFICATION_DEFAULT, THEME } from '../constants'

import 'react-virtualized/styles.css'

const theme = createTheme(THEME)

const App = () => {
  const [configurations, setConfigurations] = useState([])
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
      <NotificationContext.Provider value={[notification, setNotification]}>
        <ConfigurationsContext.Provider
          value={[configurations, setConfigurations]}
        >
          <AuthContext.Provider value={[user, setUser]}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <StyledEngineProvider injectFirst>
                <Router user={user} setUser={setUser} />
                <Snackbar
                  open={notification.open}
                  message={notification.message}
                  autoHideDuration={2000}
                  onClose={handleNotificationClose}
                />
              </StyledEngineProvider>
            </ThemeProvider>
          </AuthContext.Provider>
        </ConfigurationsContext.Provider>
      </NotificationContext.Provider>
    </DimensionsContext.Provider>
  )
}

export default App
