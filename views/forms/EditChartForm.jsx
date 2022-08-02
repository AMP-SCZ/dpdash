import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import Form from './Form'
import BarChartFields from './BarChartFields'

import { chartStyles } from '../styles/chart_styles'
import { getChart } from '../fe-utils/fetchUtil'

const ChartForm = ({ classes, handleSubmit, user, graph }) => {
  const [formValues, setFormValues] = useState({})
  const [load, setLoading] = useState(true)

  return (
    <>
      {!load && (
        <Form handleSubmit={(e) => handleSubmit(e, formValues, graph.chart_id)}>
          <BarChartFields
            classes={classes}
            formValues={formValues}
            setFormValues={setFormValues}
            user={user}
          />
          <div className={classes.submitButtonContainer}>
            <Button
              type='submit'
              variant='contained'
              className={classes.textButton}
            >
              Submit Form
            </Button>
          </div>
        </Form>
      )}
    </>
  )
}

const styles = (theme) => ({
  ...chartStyles(theme),
})
const mapStateToProps = (state) => ({
  user: state.user,
  graph: state.graph,
})

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(ChartForm)
