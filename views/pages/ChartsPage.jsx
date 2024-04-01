import React from 'react'
import { Box, Button } from '@mui/material'
import { Link, useOutletContext } from 'react-router-dom'

import ChartsTable from '../tables/ChartsTable'
import ChartsSearchForm from '../forms/ChartsSearchForm'
import ChartShareForm from '../forms/ChartShareForm'
import PageHeader from '../components/PageHeader'
import { routes } from '../routes/routes'
import useChartsList from '../hooks/useChartsList'

const ChartsPage = () => {
  const { user } = useOutletContext()
  const {
    charts,
    handleSearch,
    onDelete,
    onDuplicate,
    onFavorite,
    onShare,
    onSort,
    sortDirection,
    sortBy,
    chartToShare,
    closeDialog,
    shareWithUsers,
    sharedWithOptions,
    shareFormControl,
    shareFormValues,
    clearSelectedUsers,
    selectAllUsers,
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
          <ChartsSearchForm
            onSubmit={handleSearch}
            initialValues={{
              search: '',
            }}
          />
        }
      />
      <ChartsTable
        charts={charts}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onFavorite={onFavorite}
        onShare={onShare}
        onSort={onSort}
        sortProperty={sortBy}
        sortDirection={sortDirection}
        sortable
        user={user}
      />
      <ChartShareForm
        chartToShare={chartToShare}
        closeDialog={closeDialog}
        shareWithUsers={shareWithUsers}
        sharedWithOptions={sharedWithOptions}
        shareFormControl={shareFormControl}
        shareFormValues={shareFormValues}
        clearSelectedUsers={clearSelectedUsers}
        selectAllUsers={selectAllUsers}
      />
    </Box>
  )
}

export default ChartsPage
