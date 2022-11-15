import { routes, routeErrors } from '../routes'
import { ADMIN_ROLE } from '../constants'

//Admin privilege checking middleware
export default async function ensureAdmin(req, res, next) {
  try {
    if (!req.isAuthenticated()) return res.redirect(routes.logout)

    const { prisma } = req.app.locals
    const user = await prisma.users.findFirst({
      where: { uid: req.user },
      select: { uid: true, role: true },
    })

    switch (true) {
      case !user || user.role !== ADMIN_ROLE:
        return res.redirect(routes.logoutWithError(routeErrors.forbidden))
      default:
        return next()
    }
  } catch (error) {
    return res.redirect(routes.logoutWithError(routeErrors.forbidden))
  }
}
