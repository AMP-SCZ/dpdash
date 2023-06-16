import React, { useEffect, useState } from 'react'
import { Routes, Route, Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

import withRoot from './withRoot'
import AppLayoutTwo from './layouts/AppLayout2'
import ConfigPage from './pages/ConfigPage'
import { styles } from './styles'
import LoginPage from './pages/LoginPage'
import { AuthContext } from './contexts/AuthContext'

const App = (props) => {
  const [user, setUser] = useState({})

  if (!user) return <div>Loading...</div>
  return (
    <AuthContext.Provider value={user}>
      <Routes>
        <Route path="/" element={<LoginPage setUser={setUser} />} />
        <Route
          element={<AppLayoutTwo classes={props.classes} theme={props.theme} />}
        >
          <Route
            path="config"
            element={
              // <RequireAuth>
              <ConfigPage classes={props.classes} theme={props.theme} />
              // </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </AuthContext.Provider>
  )
}

export default withRoot(withStyles(styles, { withTheme: true })(App))
