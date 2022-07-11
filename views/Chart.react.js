import React from 'react'

import Button from '@material-ui/core/Button'

import AppLayout from './layouts/AppLayout'
import ChartList from './components/ChartList'

import { routes } from './routes/routes'

const Charts = () => {
  return (
    <AppLayout title='Charts'>
      <ChartList />
      <Button
        variant="outlined"
        color="primary"
        href={routes.newChart}
        fullWidth
      >
        {'create a new chart'.toUpperCase()}
      </Button>
    </AppLayout>
  )
}

export default Charts
