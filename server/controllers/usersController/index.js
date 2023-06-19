import UserModel from '../../models/UserModel'

const UsersController = {
  edit: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { uid } = req.params
      const { value } = await UserModel.update(appDb, uid, req.body)

      return value
        ? res.json({ data: value, status: 200 })
        : res.json({ message: 'User could not be updated', status: 404 })
    } catch (error) {
      return res.json({ error: error.message, status: 400 })
    }
  },
  show: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { uid } = req.params
      const user = await UserModel.findOne(appDb, uid)

      return res.json({ data: user, status: 200 })
    } catch (error) {
      return res.json({
        data: { message: 'User could not be found' },
        status: 404,
      })
    }
  },
}

export default UsersController
