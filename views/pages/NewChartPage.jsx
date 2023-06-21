import React from 'react'

import ChartForm from '../forms/ChartForm'

import { createChart } from '../fe-utils/fetchUtil'
import { targetValuesFields } from '../fe-utils/targetValuesUtil'

import { routes } from '../routes/routes'
import { colors } from '../../constants/styles'

const initialValues = (user) => ({
  title: '',
  description: '',
  assessment: '',
  variable: '',
  fieldLabelValueMap: [
    {
      value: '',
      label: '',
      color: colors.dark_sky_blue,
      targetValues: targetValuesFields(user.access),
    },
  ],
  public: false,
})

const NewChartPage = ({ classes, user, navigate }) => {
  const handleSubmit = async (e, formValues) => {
    e.preventDefault()
    const { data } = await createChart(formValues)
    navigate(routes.chart(data.chart_id))
  }

  return (
    <>
      <ChartForm
        classes={classes}
        handleSubmit={handleSubmit}
        initialValues={initialValues(user)}
        studies={user.access}
      />
    </>
  )
}

export default NewChartPage
