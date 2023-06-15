import React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

function withRoot(Component) {
  function WithRoot(props) {
    console.log(props, 'WHAT IS THIS')
    return (
      <MuiThemeProvider>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    )
  }

  return WithRoot
}

export default withRoot
