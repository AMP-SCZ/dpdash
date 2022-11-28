import { MongoClient, ObjectId } from 'mongodb'
import config from '../configs/config.js'
import getMongoURI from '../utils/mongoUtil.js'
import { calculatePreferences } from './helpers.js'

async function migrateUsers() {
  try {
    const mongoURI = getMongoURI({ settings: config.database.mongo })
    const mongo = new MongoClient(mongoURI, config.database.mongo.server)
    const appDatabase = mongo.db()
    await appDatabase
      .collection('users')
      .find({})
      .forEach((user) => {
        const isUserMigrated = !!user.siteSubjects?.length
        if (!isUserMigrated) {
          const { siteSubjects, updatedPreferences } =
            calculatePreferences(user)

          appDatabase.collection('users').updateOne(
            { _id: ObjectId(user._id) },
            {
              $set: {
                preferences: updatedPreferences,
                siteSubjects,
                legacyPreferences: JSON.stringify(user.preferences),
              },
              //removes the field and the value from the document
              $unset: {
                account_expires: '',
                'preferences.star': '',
                'preferences.complete': '',
              },
            }
          )
        }
      })
    process.exit(1)
  } catch (error) {
    console.error(error)
  }
}

export { migrateUsers }
