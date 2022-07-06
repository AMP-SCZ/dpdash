import React from 'react'
import { connect } from 'react-redux'

import { Typography } from '@material-ui/core'

import AppLayout from './layouts/AppLayout'
import BarGraph from './components/Graphs/BarGraph'

const ViewChart = ({ graph }) => {
  const { title } = graph
  return (
    <AppLayout
      title={title.toUpperCase()}
    >
      <Typography variant='title' gutterBottom>
        View Chart 
      </Typography>
      <BarGraph />
    </AppLayout>
  )
}

const mapStateToProps = (state) => ({
  graph: state.graph
})
export default connect(mapStateToProps)(ViewChart)
