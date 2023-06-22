import React, { useState } from 'react'
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import { AuthContext } from './contexts/AuthContext'
import Router from './routes'
import { styles } from './styles'

import 'react-virtualized/styles.css'

const App = (props) => {
  const [user, setUser] = useState(null)

  return (
    <MuiThemeProvider>
      <CssBaseline />
      <AuthContext.Provider value={[user, setUser]}>
        <Router {...props} user={user} setUser={setUser} />
      </AuthContext.Provider>
    </MuiThemeProvider>
  )
}

export default withStyles(styles, { withTheme: true })(App)
