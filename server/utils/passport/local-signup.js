import passport from 'passport'
import config from '../../configs/config'
import { hash } from '../crypto/hash'
import { collections } from '../mongoCollections'
import defaultUserConfig from '../../configs/defaultUserConfig'
import { routeErrors, routes } from '../routes'

export default (req, res, next) => {
  passport.authenticate(
    'local-signup',
    { session: true },
    async function (err, user, reqBody) {
      if (err) {
        return res.redirect(routes.loginWithError(err))
      }
      if (user) {
        return res.redirect(routes.signUpWithError(routeErrors.existingUser))
      }
      try {
        const password = reqBody.password
        const username = reqBody.username
        const mail = reqBody.email
        const display_name = reqBody.display_name
        const hashedPW = hash(password)
        const newUserData = {
          uid: username,
          display_name,
          title: '',
          department: '',
          company: '',
          mail,
          member_of: '',
          bad_pwd_count: 0,
          lockout_time: 0,
          last_logoff: Date.now(),
          last_logon: Date.now(),
          password: hashedPW,
          ldap: false,
          force_reset_pw: false,
          realms: config.app.realms,
          icon: '',
          access: [],
          blocked: false,
          role: 'member',
          preferences: {
            config: '',
            sort: 0,
          },
          siteSubjects: [],
        }
        const { prisma, appDb } = req.app.locals
        const newUser = await prisma.users.create({
          data: newUserData,
          select: {
            uid: true,
            display_name: true,
            access: true,
            role: true,
            icon: true,
            mail: true,
          },
        })
        const defaultConfig = {
          owner: username,
          config: defaultUserConfig,
          name: 'default',
          type: 'matrix',
          readers: [username],
          created: new Date().toUTCString(),
        }
        await appDb.collection(collections.configs).insertOne(defaultConfig)

        req.session.role = newUser.role
        req.session.uid = newUser.uid
        req.session.display_name = newUser.display_name
        req.session.mail = newUser.mail
        req.session.celery_tasks = []
        req.session.icon = newUser.icon

        return res.redirect(routes.root)
      } catch (error) {
        console.error(error)
      }
    }
  )(req, res, next)
}
