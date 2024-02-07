import { ObjectId } from 'mongodb'
import chartsShareController from '.'
import {
  createChart,
  createRequestWithUser,
  createResponse,
} from '../../../test/fixtures'

describe('chartsShareController', () => {
  describe('create', () => {
    describe('When successful', () => {
      let appDb

      beforeAll(() => {
        appDb = global.MONGO_INSTANCE.db()
      })
      beforeEach(async () => {
        await appDb.createCollection('charts')
      })
      afterEach(async () => {
        await appDb.collection('charts').drop()
      })
      afterAll(async () => {
        await appDb.dropDatabase()
      })
      it('retusna status of 200 and the new chart id', async () => {
        const sourceChart = new ObjectId()
        const chartId = sourceChart.toString()
        const sharedWith = ['eagle']
        const body = { sharedWith }
        const params = { chart_id: chartId }
        const request = createRequestWithUser({ body, params }, { uid: 'owl' })
        const response = createResponse()
        const chart = createChart({ _id: sourceChart.toString(), sharedWith })

        request.app.locals.appDb.findOneAndUpdate.mockResolvedValueOnce(chart)

        await chartsShareController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: chart,
        })
      })
    })
    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const sourceChart = new ObjectId().toString()
        const sharedWith = ['owl', 'eagle']
        const body = { sharedWith }
        const params = { chart_id: sourceChart }
        const request = createRequestWithUser({ body, params })
        const response = createResponse()

        request.app.locals.appDb.findOneAndUpdate.mockRejectedValueOnce(
          new Error('update error')
        )

        await chartsShareController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'Chart could not be shared',
        })
      })
    })
  })
})
