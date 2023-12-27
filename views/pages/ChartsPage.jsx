import React from 'react'
import { Box, Button } from '@mui/material'
import { Link, useOutletContext } from 'react-router-dom'

import ChartsTable from '../tables/ChartsTable'
import PageHeader from '../components/PageHeader'
import ShareChart from '../components/ShareCharts'
import TableSearchForm from '../forms/TableSearchForm'
import { routes } from '../routes/routes'

import useChartsList from '../hooks/useChartsList'

const ChartsPage = () => {
  const { user } = useOutletContext()
  const {
    charts,
    chartToShare,
    closeDialog,
    handleSearch,
    onDelete,
    onDuplicate,
    onFavorite,
    onShare,
    searchOptions,
    searchedCharts,
    shareWithUsers,
    usernames,
  } = useChartsList()

  return (
    <Box sx={{ p: '20px' }}>
      <PageHeader
        title="Charts"
        cta={
          <Button
            component={Link}
            to={routes.newChart}
            variant="contained"
            size="small"
            sx={{ backgroundColor: 'primary.dark', textTransform: 'none' }}
          >
            New chart
          </Button>
        }
        form={
          <TableSearchForm
            name="charts"
            onSubmit={handleSearch}
            initialValues={{
              charts: searchedCharts,
            }}
            allOptions={searchOptions}
          />
        }
      />
      <ChartsTable
        charts={charts}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onFavorite={onFavorite}
        onShare={onShare}
        user={user}
      />
      {!!chartToShare._id && (
        <ShareChart
          chart={chartToShare}
          usernames={usernames}
          handleChange={shareWithUsers}
          handleClose={closeDialog}
        />
      )}
    </Box>
  )
}

export default ChartsPage
