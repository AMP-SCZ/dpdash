import { routes } from '../routes'

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
      case !user || Object.keys(user).length === 0:
        return res.redirect(routes.logout)
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
