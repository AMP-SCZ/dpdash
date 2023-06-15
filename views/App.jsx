import React from 'react'
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

import withRoot from './withRoot'
import AppLayoutTwo from './layouts/AppLayout2'
import ConfigPage from './pages/ConfigPage'
import { UserModel } from './models'
import { styles } from './styles'

const App = (props) => {
  console.log(props, 'THE PROPS')
  const [user, setUser] = useState(null)
  const fetchUser = async () => {
    const { data } = await UserModel.show('dpdash')
    console.log(data, 'WHAT IS THIS')
    setUser(data)
  }
  useEffect(() => {
    fetchUser()
  }, [])
  if (!user) return <div>Loading...</div>
  return (
    <AppLayoutTwo
      className={props.classes.content}
      classes={props.classes}
      user={user}
      theme={props.theme}
    >
      <Routes>
        <Route
          path="/"
          element={
            <ConfigPage
              user={user}
              classes={props.classes}
              theme={props.theme}
            />
          }
        />
      </Routes>
    </AppLayoutTwo>
  )
}

export default withRoot(withStyles(styles, { withTheme: true })(App))
