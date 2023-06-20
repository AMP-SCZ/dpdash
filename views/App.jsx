import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

import withRoot from './withRoot'
import MainLayout from './layouts/MainLayout'
import ConfigPage from './pages/ConfigPage'
import { styles } from './styles'
import LoginPage from './pages/LoginPage'
import { AuthContext } from './contexts/AuthContext'
import RequireAuth from './components/hoc/RequiredAuth'
import MainPage from './pages/MainPage'

const App = (props) => {
  const [user, setUser] = useState(null)
  console.log(props)

  return (
    <AuthContext.Provider value={user}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace={true} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route
          element={
            <RequireAuth>
              <MainLayout classes={props.classes} theme={props.theme} />
            </RequireAuth>
          }
        >
          <Route path="configs" element={<ConfigPage />} />
          <Route
            path="main"
            element={
              <MainPage
                user={user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
        </Route>
      </Routes>
    </AuthContext.Provider>
  )
}

export default withRoot(withStyles(styles, { withTheme: true })(App))
