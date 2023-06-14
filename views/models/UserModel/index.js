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
      const response = await fetch(apiRoutes.users.user(userId), {
        ...BASE_REQUEST_OPTIONS,
        method: 'PATCH',
        body: JSON.stringify(userAttributes),
      })
      const { status } = response

      if (status !== 200) throw new Error(response.json().error)

      return { status, data: response.json() }
    } catch (error) {
      throw new Error(error)
    }
  },
}

export default UserModel
