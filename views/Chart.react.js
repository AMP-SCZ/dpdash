import React from 'react'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'

import getDefaultStyles from './fe-utils/styleUtil';

import AppLayout from './layouts/AppLayout'

import { routes } from './routes/routes'

const Charts = (props) => {
  const { user, classes } = props

  return (
    <div className={classes.root}>
      <AppLayout
        title='Charts'
        user={user}
      />
      <div className={`${classes.content} ${classes.contentPadded}`}>
        <Button
          variant="outlined"
          color="primary"
          href={routes.newChart}
        >
          New Chart
        </Button>
      </div>
    </div>
  )
}

const styles = theme => ({
  ...getDefaultStyles(theme),
})

const mapStateToProps = (state) => ({
  user: state.user
})

export default compose(
  withStyles(
    styles, 
    { withTheme: true }
  ), 
  connect(mapStateToProps)
)(Charts)
