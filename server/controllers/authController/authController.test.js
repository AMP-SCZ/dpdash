import AuthController from '.'
import {
  createRequestWithUser,
  createResponse,
  createUser,
} from '../../../test/fixtures'

afterEach(() => {
  jest.clearAllMocks()
})
describe('AuthController', () => {
  describe(AuthController.destroy, () => {
    describe('When successful', () => {
      it('returns a status of 200 and success data message', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        request.session.destroy.mockResolvedValueOnce()
        request.logout.mockResolvedValueOnce()

        await AuthController.destroy(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: { message: 'User is logged out' },
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 500 and an error message', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        request.session.destroy.mockRejectedValueOnce(new Error('some error'))

        await AuthController.destroy(request, response)

        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.json).toHaveBeenCalledWith({
          error: 'some error',
        })
      })
    })
  })
  describe(AuthController.show, () => {
    describe('When successful', () => {
      it('returns a status of 200 and a user object', async () => {
        const request = createRequestWithUser()
        const response = createResponse()
        const user = createUser()

        request.app.locals.appDb.findOne.mockResolvedValueOnce(user)

        await AuthController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: user,
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        request.app.locals.appDb.findOne.mockRejectedValueOnce(
          new Error('some error')
        )

        await AuthController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'some error',
        })
      })
    })
  })

  describe(AuthController.update, () => {
    describe('When successful', () => {
      it('Resets the user password and returns a user object', async () => {
        const request = createRequestWithUser({
          body: {
            username: 'username',
            password: 'newpass',
            confirmpw: 'newpass',
            reset_key: 'reset_key',
          },
        })
        const response = createResponse()
        const user = createUser({
          password: 'oldpass',
          reset_key: 'reset_key',
        })

        const mockFindOne = jest.fn().mockResolvedValueOnce(user)
        const mockFindOneAndUpdate = jest.fn().mockResolvedValueOnce({ value: {...user, reset_key: ''} })
        request.app.locals.appDb.collection = jest.fn().mockImplementation(() => (
          {
            findOne: mockFindOne,
            findOneAndUpdate: mockFindOneAndUpdate,
          }
        ))

        await AuthController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(mockFindOne).toHaveBeenCalledWith({
          uid: 'username',
          reset_key: 'reset_key',
        }, 
        {
          projection: {
            _id: 0,
            password: 0,
            bad_pwd_count: 0,
            lockout_time: 0,
            last_logoff: 0,
            last_logon: 0,
            force_reset_pw: 0,
          }
        })
        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
          { uid: 'username' },
          {
            $set: {
              password: expect.any(String),
              reset_key: '',
              force_reset_pw: false,
            }
          },
          {
            projection: {
              _id: 0,
              password: 0,
              bad_pwd_count: 0,
              lockout_time: 0,
              last_logoff: 0,
              last_logon: 0,
              force_reset_pw: 0,
            },
            returnOriginal: false,
            upsert: true,
            returnDocument: 'after',
          })
        expect(response.json).toHaveBeenCalledWith({
          data: {
            ...user,
            reset_key: ''
          },
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error', async () => {
        const request = createRequestWithUser({
          body: {
            username: 'username',
            password: 'newpass',
            confirmpw: 'newpass',
            reset_key: 'reset_key',
          },
        })
        const response = createResponse()
        const user = createUser({
          password: 'oldpass',
          reset_key: 'reset_key',
        })

        const mockFindOne = jest.fn().mockResolvedValueOnce(null)
        request.app.locals.appDb.collection = jest.fn().mockImplementation(() => (
          {
            findOne: mockFindOne,
          }
        ))

        await AuthController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
      })
    })

    describe('When sent non-string values', () => {
      it('stringifies the value before querying the database', async () => {
        const request = createRequestWithUser({
          body: {
            username: {
              $nin: []
            },
            password: 'newpass',
            confirmpw: 'newpass',
            reset_key: {
              $nin: [],
            }
          },
        })
        const response = createResponse()
        const user = createUser({
          password: 'oldpass',
          reset_key: 'reset_key',
        })

        const mockFindOne = jest.fn().mockResolvedValueOnce(null)
        request.app.locals.appDb.collection = jest.fn().mockImplementation(() => (
          {
            findOne: mockFindOne,
          }
        ))

        await AuthController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(mockFindOne).toHaveBeenCalledWith({
          uid: '[object Object]',
          reset_key: '[object Object]',
        },  
        {
          projection: {
            _id: 0,
            password: 0,
            bad_pwd_count: 0,
            lockout_time: 0,
            last_logoff: 0,
            last_logon: 0,
            force_reset_pw: 0,
          }
        })
      })
    })
  })
})
