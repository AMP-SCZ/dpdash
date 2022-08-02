import { ObjectID } from 'mongodb'

import { collections } from '../utils/mongoCollections'

const postProcessData = (data, studyTotals) => {
  const processedData = {}

  Object.entries(data).forEach((entry) => {
    const [key, count] = entry
    const [study, valueLabel, color, studyTarget] = key.split('-')
    const newEntry = {
      color,
      count,
      valueLabel,
      study,
      studyTarget,
    }

    if (processedData[valueLabel]) {
      processedData[valueLabel] = processedData[valueLabel].concat(newEntry)
    } else {
      processedData[valueLabel] = [newEntry]
    }
  })

  // need the largest horizontal section so that all sites are accounted for
  const largestHorizontalSection = Object.values(processedData).sort(
    (arr1, arr2) => arr2.length - arr1.length
  )[0]

  const notAvailableArray = largestHorizontalSection.map((siteSection) => {
    const totals = studyTotals[siteSection.study]
    const count = totals.targetTotal ? totals.targetTotal - totals.count : 0

    return {
      color: 'grey',
      count,
      valueLabel: 'N/A',
      study: siteSection.study,
      studyTarget: '',
    }
  })

  processedData['N/A'] = notAvailableArray

  return processedData
}

// const studyTotals = {
//   MGB: {
//     count: 0,
//     targetTotal: 20,
//   },
//   Yale: {
//     count: 0,
//     targetTotal: undefined,
//   },
// }

export const graphDataController = async (dataDb, chart_id) => {
  const data = {}
  const studyTotals = {}
  const chart = await dataDb
    .collection(collections.charts)
    .findOne({ _id: ObjectID(chart_id) })
  const allSubjects = await dataDb
    .collection(collections.toc)
    .find(
      {
        assessment: chart.assessment,
        study: { $in: userAccess, $not: { $eq: ['files', 'combined'] } },
      },
      { projection: { collection: 1, study: 1, _id: 0 } }
    )
    .toArray()

  chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
    const { targetValues } = fieldLabelValueMap

    Object.keys(targetValues).forEach((study) => {
      const newTargetValue = targetValues[study]

      if (studyTotals[study]) {
        if (!!studyTotals[study].targetValue) {
          studyTotals[study].targetValue = !!newTargetValue
            ? studyTotals[study].targetValue + parseInt(newTargetValue)
            : undefined
        }
      } else {
        studyTotals[study] = {
          count: 0,
          targetValue: newTargetValue ? parseInt(newTargetValue) : undefined,
        }
      }
    })
  })

  for await (const subject of allSubjects) {
    const { study } = subject
    const subjectDayData = await dataDb
      .collection(subject.collection)
      .find({})
      .toArray()

    chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
      const { color, label, value, targetValues } = fieldLabelValueMap
      const targetValue = targetValues[study]
      const hasValue = subjectDayData.some(
        (dayData) => dayData[chart.variable] == value
      )

      if (hasValue) {
        const dataKey = `${study}-${label}-${color}-${targetValue}`

        if (data[dataKey]) {
          data[dataKey] += 1
        } else {
          data[dataKey] = 1
        }
        console.log(studyTotals, study)
        studyTotals[study].count += 1
      }
    })
  }

  return {
    chart,
    data: postProcessData(data, studyTotals),
  }
}
