export default async function ensureUser(req, res, next) {
  req.user = await UserModel.findOne({ _id: req.user._id })
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unathorized' })
  } else if (req.params.uid !== req.user.uid) {
    return res.status(400).json({ error: 'Bad Request' })
  } else {
    return next()
  }
}
