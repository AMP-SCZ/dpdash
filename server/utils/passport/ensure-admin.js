import { routes } from '../routes'
//Admin privilege checking middleware
const admin = 'admin'
export default async function ensureAdmin(req, res, next) {
  try {
    if (!req.isAuthenticated()) return res.redirect(routes.logout)

    const { prisma } = req.app.locals
    const user = await prisma.users.findUnique({
      where: { uid: req.user },
      select: { uid: true, role: true },
    })

    switch (true) {
      case !user || user.role !== admin:
        return res.redirect(routes.logoutForbiddenRoute)
      default:
        return next()
    }
  } catch (error) {
    return res.redirect(routes.logoutForbiddenRoute)
  }
}
