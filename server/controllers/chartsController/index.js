import { ObjectId } from 'mongodb'
import deepEqual from 'deep-equal'
import { collections } from '../../utils/mongoCollections'
import { SITE_NAMES } from '../../utils/siteNames'
import {
  generateStudyTargetTotals,
  isAnyTargetIncluded,
  postProcessData,
  processData,
  processTotals,
  mongoQueryFromFilters,
} from './helpers'
import {
  N_A,
  TOTALS_STUDY,
  STUDIES_TO_OMIT,
  DEFAULT_CHART_FILTERS,
  EMPTY_VALUE,
  INCLUSION_EXCLUSION_CRITERIA_FORM,
  ALL_SUBJECTS_MONGO_PROJECTION,
} from '../../constants'

export const graphDataController = async (
  dataDb,
  userAccess,
  chart_id,
  parsedQueryParams
) => {
  const labelMap = new Map()
  const dataMap = new Map()
  const filters = parsedQueryParams.filters || DEFAULT_CHART_FILTERS
  const chart = await dataDb
    .collection(collections.charts)
    .findOne({ _id: ObjectId(chart_id) })
  const allSubjects = await getAllSubjects({
    dataDb,
    chart,
    userAccess,
    filters,
  })
  const allowedStudies = userAccess.filter(
    (study) => !STUDIES_TO_OMIT.includes(study)
  )
  const studyTotals = generateStudyTargetTotals(chart, allowedStudies)

  for await (const subject of allSubjects) {
    const { study } = subject
    const subjectDayData = await dataDb
      .collection(subject.collection)
      .find({})
      .toArray()

    chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
      const { color, label, value, targetValues } = fieldLabelValueMap
      const targetValue = targetValues[study]
      const siteName = SITE_NAMES[study] || study
      const dataKey = `${siteName}-${label}-${targetValue}`
      const totalsDataKey = `${TOTALS_STUDY}-${label}`
      const isVariableValueEmpty = value === EMPTY_VALUE
      const shouldCountSubject = isVariableValueEmpty
        ? subjectDayData.every((day) => day[chart.variable] === value)
        : subjectDayData.some((dayData) => dayData[chart.variable] == value)

      labelMap.set(label, { name: label, color })
      processData({ shouldCountSubject, dataMap, dataKey, totalsDataKey })
      processTotals({
        shouldCountSubject,
        studyTotals,
        siteName,
        targetValue,
      })
    })
  }

  const dataBySite = postProcessData(dataMap, studyTotals)

  if (isAnyTargetIncluded(studyTotals)) {
    labelMap.set(N_A, { name: N_A, color: '#808080' })
  }

  return {
    chart,
    dataBySite: allSubjects.length > 0 ? Array.from(dataBySite.values()) : [],
    labels: Array.from(labelMap.values()),
    studyTotals,
    filters,
  }
}

const getAllSubjects = async ({ dataDb, chart, userAccess, filters }) => {
  const { assessment } = chart
  const allFiltersSelected = deepEqual(filters, DEFAULT_CHART_FILTERS)

  if (allFiltersSelected) {
    return await dataDb
      .collection(collections.toc)
      .find(
        {
          assessment,
          study: { $in: userAccess, $nin: STUDIES_TO_OMIT },
        },
        { projection: ALL_SUBJECTS_MONGO_PROJECTION }
      )
      .toArray()
  } else {
    const mongoFilterQuery = mongoQueryFromFilters(filters)
    const filteredSubjects = []
    const criteriaCursor = await dataDb.collection(collections.toc).find(
      {
        assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
        study: { $in: userAccess, $nin: STUDIES_TO_OMIT },
      },
      {
        projection: ALL_SUBJECTS_MONGO_PROJECTION,
      }
    )

    for await (let doc of criteriaCursor) {
      const data = await dataDb
        .collection(doc.collection)
        .findOne({ $or: mongoFilterQuery })

      if (data) filteredSubjects.push(data.subjectid)
    }

    return await dataDb
      .collection(collections.toc)
      .find(
        {
          assessment,
          subject: { $in: filteredSubjects },
        },
        { projection: ALL_SUBJECTS_MONGO_PROJECTION }
      )
      .toArray()
  }
}
