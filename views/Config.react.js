import React from 'react'
import 'whatwg-fetch'

import AppLayout from './layouts/AppLayout'
import ConfigurationsList from './components/ConfigurationsList'

const ConfigPage = (props) => {
  return (
    <AppLayout className={props.classes.content}>
      <ConfigurationsList
        user={props.user}
        classes={props.classes}
        theme={props.theme}
      />
    </AppLayout>
  )
}

export default ConfigPage
