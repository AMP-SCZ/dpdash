import React from 'react'
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
  VictoryLegend,
  VictoryLabel,
  VictoryTooltip,
} from 'victory'

import { graphStyles } from '../../styles/chart_styles'

const BarGraph = ({ graph }) => {
  const transformDataToPercentage = (dataset) => {
    const totals =
      dataset[0]?.map((data, i) => {
        return dataset.reduce((memo, curr) => {
          return memo + curr[i].count
        }, 0)
      }) || []
    return dataset.map((data) => {
      return data.map((datum, i) => {
        return {
          siteName: datum.siteName,
          count: (datum.count / totals[i]) * 100,
          fieldLabel: datum.fieldLabel,
          current: datum.current,
          target: datum.target,
        }
      })
    })
  }

  return (
    <VictoryChart
      domainPadding={20}
      domain={{ x: [0, 6] }}
      theme={VictoryTheme.material}
    >
      <VictoryLegend
        orientation="horizontal"
        gutter={20}
        data={graph.legend}
        x={150}
        y={20}
        labelComponent={<VictoryLabel />}
      />
      <VictoryAxis label="Site" style={graphStyles.xAxis} />
      <VictoryAxis
        label="Total(%)"
        dependentAxis
        style={graphStyles.yAxis}
        tickFormat={(tick) => `${tick}%`}
      />
      <VictoryStack colorScale={graph.chartVariableColors}>
        {transformDataToPercentage(graph.data).map((data, idx) => (
          <VictoryBar
            data={data}
            x="siteName"
            y="count"
            key={idx}
            labels={({ datum: { siteName, current, target, fieldLabel } }) =>
              `Site: ${siteName} \n Value: ${fieldLabel} \n Current: ${current} \n Target: ${target}`
            }
            labelComponent={
              <VictoryTooltip
                constrainToVisibleArea
                style={{ fill: graph.chartVariableColors[idx] }}
              />
            }
          />
        ))}
      </VictoryStack>
    </VictoryChart>
  )
}

export default BarGraph
