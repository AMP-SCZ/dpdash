import { routes, routeErrors } from '../routes'

export default async function ensurePermission(req, res, next) {
  try {
    if (!req.isAuthenticated()) return res.redirect(routes.logout)

    const { prisma } = req.app.locals
    const user = await prisma.users.findFirst({
      where: { uid: req.user },
      select: {
        access: true,
        blocked: true,
      },
    })
    switch (true) {
      case !user:
        return res.redirect(routes.logout)
      case user.blocked === true:
        return res.redirect(routes.logoutWithError(routeErrors.forbidden))
      case user.access.length === 0:
        return res.redirect(routes.logoutWithError(routeErrors.unauthorized))
      case !user.access.includes(req.params.study):
        return res.redirect(routes.logoutWithError(routeErrors.forbidden))
      default:
        return next()
    }
  } catch (error) {
    console.log(error)
    return res.redirect(routes.logoutWithError(routeErrors.forbidden))
  }
}
