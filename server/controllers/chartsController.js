import { collections } from '../utils/mongoCollections'
import {
  siteAndAssessmentSubjects,
  legendQuery,
} from '../aggregates/chartAggregates'

export const graphDataController = async (dataDb, userAccess, chart_id) => {
  // Get all the assessment's subjects for each site
  const chart = await dataDb
    .collection(collections.charts)
    .findOne({ _id: ObjectId(chart_id) })
  const allSubjects = await dataDb
    .collection(collections.charts)
    .aggregate(siteAndAssessmentSubjects(chart_id, userAccess))
    .toArray()

  const allCounts = {}
  chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
    allCounts[fieldLabelValueMap.label] = {}
  })
  // For each site's subjects
  for await (const subject of allSubjects) {
    const { study } = subject // site and study are the same thing
    allCounts[fieldLabelValueMap.label][study] =
      allCounts[fieldLabelValueMap.label][study] || 0

    // For each value/label pair
    chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
      const hasValue = subject[chart.variable] === fieldLabelValueMap.value

      if (hasValue) {
        allCounts[fieldLabelValueMap.label][study] += 1
      }
    })
  }

  return {
    chart,
    allCounts,
  }
}

// Front-end logic
// const labels = Object.keys(allCounts)
// labels.map((label) => {
//   Object.keys(allCounts[label]).map((site) => {
//     return { x: site, y: allCounts[label][site] }
//   })
// })

// allCounts
// {
// black: {
// yale: 0,
// usc: 1,
// },
// white: {
// yale: 1,
// usc: 10,
// },
// hispanic: {
// yale: 11,
// usc: 12,
// },
// [label]: {
// [site]: [count]
// }
// }

export const fieldValuesController = async (dataDb, chart_id) =>
  await dataDb
    .collection(collections.charts)
    .aggregate(legendQuery(chart_id))
    .toArray()
