import basePathConfig from '../../configs/basePathConfig'

const basePath = basePathConfig || ''
const logoutForbiddenRoute = `${basePath}/logout?e=forbidden`
const unauthorizedRoute = `${basePath}/logout?e=unauthorized`

export default async function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect(`${basePath}/logout`)
  }
  const { appDb } = req.app.locals
  const user = await appDb.users.findUniqueOrThrow({
    where: { uid: req.user },
    select: {
      access: true,
      blocked: true,
      role: true,
    },
  })

  switch (true) {
    case !user || Object.keys(user).length === 0 || !!user.blocked:
      return res.redirect(logoutForbiddenRoute)
    case user.access && user.access.length === 0:
      return res.redirect(unauthorizedRoute)
    default:
      return next()
  }
}
