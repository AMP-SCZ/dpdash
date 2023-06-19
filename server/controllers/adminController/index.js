import UserModel from '../../models/UserModel'

const AdminUsersController = {
  update: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { uid } = req.params
      const { value } = await UserModel.update(appDb, uid, req.body)

      return value
        ? res.json({ data: value, status: 200 })
        : res.json({ status: 400 })
    } catch (error) {
      return res.json({ error: error.message, status: 500 })
    }
  },
}

export default AdminUsersController
