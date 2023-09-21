const { MongoClient } = require('mongodb')

const METADATA_COLLECTION = 'metadata'

async function migrateMetadata() {  
  const mongoConnection = await MongoClient.connect(process.env.MONGODB_URI, {
    ssl: process.env.NODE_ENV === 'production',
    useNewUrlParser: true,
  })

  const appDb = mongoConnection.db('dpdmongo')
  const db = mongoConnection.db('dpdata')
  const metadataCursor = await db.collection(METADATA_COLLECTION).find({})

  while (await metadataCursor.hasNext()) {
    const chart = await metadataCursor.next()
    await appDb.collection(METADATA_COLLECTION).insertOne(chart)
  }

  return mongoConnection
}

module.exports = { migrateMetadata }

if (process.env.NODE_ENV !== 'test') {
  migrateMetadata()
    .then(async (mongoConnection) => {
      console.log('Done')
      await mongoConnection.close()
      process.exit(0)
    }).catch(async (err) => {
      console.error(err)
      process.exit(1)
    })
  }
