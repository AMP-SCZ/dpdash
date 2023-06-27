import { apiRoutes } from '../../routes/routes'
import http from '../http'

const users = {
  findOne: async (userId) => http.get(apiRoutes.users.user(userId)),
  update: async (userId, userAttributes) =>
    http.patch(apiRoutes.users.user(userId), userAttributes),
}

export default users
