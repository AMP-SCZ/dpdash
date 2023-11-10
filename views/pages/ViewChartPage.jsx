import React, { useEffect, useState } from 'react'
import qs from 'qs'
import FileSaver from 'file-saver'
import {
  useParams,
  useOutletContext,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { Typography } from '@mui/material'

import BarGraph from '../components/BarGraph'
import GraphTable from '../components/GraphTable'
import UserAvatar from '../components/UserAvatar'
import ChartFilterForm from '../forms/ChartFilterForm'
import { apiRoutes, routes } from '../routes/routes'
import api from '../api'
import StudiesModel from '../models/StudiesModel'

const ViewChartPage = () => {
  const { setNotification } = useOutletContext()
  const { search } = useLocation()
  const { chart_id } = useParams()
  const navigate = useNavigate()
  const [graph, setGraph] = useState(null)
  const onSubmit = async (filters) => {
    if (!filters.sites.length) {
      setNotification({
        open: true,
        message: 'Please select a site to view data',
      })
    } else {
      const newRoute = routes.viewChart(chart_id, { filters })

      navigate(newRoute)
    }
  }
  const fetchGraph = async (chart_id, filters) =>
    await api.charts.chartsData.show(chart_id, { filters })
  const fetchGraphTableCSV = async (chart_id, filters, filename) => {
    const res = await window.fetch(
      apiRoutes.chartCsv.show(chart_id, { filters }),
      {
        headers: {
          'Content-Type': 'text/csv',
        },
        method: 'GET',
      }
    )
    const graphTableData = await res.blob()

    FileSaver.saveAs(graphTableData, `${filename}.csv`)

    return res
  }

  useEffect(() => {
    const parsedQuery = qs.parse(search.replace(/^\?/, ''))

    fetchGraph(chart_id, parsedQuery.filters).then((newGraph) => {
      setGraph(newGraph)
    })
  }, [chart_id, search])

  if (!graph) return <div>Loading...</div>
  return (
    <>
      {graph.description && (
        <div>
          <div>
            <UserAvatar user={graph.chartOwner} />
            <Typography variant="subtitle2">
              {graph.chartOwner.display_name}
            </Typography>
          </div>
          <Typography variant="subtitle1">{graph.description}</Typography>
        </div>
      )}
      <div>
        <ChartFilterForm
          initialValues={graph.filters}
          onSubmit={onSubmit}
          siteOptions={StudiesModel.dropdownSelectOptions(graph.userSites)}
        />
      </div>
      <BarGraph graph={graph} />
      {!!graph.dataBySite.length && (
        <GraphTable graph={graph} onGetCsv={fetchGraphTableCSV} />
      )}
    </>
  )
}

export default ViewChartPage
