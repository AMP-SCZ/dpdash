import { BASE_REQUEST_OPTIONS } from '../../../constants'
import { apiRoutes } from '../../routes/routes'

const UserModel = {
  show: async (userId) => {
    const response = await fetch(apiRoutes.users.user(userId), {
      ...BASE_REQUEST_OPTIONS,
    })
    if (response.status !== 200) throw new Error(response.json().error)
    return response.json()
  },
  update: async (userId, userAttributes) => {
    try {
      const response = await fetch(apiRoutes.users.preferences(userId), {
        ...BASE_REQUEST_OPTIONS,
        method: 'PATCH',
        body: JSON.stringify(userAttributes),
      })
      if (response.status !== 200) throw new Error(response.json().error)

      return response.json()
    } catch (error) {
      throw new Error(error)
    }
  },
}

export default UserModel
