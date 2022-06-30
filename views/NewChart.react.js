import React from 'react'

import AppLayout from './layouts/AppLayout'
import ChartForm from './forms/ChartForm'

import { createChart } from './fe-utils/fetchUtil'

import { routes } from './routes/routes'

const NewChart = () => {
  const handleSubmit = async (e, formValues) => {
    try {
      e.preventDefault()
      const { data } = await createChart(formValues)
      window.location.replace(`${routes.charts}/${data}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AppLayout title='Create a Chart'>
      <ChartForm handleSubmit={handleSubmit} />
    </AppLayout>
  )
}

export default NewChart
