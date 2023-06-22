import React from 'react'
import { useOutletContext } from 'react-router-dom'
import ConfigurationsList from '../components/ConfigurationsList'

const ConfigPage = () => {
  const { user, classes, theme, navigate } = useOutletContext()

  return (
    <React.Fragment>
      <ConfigurationsList
        user={user}
        classes={classes}
        theme={theme}
        navigate={navigate}
      />
    </React.Fragment>
  )
}

export default ConfigPage
