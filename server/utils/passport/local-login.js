import passport from 'passport'
import { collections } from '../mongoCollections'
import { verifyHash } from '../crypto/hash'
import defaultUserConfig from '../../configs/defaultUserConfig'
import basePathConfig from '../../configs/basePathConfig'

const basePath = basePathConfig || ''

export default (req, res, next, user) => {
  //validate submitted password
  if (!verifyHash(req.body.password, user.password)) {
    return res.redirect(`${basePath}/login?e=forbidden`)
  }
  //passport local log-in serializer
  passport.serializeUser(function (user, done) {
    done(null, user.uid)
  })
  passport.deserializeUser(function (user, done) {
    done(null, user)
  })
  //If the user exists, serialize the user to the session
  req.login(user, (err) => {
    if (err) return next(err)
    const { uid } = user
    const { prisma, appDb } = req.app.locals
    appDb
      .collection(collections.configs)
      .findOne({ owner: uid })
      .then((err, configData) => {
        if (err) console.error(err.message)
        if (!configData) {
          const defaultConfig = {
            owner: uid,
            config: defaultUserConfig,
            name: 'default',
            type: 'matrix',
            readers: [uid],
            created: new Date().toUTCString(),
          }
          appDb.collection(collections.config).insertOne(defaultConfig)
        }
      })
    prisma.users
      .update({
        where: { uid },
        data: { last_logon: Date.now() },
        select: {
          uid: true,
          display_name: true,
          acl: true,
          role: true,
          icon: true,
          mail: true,
          access: true,
        },
      })
      .then((user) => {
        if (!user) console.log('Error updating user')
        req.session.role = user.value.role
        req.session.display_name = user.value.display_name
        req.session.mail = user.value.mail
        req.session.celery_tasks = []
        req.session.icon = user.value.icon
        req.session.userAccess = user.value.access
      })
    return res.redirect(`${basePath}/`)
  })
}
