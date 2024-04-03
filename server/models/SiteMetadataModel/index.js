import { collections } from '../../utils/mongoCollections'

const queryOptions = {
  upsert: true,
  returnDocument: 'after',
}
const SiteMetadataModel = {
  findOne: async (db, query) =>
    await db.collection(collections.metadata).findOne(query),
  upsert: async (db, query, { setAttributes, addToSetAttributes }) =>
    await db.collection(collections.metadata).findOneAndUpdate(
      query,
      {
        $set: { ...(setAttributes || {}), updatedAt: new Date() },
        $addToSet: Object.keys(addToSetAttributes || {}).length
          ? { ...addToSetAttributes, createdAt: new Date() }
          : {},
      },
      queryOptions
    ),
}

export default SiteMetadataModel
