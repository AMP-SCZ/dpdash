import AuthController from '.'
import { createRequestWithUser, createResponse } from '../../../test/fixtures'

describe('AuthController', () => {
  describe(AuthController.show, () => {
    describe('When successful', () => {
      it('returns a status of 200 and a user object', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        await AuthController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: {
            uid: 'user-uid',
            display_name: 'Display Name',
            icon: 'icon',
          },
        })
      })
    })
  })
})
