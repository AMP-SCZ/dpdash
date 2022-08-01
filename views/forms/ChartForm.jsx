import React, { useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import Form from './Form'
import BarChartFields from './BarChartFields'

import { chartStyles } from '../styles/chart_styles'
import { dark_sky_blue } from '../constants/styles'

import { targetValuesFields } from '../fe-utils/targetValuesUtil'

const ChartForm = ({ classes, handleSubmit, user }) => {
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    assessment: '',
    variable: '',
    fieldLabelValueMap: [
      {
        value: '',
        label: '',
        color: dark_sky_blue,
        targetValues: targetValuesFields(user.userAccess),
      },
    ],
  })

  return (
    <Form handleSubmit={(e) => handleSubmit(e, formValues)}>
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
  )
}

const styles = (theme) => ({
  ...chartStyles(theme),
})
const mapStateToProps = (state) => ({
  user: state.user,
})

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(ChartForm)
