import UserModel from '../../models/UserModel'

export default async function ensureAdmin(req, res, next) {
  req.user = await UserModel.findOne({ _id: req.user._id })
  try {
    if (!req.isAuthenticated())
      return res.status(401).json({ error: 'Please login' })
    if (req.user.role !== 'admin') return res.status(401).json({ error: 'Incorrect access level.' })

    return next()
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
}
