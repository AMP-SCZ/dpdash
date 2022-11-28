import { routes, routeErrors } from '../routes'

export default async function ensureAuthenticated(req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect(routes.logout)
    }
    const { prisma } = req.app.locals
    const user = await prisma.users.findFirst({
      where: { uid: req.user },
      select: { access: true, blocked: true },
    })
    switch (true) {
      case !user || !!user.blocked:
        return res.redirect(routes.logout)
      case !user.access.length:
        return res.redirect(routes.logoutWithError(routeErrors.unauthorized))
      default:
        return next()
    }
  } catch (error) {
    return res.redirect(routes.logoutWithError(routeErrors.forbidden))
  }
}
