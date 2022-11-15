import { routes } from '../routes'

export default async function ensureAuthenticated(req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect(routes.logout)
    }
    const { prisma } = req.app.locals
    const user = await prisma.users.findUnique({
      where: { uid: req.user },
      select: { access: true, blocked: true, role: true },
    })
    switch (true) {
      case !user || Object.keys(user).length === 0 || !!user.blocked:
        return res.redirect(routes.logout)
      case user.access && user.access.length === 0:
        return res.redirect(routes.unauthorizedRoute)
      default:
        return next()
    }
  } catch (error) {
    return res.redirect(routes.logoutForbiddenRoute)
  }
}
