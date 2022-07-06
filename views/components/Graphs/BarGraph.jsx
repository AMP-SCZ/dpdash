import React from 'react'
import { connect } from 'react-redux'
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';


const BarGraph = ({ graph }) => {
  console.log(graph)
  return(
    <VictoryChart
      domainPadding={20}
    >
        <VictoryBar 
          data={graph.data}
          x='siteName'
          y='count'
        />
    </VictoryChart>
  )
}

const mapStateToProps = (state) => ({
  graph: state.graph
})

export default connect(mapStateToProps)(BarGraph)
