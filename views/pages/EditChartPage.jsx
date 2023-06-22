import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import ChartForm from '../forms/ChartForm'
import { editChart, getChart } from '../fe-utils/fetchUtil'
import { routes } from '../routes/routes'

const EditChartPage = ({ classes, user }) => {
  const { chart_id } = useParams()
  console.log(chart_id)
  const navigate = useNavigate()
  const [chart, setChart] = useState()
  const handleSubmit = async (e, formValues) => {
    e.preventDefault()
    const { data } = await editChart(chartID, formValues)

    if (data.modifiedCount === 1) navigate(routes.chart(chart_id))
  }

  useEffect(() => {
    getChart(chart_id).then(({ data }) => setChart(data))
  }, [chart_id])

  if (!chart) return null

  return (
    <>
      <ChartForm
        classes={classes}
        handleSubmit={handleSubmit}
        initialValues={chart}
        studies={user.access}
      />
    </>
  )
}

export default EditChartPage
