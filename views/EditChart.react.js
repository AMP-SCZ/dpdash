import React from 'react'

import AppLayout from './layouts/AppLayout'
import EditChartForm from './forms/EditChartForm'

import { editChartForm } from './fe-utils/fetchUtil'
import { routes } from './routes/routes'

const EditChart = () => {
  const handleSubmit = async (e, formValues) => {
    try {
      e.preventDefault()
      const { data } = await editChartForm(formValues)
      window.location.assign(routes.chart(data._id))
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <AppLayout title='Edit a Chart'>
      <EditChartForm handleSubmit={handleSubmit} />
    </AppLayout>
  )
}

export default EditChart
