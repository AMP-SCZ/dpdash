import React from 'react'
import { useOutletContext } from 'react-router-dom'
import 'whatwg-fetch'
import ConfigurationsList from '../components/ConfigurationsList'

const ConfigPage = () => {
  const { user, classes, theme } = useOutletContext()

  return (
    <React.Fragment>
      <ConfigurationsList user={user} classes={classes} theme={theme} />
    </React.Fragment>
  )
}

export default ConfigPage
