import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import getDefaultStyles from './fe-utils/styleUtil';

import AppLayout from './layouts/AppLayout'

const ViewChart = (props) => {
  const { user, classes } = props
  console.log(props.chart)
  return (
    <div className={classes.root}>
      <AppLayout
        title='View Chart'
        user={user}
      />
      <div className={`${classes.content} ${classes.contentPadded}`}>
        <Typography variant='title' gutterBottom>
          View Chart 
        </Typography>
      </div>
    </div>
  )
}

const styles = theme => ({
  ...getDefaultStyles(theme),
})

const mapStateToProps = (state) => ({
  user: state.user,
  chart: state.graph
})

export default compose(withStyles(styles, { withTheme: true }), connect(mapStateToProps))(ViewChart)
