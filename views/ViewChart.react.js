import React from 'react'
import { connect } from 'react-redux'

import { Typography } from '@material-ui/core'

import AppLayout from './layouts/AppLayout'
import BarGraph from './components/Graphs/BarGraph'

const ViewChart = ({ graph }) => {
  const { title } = graph
  console.log(graph)
  return (
    <AppLayout
      title={'Chart View'}
    >
      <Typography variant='title' gutterBottom>
        {title.toUpperCase()}
      </Typography>
      <BarGraph />
    </AppLayout>
  )
}

const mapStateToProps = (state) => ({
  graph: state.graph
})
export default connect(mapStateToProps)(ViewChart)
