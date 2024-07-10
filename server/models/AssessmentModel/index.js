import { ALL_SUBJECTS_MONGO_PROJECTION, STUDIES_TO_OMIT } from '../../constants'
import { collections } from '../../utils/mongoCollections'

const AssessmentModel = {
  all: async (db, query) =>
    await db.collection(collections.assessments).find(query).toArray(),
  allForAssessmentRaw: async (db, assessment, variable) => {
    console.log('Assesment : ', assessment, 'Variable : ', variable)
    // const data = this.allForAssessmentRaw(db, chart.assessment, chart.variable)
    // console.log('Data : ', data)
    const data = await db
      .collection(collections.assessmentDayData)
      .find(
        {
          assessment,
          study: { $nin: STUDIES_TO_OMIT },
        },
        {
          projection: ALL_SUBJECTS_MONGO_PROJECTION,
        }
      )
      .toArray()

    const rawData = {}

    for (const document of data) {
      const dayData = document.dayData
      const subjectSite = document.study

      if (!rawData[subjectSite]) {
        rawData[subjectSite] = []
      }

      for (const day of dayData) {
        const rawDayData = day[variable]
        rawData[subjectSite].push(rawDayData)
      }
    }

    console.log('rawData : ', rawData)
    return rawData
  },
  upsert: async (db, query, updatedAttributes) =>
    await db.collection(collections.assessments).findOneAndUpdate(
      query,
      { $set: updatedAttributes },
      {
        upsert: true,
        returnDocument: 'after',
      }
    ),
  withDefaults: (overrides = {}) => ({
    name: '',
    updatedAt: new Date(),
    createdAt: new Date(),
    ...overrides,
  }),
}

export default AssessmentModel
