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
  VictoryZoomContainer,
} from 'victory'

import { colors } from '../../../constants/styles'
import { graphStyles } from '../../styles/chart_styles'
import { toolTipPercent } from '../../fe-utils/tooltipUtil'

const NOT_AVAILABLE = 'N/A'
const TOTALS_STUDY = 'Totals'
const DEFAULT_ZOOM = 6

const tooltipText = (graph, datum) => {
  const { study, studyTarget, count, valueLabel } = datum
  if (graph.studyTotals[study]) {
    const { targetTotal, count: studyTotalCount } = graph.studyTotals[study]
    const showToolTip =
      study && count && study !== TOTALS_STUDY && valueLabel !== NOT_AVAILABLE
    return showToolTip
      ? `${study} target: ${targetTotal} (100%)\n${study} current: ${studyTotalCount} (${toolTipPercent(
          studyTotalCount,
          targetTotal
        )}%)\n${valueLabel} target: ${studyTarget} (${toolTipPercent(
          studyTarget,
          targetTotal
        )}%)\n${valueLabel} current: ${count} (${toolTipPercent(
          count,
          targetTotal
        )}%)`
      : null
  }
}

const LabelWithTooltip = ({ hoverData, ...props }) => {
  const isTooltipActive =
    !!hoverData &&
    hoverData.group === props.datum._group &&
    hoverData.stack === props.datum._stack &&
    hoverData.text

  return (
    <g>
      <VictoryLabel
        {...props}
        dy={15}
        style={{ fill: colors.anti_flash_white, fontSize: 7 }}
      />
      <VictoryTooltip
        {...props}
        text={hoverData?.text}
        active={isTooltipActive}
        style={{ fontSize: 7, textAnchor: 'start', padding: 5 }}
      />
    </g>
  )
}

const BarGraph = ({ graph }) => {
  const [hoverData, setHoverData] = React.useState()
  const siteDataPerChartValue = Object.values(graph.data)
  const numSitesPerValue = siteDataPerChartValue.map((value) => value.length)
  const numSites = Math.max(...numSitesPerValue)
  const initialZoom = Math.min(numSites, DEFAULT_ZOOM)

  return (
    <VictoryChart
      domainPadding={10}
      domain={{ x: [0, numSites], y: [0, 100] }}
      theme={VictoryTheme.material}
      containerComponent={
        <VictoryZoomContainer
          allowZoom={false}
          allowPan={numSites > initialZoom}
          zoomDomain={{ x: [0, initialZoom + 0.5] }}
        />
      }
    >
      <VictoryLegend
        orientation="horizontal"
        gutter={20}
        data={graph.legend}
        x={125}
        y={20}
        labelComponent={<VictoryLabel />}
      />
      <VictoryAxis label="Site" style={graphStyles.xAxis} />
      <VictoryAxis
        label="Total"
        dependentAxis
        style={graphStyles.yAxis}
        tickFormat={(yAxisValue) => `${yAxisValue}%`}
      />
      <VictoryStack labelComponent={<LabelWithTooltip hoverData={hoverData} />}>
        {siteDataPerChartValue.map((data, idx) => (
          <VictoryBar
            data={data}
            x="study"
            y="percent"
            key={idx}
            style={{
              data: {
                fill: ({ datum }) => datum.color,
              },
            }}
            labels={({ datum }) =>
              !!datum?.percent ? `${datum.percent.toFixed(0)}%` : null
            }
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onMouseOver: () => {
                    return [
                      {
                        mutation: (props) => {
                          setHoverData({
                            group: props.datum._group,
                            stack: props.datum._stack,
                            text: tooltipText(graph, props.datum),
                          })

                          return {
                            ...props,
                            style: {
                              ...props.style,
                              stroke: colors.black,
                              strokeWidth: 1,
                            },
                          }
                        },
                      },
                    ]
                  },
                  onMouseOut: () => {
                    setHoverData(undefined)
                    return [
                      {
                        mutation: () => {
                          return null
                        },
                      },
                    ]
                  },
                },
              },
            ]}
          />
        ))}
      </VictoryStack>
    </VictoryChart>
  )
}

export default BarGraph
