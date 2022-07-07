import React from 'react'
import { connect } from 'react-redux'
import { 
  VictoryBar, 
  VictoryChart, 
  VictoryAxis, 
  VictoryTheme, 
  VictoryStack } from 'victory';


const BarGraph = ({ graph }) => {
  const tickValues = graph.data.map((_, i) => (i))
  const tickFormat = graph.data[0].map(({siteName}) => siteName)
  const handlePercentage = (partialValue, totalValue) => (100 * partialValue) / totalValue
 
  return(
    <VictoryChart
      domainPadding={20}
      domain={{x: [0, 6]}}
      theme={VictoryTheme.material}
    >
      <VictoryAxis
        tickValues={tickValues}
        tickFormat={tickFormat}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(x,_,a) =>  Math.round(handlePercentage(x, a[a.length - 1]))}
      />
    <VictoryStack>
      {graph.data.map((data) => (
        <VictoryBar data={data} x="siteName" y="count"/>
      ))}
    </VictoryStack>
    </VictoryChart>
    
  )
}

const mapStateToProps = (state) => ({
  graph: state.graph
})

export default connect(mapStateToProps)(BarGraph)
