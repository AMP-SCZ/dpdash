import { ObjectID } from 'mongodb'

import { collections } from '../utils/mongoCollections'

const TOTALS_STUDY = 'Totals'
const STUDIES_TO_OMIT = ['files', 'combined']
const studyCountsToPercentage = (studyCount, targetTotal) => {
  if (!targetTotal || Number.isNaN(+studyCount) || Number.isNaN(+targetTotal)) {
    return 0
  }

  return (+studyCount / +targetTotal) * 100
}

const postProcessData = (data, studyTotals) => {
  const processedDataBySite = new Map()

  for (const [key, count] of data) {
    const [study, valueLabel, targetValue] = key.split('-')
    const totalsForStudy = studyTotals[study]
    const totals = totalsForStudy.targetTotal || totalsForStudy.count
    const percent = studyCountsToPercentage(count, totals)
    const existingEntriesForStudy = processedDataBySite.get(study)

    if (existingEntriesForStudy) {
      processedDataBySite.set(study, {
        ...existingEntriesForStudy,
        counts: {
          ...existingEntriesForStudy.counts,
          [valueLabel]: count,
        },
        percentages: {
          ...existingEntriesForStudy.percentages,
          [valueLabel]: percent,
        },
        targets: {
          ...existingEntriesForStudy.targets,
          [valueLabel]: targetValue,
        },
      })
    } else {
      processedDataBySite.set(study, {
        name: study,
        counts: {
          [valueLabel]: count,
        },
        totalsForStudy,
        percentages: {
          [valueLabel]: percent,
        },
        targets: {
          [valueLabel]: targetValue,
        },
      })
    }
  }

  for (const [study, values] of processedDataBySite) {
    const studySectionTotals = studyTotals[study]
    const count = studySectionTotals.targetTotal
      ? studySectionTotals.targetTotal - studySectionTotals.count
      : 0
    const percent = studyCountsToPercentage(
      count,
      studySectionTotals.targetTotal ?? studySectionTotals.count
    )

    processedDataBySite.set(study, {
      ...values,
      counts: {
        ...values.counts,
        'N/A': count,
      },
      percentages: {
        ...values.percentages,
        'N/A': percent,
      },
    })
  }

  return processedDataBySite
}

export const graphDataController = async (dataDb, userAccess, chart_id) => {
  const labelMap = new Map()
  const data = new Map()
  const studyTotals = {
    [TOTALS_STUDY]: {
      count: 0,
      targetTotal: 0,
    },
  }
  const chart = await dataDb
    .collection(collections.charts)
    .findOne({ _id: ObjectID(chart_id) })
  const allSubjects = await dataDb
    .collection(collections.toc)
    .find(
      {
        assessment: chart.assessment,
        study: { $in: userAccess, $nin: STUDIES_TO_OMIT },
      },
      { projection: { collection: 1, study: 1, _id: 0 } }
    )
    .toArray()

  chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
    const { targetValues } = fieldLabelValueMap

    Object.keys(targetValues).forEach((study) => {
      const rawNewTargetValue = targetValues[study]
      const newTargetValue = !!rawNewTargetValue
        ? +rawNewTargetValue
        : undefined

      if (studyTotals[study]) {
        if (studyTotals[study].targetTotal !== undefined) {
          studyTotals[study].targetTotal = !!newTargetValue
            ? studyTotals[study].targetTotal + newTargetValue
            : undefined
        }
      } else {
        studyTotals[study] = {
          count: 0,
          targetTotal: newTargetValue,
        }
      }

      if (studyTotals[TOTALS_STUDY].targetTotal !== undefined) {
        studyTotals[TOTALS_STUDY].targetTotal = !!newTargetValue
          ? studyTotals[TOTALS_STUDY].targetTotal + newTargetValue
          : undefined
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
      const dataKey = `${study}-${label}-${targetValue}`
      const totalsDataKey = `${TOTALS_STUDY}-${label}`
      labelMap.set(label, { name: label, color })

      if (hasValue) {
        const existingData = data.get(dataKey)
        const existingTotalsData = data.get(totalsDataKey)

        if (existingData) {
          data.set(dataKey, existingData + 1)
        } else {
          data.set(dataKey, 1)
        }

        if (existingTotalsData) {
          data.set(totalsDataKey, existingTotalsData + 1)
        } else {
          data.set(totalsDataKey, 1)
        }

        if (studyTotals[study]) {
          studyTotals[study].count += 1
        } else {
          studyTotals[study] = {
            count: 1,
            targetValue,
          }
        }
        studyTotals[TOTALS_STUDY].count += 1
      } else {
        if (!data.get(dataKey)) {
          data.set(dataKey, 0)
        }
      }
    })
  }
  labelMap.set('N/A', { name: 'N/A', color: '#808080' })

  const dataBySite = postProcessData(data, studyTotals)

  return {
    chart,
    dataBySite: Array.from(dataBySite.values()),
    labels: Array.from(labelMap.values()),
    studyTotals,
  }
}
