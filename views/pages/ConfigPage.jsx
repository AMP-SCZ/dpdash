import React, { useContext } from 'react'
import 'whatwg-fetch'
import ConfigurationsList from '../components/ConfigurationsList'
import { AuthContext } from '../contexts/AuthContext'

const ConfigPage = (props) => {
  const user = useContext(AuthContext)

  return (
    <React.Fragment>
      <ConfigurationsList
        user={user}
        classes={props.classes}
        theme={props.theme}
      />
    </React.Fragment>
  )
}

export default ConfigPage
