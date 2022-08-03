import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import AppLayout from './layouts/AppLayout'
import ChartForm from './forms/ChartForm'

import { createChart } from './fe-utils/fetchUtil'
import { chartStyles } from './styles/chart_styles'
import { targetValuesFields } from './fe-utils/targetValuesUtil'

import { routes } from './routes/routes'
import { dark_sky_blue } from './constants/styles'

const initialValues = (user) => ({
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

const NewChart = ({ classes, user }) => {
  const handleSubmit = async (e, formValues) => {
    try {
      e.preventDefault()
      const { data } = await createChart(formValues)
      window.location.assign(routes.chart(data.chart_id))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AppLayout title='Create chart'>
      <ChartForm
        classes={classes}
        handleSubmit={handleSubmit}
        initialValues={initialValues(user)}
        studies={user.userAccess}
      />
    </AppLayout>
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
)(NewChart)
