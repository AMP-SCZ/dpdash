import { collections } from '../utils/mongoCollections'
import {
  siteAndAssessmentSubjects,
  legendQuery,
} from '../aggregates/chartAggregates'

var postProcessData = (data) => {
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
  // Get all the assessment's subjects for each site
  const chart = await dataDb
    .collection(collections.charts)
    .findOne({ _id: ObjectId(chart_id) })
  const allSubjects = await dataDb
    .collection(collections.charts)
    .aggregate(siteAndAssessmentSubjects(chart_id, userAccess))
    .toArray()

  const data = {}

  // For each site's subjects
  for await (const subject of allSubjects) {
    const { study } = subject // site and study are the same thing

    // For each value/label pair
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

  // dataObj
  // var dataObj = {
  //   'Yale-Male-#000': 10,
  //   'MGB-Male-#000': 5,
  //   'Yale-Female-#000': 4,
  //   'MGB-Female-#000': 18,
  // }

  // var formattedData = {
  //   Male: [
  //     {
  //       count: 10,
  //       site: 'Yale',
  //       target: 15,
  //       value: 'Male',
  //     },
  //     {
  //       count: 5,
  //       site: 'MGB',
  //       target: 12,
  //       value: 'Male',
  //     },
  //   ],
  //   Female: [
  //     {
  //       count: 4,
  //       site: 'Yale',
  //       target: 18,
  //       value: 'Female',
  //     },
  //     {
  //       count: 18,
  //       site: 'MGB',
  //       target: 13,
  //       value: 'Female',
  //     },
  //   ],
  // }

// Front-end logic
// const labels = Object.keys(allCounts)
// labels.map((label) => {
//   Object.keys(allCounts[label]).map((site) => {
//     return { x: site, y: allCounts[label][site] }
//   })
// })

// data []
// [
// {
//   study: 'Yale',
//   label: 'Gender',
//   value: 'male',
//   color: '#fff',
// },
// {
//   study: 'Yale',
//   label: 'Gender',
//   value: 'female',
//   color: '#000',
// },
// ]

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
