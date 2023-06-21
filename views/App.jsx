import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'

import withRoot from './hoc/withRoot'
import { AuthContext } from './contexts/AuthContext'
import Router from './routes'
import { styles } from './styles'

import 'react-virtualized/styles.css'

const App = (props) => {
  const [user, setUser] = useState(null)

  return (
    <AuthContext.Provider value={[user, setUser]}>
      <Router {...props} user={user} />
    </AuthContext.Provider>
  )
}

export default withRoot(withStyles(styles, { withTheme: true })(App))
