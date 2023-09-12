const { MongoClient } = require('mongodb')

const CHART_COLLECTION = 'charts'

async function migrateCharts() {  
  const mongoConnection = await MongoClient.connect(process.env.MONGODB_URI, {
    ssl: process.env.NODE_ENV === 'production',
    useNewUrlParser: true,
  })

  const appDb = mongoConnection.db('dpdmongo')
  const db = mongoConnection.db('dpdata')
  const chartsCursor = await db.collection(CHART_COLLECTION).find({})

  while (await chartsCursor.hasNext()) {
    const chart = await chartsCursor.next()
    await appDb.collection(CHART_COLLECTION).insertOne(chart)
  }

  return mongoConnection
}

module.exports = { migrateCharts }

if (process.env.NODE_ENV !== 'test') {
  migrateCharts()
    .then(async (mongoConnection) => {
      console.log('Done')
      await mongoConnection.close()
      process.exit(0)
    }).catch(async (err) => {
      console.error(err)
      process.exit(1)
    })
  }
