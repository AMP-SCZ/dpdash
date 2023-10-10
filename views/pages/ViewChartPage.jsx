import React, { useEffect, useState } from 'react'
import FileSaver from 'file-saver'
import { useParams, useOutletContext } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Typography } from '@material-ui/core'
import BarGraph from '../components/BarGraph'
import GraphTable from '../components/GraphTable'
import UserAvatar from '../components/UserAvatar'
import ChartFilterForm from '../forms/CharFilterForm'
import { apiRoutes } from '../routes/routes'
import api from '../api'
import UsersModel from '../models/UsersModel'
import { omitSites } from '../fe-utils/helpers'

const ViewChartPage = () => {
  const { classes, user, setNotification } = useOutletContext()
  const { chart_id } = useParams()
  const [graph, setGraph] = useState(null)
  const allowedSites = omitSites(user.access)
  const siteOptions = UsersModel.userAccessDropdownOptions(allowedSites)
  const { handleSubmit, control, reset } = useForm()
  const handleFormSubmit = async (updatedFilters) => {
    if (!updatedFilters.sites.length) {
      setNotification({
        open: true,
        message: 'Please select a site to view data',
      })
    } else {
      updatedFilters.sites = updatedFilters.sites.map((filter) => filter.value)

      const graph = await fetchGraph(chart_id, updatedFilters)

      graph.filters.sites = Object.values(graph.filters.sites).map((site) => ({
        label: site,
        name: site,
      }))

      setGraph(graph)
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
    fetchGraph(chart_id).then((graph) => {
      graph.filters.sites = siteOptions

      setGraph(graph)
      reset(graph.filters)
    })
  }, [])

  if (!graph) return <div>Loading...</div>
  return (
    <>
      {graph.description && (
        <div className={classes.viewChartRow}>
          <div className={classes.chartAvatarContainer}>
            <UserAvatar user={graph.chartOwner} />
            <Typography variant="subtitle2" className={classes.chartAvatarName}>
              {graph.chartOwner.display_name}
            </Typography>
          </div>
          <Typography variant="subtitle1">{graph.description}</Typography>
        </div>
      )}
      <div className={classes.filterFormContainer}>
        <ChartFilterForm
          initialValues={graph.filters}
          onSubmit={handleSubmit(handleFormSubmit)}
          classes={classes}
          control={control}
          siteOptions={siteOptions}
        />
      </div>
      <BarGraph graph={graph} classes={classes} />
      {!!graph.dataBySite.length && (
        <GraphTable
          graph={graph}
          classes={classes}
          onGetCsv={fetchGraphTableCSV}
        />
      )}
    </>
  )
}

export default ViewChartPage
