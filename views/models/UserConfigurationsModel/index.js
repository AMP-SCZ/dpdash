import { apiRoutes } from '../../routes/routes'
import { BASE_REQUEST_OPTIONS } from '../../../constants'

const UserConfigurationsModel = {
  all: async (userId) => {
    try {
      const response = await fetch(
        apiRoutes.configurations.userConfigurations(userId),
        {
          ...BASE_REQUEST_OPTIONS,
        }
      )
      if (response.status !== 200) throw new Error(response.error)

      return response.json()
    } catch (error) {
      throw new Error(error)
    }
  },
  create: async (userId, configAttributes) => {
    return await fetch(apiRoutes.configurations.userConfigurations(userId), {
      ...BASE_REQUEST_OPTIONS,
      method: 'POST',
      body: JSON.stringify(configAttributes),
    })
  },
  destroy: async (userId, configId) => {
    try {
      const response = await fetch(
        apiRoutes.configurations.userConfiguration(userId, configId),
        {
          ...BASE_REQUEST_OPTIONS,
          method: 'DELETE',
        }
      )

      return response.json()
    } catch (error) {
      throw new Error(error)
    }
  },
  update: async (userId, configId, configAttributes) => {
    try {
      const response = await fetch(
        apiRoutes.configurations.userConfiguration(userId, configId),
        {
          ...BASE_REQUEST_OPTIONS,
          method: 'PATCH',
          body: JSON.stringify(configAttributes),
        }
      )

      return response.json()
    } catch (error) {
      throw new Error(error)
    }
  },
}

export default UserConfigurationsModel