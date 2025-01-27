import React, { useEffect, useState } from 'react'

import { Box, Typography, useMediaQuery } from '@mui/material'
import dayjs from 'dayjs'
import advanced from 'dayjs/plugin/advancedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import FileSaver from 'file-saver'
import qs from 'qs'
import { useParams, useLocation, useNavigate } from 'react-router-dom'

import { SORT_DIRECTION, fontSize, TOTALS } from '../../../constants'
import api from '../../api'
import BarGraph from '../../components/BarGraph'
import ChartDescription from '../../components/ChartDescription'
import GraphTable from '../../components/GraphTable'
import PageHeader from '../../components/PageHeader'
import ChartFilterForm from '../../forms/ChartFilterForm'
import useTableSort from '../../hooks/useTableSort'
import { ChartFiltersModel } from '../../models'
import { apiRoutes, routes } from '../../routes/routes'

import './ViewChartPage.css'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advanced)

const tooltipWidth = 235
const staticYPosition = 75

const ViewChartPage = () => {
  const { search } = useLocation()
  const { chart_id } = useParams()
  const [graph, setGraph] = useState(null)
  const [xAxisWidth, setXAxisWidth] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({})
  const [displayLeft, setDisplayLeft] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const shortDescription = graph?.description?.substring(0, 296) + '...' || ''
  const handleDescriptionExpand = () => setExpanded(!expanded)
  const navigate = useNavigate()
  const { onSort, sortDirection, sortBy } = useTableSort('site')
  const onSubmit = async (formValues) => {
    const filters = ChartFiltersModel.formValuesToRequestFilters(
      formValues,
      graph.filters
    )

    const newRoute = routes.viewChart(chart_id, { filters })

    navigate(newRoute)
  }
  const fetchGraph = async (chart_id, filters) =>
    await api.charts.chartsData.show(chart_id, { filters })

  const fetchGraphTableCSV = async (chart_id, filters, filename) => {
    const res = await fetch(apiRoutes.chartCsv.show(chart_id, { filters }), {
      headers: {
        'Content-Type': 'text/csv',
      },
      method: 'GET',
    })
    const graphTableData = await res.blob()

    FileSaver.saveAs(graphTableData, `${filename}.csv`)

    return res
  }
  const handleNavigateToChartPage = () => navigate('charts')
  const handleTooltipPosition = ({ chartWidth, xCoordinate }) => {
    const isXCoordinateGreater = chartWidth - tooltipWidth < xCoordinate

    if (isXCoordinateGreater) {
      setTooltipPosition({ x: xCoordinate - tooltipWidth, y: staticYPosition })
      setDisplayLeft(false)
    } else {
      setTooltipPosition({ x: xCoordinate, y: staticYPosition })
      setDisplayLeft(true)
    }
  }
  const graphDisplayParams = {
    sm: {
      isSm: useMediaQuery('(max-width:600px)'),
      barsToDisplay: 3,
    },
    tablet: {
      isTablet: useMediaQuery('(min-width:600px) and (max-width:900px)'),
      barsToDisplay: 4,
    },
    md: {
      isMd: useMediaQuery('(min-width:1100px) and (max-width:1500px)'),
      barsToDisplay: 6,
    },
    lg: {
      isLg: useMediaQuery('(min-width:2000px)'),
      barsToDisplay: 10,
    },
  }
  const handleChangePage = (_, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const graphTablePredicate = (a, b) => {
    if (a[sortBy] === TOTALS || b[sortBy] === TOTALS) return 1
    if (b[sortBy] < a[sortBy]) {
      return sortDirection === SORT_DIRECTION.ASC ? 1 : -1
    }
    if (b[sortBy] > a[sortBy]) {
      return sortDirection === SORT_DIRECTION.ASC ? -1 : 1
    }
    return 0
  }
  const visibleRows = () => {
    if (!graph) return []

    return graph.graphTable.tableRows
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .sort(graphTablePredicate)
  }

  useEffect(() => {
    const parsedQuery = qs.parse(search.replace(/^\?/, ''))

    fetchGraph(chart_id, parsedQuery.filters).then((newGraph) => {
      setGraph(newGraph)
    })
  }, [chart_id, search])

  if (!graph) return <div>Loading...</div>

  const shouldDisplaySiteName = () => {
    if (graphDisplayParams.sm.isSm)
      return graph.dataBySite.length <= graphDisplayParams.sm.barsToDisplay
    if (graphDisplayParams.tablet.isTablet)
      return graph.dataBySite.length <= graphDisplayParams.tablet.barsToDisplay
    if (graphDisplayParams.md.isMd)
      return graph.dataBySite.length <= graphDisplayParams.md.barsToDisplay
    if (graphDisplayParams.lg.isLg)
      return graph.dataBySite.length <= graphDisplayParams.lg.barsToDisplay
  }
  const useSiteName = shouldDisplaySiteName()

  return (
    <Box sx={{ p: '25px' }}>
      <PageHeader
        title={graph.title}
        onNavigate={handleNavigateToChartPage}
        isDescription
        description={
          <ChartDescription
            description={graph.description || ''}
            shortDescription={shortDescription}
            onExpand={handleDescriptionExpand}
            expanded={expanded}
          />
        }
      />
      <div className="ChartPageDetails">
        <Typography
          sx={{
            color: 'grey.A400',
            fontSize: fontSize[14],
            gridColumnStart: 1,
            gridColumnEnd: 4,
          }}
        >
          Last Modified:
          {graph.lastModified
            ? dayjs(graph.lastModified).format('MMM D YYYY @ hh:mm Z')
            : ''}
        </Typography>
        <span className="ChartPageOwner">
          <Typography
            sx={{
              color: 'grey.A400',
              fontSize: fontSize[14],
            }}
          >
            Created by:
          </Typography>
          <Typography
            sx={{
              fontSize: fontSize[14],
              pl: '4px',
            }}
          >
            {` ${graph.chartOwner.display_name}`}
          </Typography>
        </span>
      </div>
      <ChartFilterForm initialValues={graph.filters} onSubmit={onSubmit} />
      <BarGraph
        graph={graph}
        tooltipPosition={tooltipPosition}
        handleTooltipPosition={handleTooltipPosition}
        displayLeft={displayLeft}
        setXAxisWidth={setXAxisWidth}
        xAxisWidth={xAxisWidth}
        useSiteName={useSiteName}
      />
      {!!graph.dataBySite.length && (
        <GraphTable
          graph={graph}
          onGetCsv={fetchGraphTableCSV}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          tableColumns={graph.graphTable.tableColumns}
          tableRows={visibleRows()}
          rowCount={graph.graphTable.tableRows.length}
          onSort={onSort}
          sortDirection={sortDirection}
          sortBy={sortBy}
        />
      )}
    </Box>
  )
}

export default ViewChartPage
