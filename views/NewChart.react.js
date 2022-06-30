import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'

import AppLayout from './layouts/AppLayout'
import ChartForm from './forms/ChartForm'

import { createChart } from './fe-utils/fetchUtil'
import getDefaultStyles from './fe-utils/styleUtil'
import { chartStyles } from './styles/chart_styles'

const NewChart = ({ user, classes }) => {
  const handleSubmit = async (e, formValues) => {
    e.preventDefault()
    await createChart(formValues)
  }

  return (
    <div className={classes.root}>
      <AppLayout
        title='Create a Chart'
        user={user}
      />
      <div className={`${classes.content} ${classes.contentPadded}`}>
        <ChartForm 
          classes={classes}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

const styles = theme => ({
  ...getDefaultStyles(theme),
  ...chartStyles(theme)
})

const mapStateToProps = (state) => ({
  user: state.user
})

export default compose(withStyles(styles, { withTheme:true }), connect(mapStateToProps))(NewChart)
