import { routes } from '../routes'
import { ADMIN_ROLE } from '../constants'

export default async function ensurePermission(req, res, next) {
  try {
    if (!req.isAuthenticated()) return res.redirect(routes.logout)

    const { prisma } = req.app.locals
    const user = await prisma.users.findUnique({
      where: { uid: req.user },
      select: {
        access: true,
        blocked: true,
        role: true,
      },
    })
    switch (true) {
      case !user || Object.keys(user).length === 0:
        return res.redirect(routes.logout)
      case user.role === ADMIN_ROLE:
        return next()
      case user.blocked === true:
        return res.redirect(routes.logoutForbiddenRoute)
      case user.access.length === 0:
        return res.redirect(routes.unauthorizedRoute)
      case !user.access.includes(req.params.study):
        return res.redirect(routes.logoutForbiddenRoute)
      default:
        return next()
    }
  } catch (error) {
    console.log(error)
    return res.redirect(routes.logoutForbiddenRoute)
  }
}
