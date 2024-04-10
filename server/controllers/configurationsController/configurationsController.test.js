import ConfigurationsController from '.'
import {
  createRequestWithUser,
  createResponse,
  createConfiguration,
  createUser,
} from '../../../test/fixtures'
import { collections } from '../../utils/mongoCollections'

describe('ConfigurationsController', () => {
  describe(ConfigurationsController.create, () => {
    const newConfiguration = { body: { name: 'new matrix', owner: 'owl' } }

    describe('When successful', () => {
      const request = createRequestWithUser(newConfiguration)
      const response = createResponse()

      it('sends a status of 200 with a data property when successful', async () => {
        const insertedConfiguration = createConfiguration()

        request.app.locals.appDb.insertOne.mockResolvedValueOnce({
          insertedCount: 1,
          insertedId: 'eagle',
        })
        request.app.locals.appDb.findOne.mockResolvedValueOnce(
          insertedConfiguration
        )

        await ConfigurationsController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: insertedConfiguration,
        })
      })
    })

    describe('When unsuccessful', () => {
      it('sends a status of 400 with a message when database there is an error', async () => {
        const request = createRequestWithUser(newConfiguration)
        const response = createResponse()

        request.app.locals.appDb.insertOne.mockRejectedValueOnce(
          new Error('Rejected error message')
        )

        await ConfigurationsController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'Rejected error message',
        })
      })
    })
  })

  describe(ConfigurationsController.update, () => {
    const configAttributes = { body: { name: 'new matrix', owner: 'owl' } }

    describe('When successful', () => {
      it('sends a status of 200 and with a data payload', async () => {
        const request = createRequestWithUser(configAttributes)
        const response = createResponse()
        const updatedConfiguration = createConfiguration({
          owner: 'owl',
          type: 'new matrix ',
        })

        request.app.locals.appDb.findOneAndUpdate.mockResolvedValueOnce(
          updatedConfiguration
        )

        await ConfigurationsController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: updatedConfiguration,
        })
      })
    })

    describe('When unsuccessful', () => {
      it('sends a status of 422 with a message when database there is an error', async () => {
        const request = createRequestWithUser(configAttributes)
        const response = createResponse()

        request.app.locals.appDb.findOneAndUpdate.mockRejectedValueOnce(
          new Error('mocked error')
        )

        await ConfigurationsController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(422)
        expect(response.json).toHaveBeenCalledWith({
          error: 'mocked error',
        })
      })
    })
  })

  describe(ConfigurationsController.index, () => {
    const params = { uid: 'owl' }

    describe('When successful', () => {
      let appDb
      let user

      beforeAll(async () => {
        user = createUser({
          uid: 'owl',
          preferences: {},
          access: ['YA', 'LA', 'MA'],
          display_name: 'Owl Owlson',
        })
        const secondUser = createUser({
          uid: 'eagle',
          preferences: {},
          access: ['YA', 'LA', 'MA'],
          display_name: 'Eagle Eagleson',
        })
        const configurations = [
          createConfiguration(),
          createConfiguration({
            _id: '2',
            owner: 'eagle',
            readers: ['eagle', 'owl'],
          }),
        ]

        appDb = await global.MONGO_INSTANCE.db('configData')

        await appDb.collection(collections.configs).insertMany(configurations)
        await appDb.collection(collections.users).insertMany([user, secondUser])
      })

      afterAll(async () => {
        await appDb.dropDatabase()
      })

      it('returns a status of 200 and an array of configurations', async () => {
        const result = [
          createConfiguration({ owner_display_name: 'Owl Owlson' }),
          createConfiguration({
            _id: '2',
            owner: 'eagle',
            owner_display_name: 'Eagle Eagleson',
            readers: ['eagle', 'owl'],
          }),
        ]
        const request = createRequestWithUser({
          app: { locals: { appDb } },
          params,
          user,
        })
        const response = createResponse()

        await ConfigurationsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: result,
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const request = createRequestWithUser(params)
        const response = createResponse()

        request.app.locals.appDb.stream.mockRejectedValueOnce(
          new Error('result error')
        )

        await ConfigurationsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'result error',
        })
      })
    })
  })

  describe(ConfigurationsController.destroy, () => {
    const params = { config_id: 'matrix-config' }

    describe('When successful', () => {
      it('returns a status of 200 and a json with a data property', async () => {
        const request = createRequestWithUser(params)
        const response = createResponse()

        request.app.locals.appDb.deleteOne.mockResolvedValueOnce({
          deletedCount: 1,
        })

        await ConfigurationsController.destroy(request, response)

        expect(response.status).toHaveBeenCalledWith(204)
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message property when there is an error', async () => {
        const request = createRequestWithUser(params)
        const response = createResponse()

        request.app.locals.appDb.deleteOne.mockRejectedValueOnce(
          new Error('destroy error')
        )

        await ConfigurationsController.destroy(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'destroy error',
        })
      })
    })
  })
  describe(ConfigurationsController.findOne, () => {
    describe('When successful', () => {
      it('sends a status of 200 with a data property when successful', async () => {
        const config = createConfiguration()
        const params = { config_id: '1' }
        const request = createRequestWithUser(params)
        const response = createResponse()

        request.app.locals.appDb.findOne.mockResolvedValueOnce(config)

        await ConfigurationsController.findOne(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: config,
        })
      })
    })

    describe('When unsuccessful', () => {
      it('sends a status of 400 with a message when database there is an error', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        request.app.locals.appDb.findOne.mockRejectedValueOnce(
          new Error('Rejected error message')
        )

        await ConfigurationsController.findOne(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'Rejected error message',
        })
      })
    })
  })
})
