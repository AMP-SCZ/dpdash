import { collections } from '../../utils/mongoCollections'

const AssessmentModel = {
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
