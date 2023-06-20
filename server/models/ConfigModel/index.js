import { ObjectId } from 'mongodb'
import defaultUserConfig from '../../configs/defaultUserConfig'
import { collections } from '../../utils/mongoCollections'

const ConfigModel = {
  destroy: async (db, configId) => {
    const { deletedCount } = await db
      .collection(collections.configs)
      .deleteOne({ _id: new ObjectId(configId) })

    if (deletedCount !== 1) {
      throw new Error('Unable to delete configuration')
    }
  },
  update: async (db, configId, configAttributes) => {
    const { value } = await db
      .collection(collections.configs)
      .findOneAndUpdate(
        { _id: new ObjectId(configId) },
        { $set: configAttributes },
        { returnOriginal: false }
      )

    if (!value) {
      throw new Error('Could not update configuration')
    }

    return value
  },
  index: async (db, userId) => {
    return await db
      .collection(collections.configs)
      .aggregate(loadAllConfigurationsMongoQuery(userId))
      .toArray()
  },
  save: async (db, configAttributes) => {
    const config = ConfigModel.withDefaults(configAttributes)

    const { insertedId } = await db
      .collection(collections.configs)
      .insertOne(config)

    if (insertedId) return await ConfigModel.findOne(db, { _id: insertedId })

    throw new Error('Could not save configuration')
  },
  findOne: async (db, configQuery) =>
    await db.collection(collections.configs).findOne(configQuery),
  withDefaults: (overrides = {}) => ({
    config: defaultUserConfig,
    name: 'default',
    type: 'matrix',
    created: new Date().toUTCString(),
    ...overrides,
  }),
}

const loadAllConfigurationsMongoQuery = (userId) => {
  const users = 'users'
  const $owner = '$owner'
  const $uid = '$uid'
  const $$owner = '$$owner'
  const resultPropertyName = 'ownerUser'
  const $ownerUser = '$ownerUser'
  const $display_name = '$display_name'

  return [
    { $match: { readers: userId } },
    {
      $lookup: {
        from: users,
        let: { owner: $owner },
        pipeline: [
          {
            $match: {
              $expr: { $eq: [$$owner, $uid] },
            },
          },
          {
            $project: {
              icon: 1,
              uid: 1,
              name: $display_name,
              _id: 0,
            },
          },
        ],
        as: resultPropertyName,
      },
    },
    { $unwind: $ownerUser },
  ]
}

export default ConfigModel