import React from 'react'
import { connect } from 'react-redux'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';


const BarGraph = ({ graph }) => {
  const tickValues = Object.keys(graph.data).map((value) => ++value)
  const tickFormat = [...new Set(graph.data.map(({siteName}) => (siteName)))]
  return(
    <VictoryChart
      domainPadding={20}
      theme={VictoryTheme.material}
    >
      <VictoryAxis
      tickValues={tickValues}
      tickFormat={tickFormat}
    />
                     <VictoryAxis
      dependentAxis
    />
      <VictoryBar data={graph.data} x="siteName" y="count"
          />
    </VictoryChart>
    
  )
}

const mapStateToProps = (state) => ({
  graph: state.graph
})

export default connect(mapStateToProps)(BarGraph)
