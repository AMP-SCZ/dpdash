import { collections } from '../../utils/mongoCollections'

const AssessmentDayDataModel = {
  all: async (db, query) =>
    await db.collection(collections.assessmentDayData).find(query),
  findOne: async (db, query) =>
    await db.collection(collections.assessmentDayData).findOne(query),
  create: async (db, participantData) =>
    await db
      .collection(collections.assessmentDayData)
      .insertOne(participantData),
  createMany: async (db, assessmentDayData) =>
    await db
      .collection(collections.assessmentDayData)
      .insertMany(assessmentDayData),
  update: async (db, query, assessmentDayDataAttributes) =>
    await db
      .collection(collections.assessmentDayData)
      .updateOne(query, { $set: assessmentDayDataAttributes }),
}

export default AssessmentDayDataModel
