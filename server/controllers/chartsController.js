import { collections } from '../utils/mongoCollections'
import {
  siteAndAssessmentSubjects,
  legendQuery,
} from '../aggregates/chartAggregates'

const postProcessData = (data) => {
  const processedData = {}

  Object.entries(data).forEach((entry) => {
    const [key, count] = entry
    const [study, label, color] = key.split('-')
    const newEntry = {
      color,
      count,
      label,
      study,
    }

    if (processedData[label]) {
      processedData[label] = processedData[label].concat(newEntry)
    } else {
      processedData[label] = [newEntry]
    }
  })

  return processedData
}

export const graphDataController = async (dataDb, userAccess, chart_id) => {
  const chart = await dataDb
    .collection(collections.charts)
    .findOne({ _id: ObjectId(chart_id) })
  const allSubjects = await dataDb
    .collection(collections.charts)
    .aggregate(siteAndAssessmentSubjects(chart_id, userAccess))
    .toArray()

  const data = {}

  for await (const subject of allSubjects) {
    const { study } = subject

    chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
      const { color, label, value } = fieldLabelValueMap
      const hasValue = subject[chart.variable] === value

      if (hasValue) {
        const dataKey = `${study}-${label}-${color}`

        if (data[dataKey]) {
          data[dataKey] += 1
        } else {
          data[dataKey] = 1
        }
      }
    })
  }

  return {
    chart,
    data: postProcessData(data),
  }
}

export const fieldValuesController = async (dataDb, chart_id) =>
  await dataDb
    .collection(collections.charts)
    .aggregate(legendQuery(chart_id))
    .toArray()
