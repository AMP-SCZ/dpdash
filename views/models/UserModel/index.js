import { BASE_REQUEST_OPTIONS } from '../../../constants'
import { apiRoutes } from '../../routes/routes'

const UserModel = {
  findOne: async (userId) => {
    try {
      const response = await fetch(apiRoutes.users.user(userId), {
        ...BASE_REQUEST_OPTIONS,
      })

      return await response.json()
    } catch (error) {
      throw new Error(error)
    }
  },
  update: async (userId, userAttributes) => {
    try {
      const response = await fetch(apiRoutes.users.user(userId), {
        ...BASE_REQUEST_OPTIONS,
        method: 'PATCH',
        body: JSON.stringify(userAttributes),
      })

      return await response.json()
    } catch (error) {
      throw new Error(error)
    }
  },
}

export default UserModel
