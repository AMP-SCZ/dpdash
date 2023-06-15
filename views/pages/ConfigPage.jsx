import React from 'react'
import 'whatwg-fetch'
import ConfigurationsList from '../components/ConfigurationsList'

const ConfigPage = (props) => {
  return (
    <React.Fragment>
      <ConfigurationsList
        user={props.user}
        classes={props.classes}
        theme={props.theme}
      />
    </React.Fragment>
  )
}

export default ConfigPage
