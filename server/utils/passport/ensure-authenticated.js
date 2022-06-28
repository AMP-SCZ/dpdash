import basePathConfig from '../../configs/basePathConfig'

const basePath = basePathConfig || ''

export default function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect(`${basePath}/logout`)
  }
  const { appDb } = req.app.locals
  appDb
    .collection('users')
    .findOne(
      { uid: req.user },
      { 
        _id: 0, 
        access: 1, 
        blocked: 1, 
        role: 1 
      },
      function (err, data) {
        switch(true) {
          case !data || Object.keys(data).length === 0 || !!data.blocked || err:
            return res.redirect(`${basePath}/logout?e=forbidden`)
          case data.access && data.access.length === 0:
            return res.redirect(`${basePath}/logout?e=unauthorized`)
          default:
            return next()
        }
      }
    )
}
