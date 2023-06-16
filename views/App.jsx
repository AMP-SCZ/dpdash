import React from 'react'
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

import withRoot from './withRoot'
import AppLayoutTwo from './layouts/AppLayout2'
import ConfigPage from './pages/ConfigPage'
import { UserModel } from './models'
import { styles } from './styles'
import LoginPage from './pages/LoginPage'

const App = (props) => {
  const [user, setUser] = useState(null)

  const fetchUser = async () => {
    const { data } = await UserModel.show('dpdash')
    setUser(data)
  }
  useEffect(() => {
    fetchUser()
  }, [])
  if (!user) return <div>Loading...</div>
  return (
    <Routes>
      <Route path="/" element={<LoginPage classes={props.classes} />} />
      {/* <Route path="/config">
        <AppLayoutTwo classes={props.classes} user={user} theme={props.theme}>
          <ConfigPage user={user} classes={props.classes} theme={props.theme} />
        </AppLayoutTwo>
      </Route> */}
    </Routes>
  )
}

export default withRoot(withStyles(styles, { withTheme: true })(App))
