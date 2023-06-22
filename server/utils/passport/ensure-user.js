export default function ensureUser(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ status: 401, error: 'Unathorized' })
  } else if (req.params.uid !== req.user) {
    return res.status(400).json({ status: 400, error: 'Bad Request' })
  } else {
    return next()
  }
}
