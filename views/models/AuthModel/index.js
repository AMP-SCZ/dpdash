import { BASE_REQUEST_OPTIONS } from '../../../constants'
import { apiRoutes } from '../../routes/routes'

const AuthModel = {
  findOne: async (credentials) => {
    const response = await fetch(apiRoutes.auth.login, {
      ...BASE_REQUEST_OPTIONS,
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    return await response.json()
  },
}

export default AuthModel
