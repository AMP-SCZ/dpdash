import UserModel from '../../models/UserModel'

const UsersController = {
  edit: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { uid } = req.params
      const updatedUser = await UserModel.update(appDb, uid, req.body)

      return res.status(200).json({ data: updatedUser })
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
      return res.status(400).json({
        error: error.message,
      })
    }
  },
}

export default UsersController
