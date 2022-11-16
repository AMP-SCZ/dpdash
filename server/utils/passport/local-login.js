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
    return done(null, user.uid)
  })
  passport.deserializeUser(function (user, done) {
    done(null, user)
  })
  //If the user exists, serialize the user to the session
  req.login(user, (err) => {
    if (err) return next(err)

    const { uid } = user
    const { appDb } = req.app.locals
    appDb
      .collection(collections.configs)
      .findOne({ owner: uid })
      .then((configData) => {
        if (!configData) {
          const defaultConfig = {
            owner: uid,
            config: defaultUserConfig,
            name: 'default',
            type: 'matrix',
            readers: [uid],
            created: new Date().toUTCString(),
          }
          appDb
            .collection(collections.configs)
            .insertOne(defaultConfig)
            .then((data) => {
              if (!data) console.error(data)
            })
        }
      })

    req.session.role = user.role
    req.session.display_name = user.display_name
    req.session.mail = user.mail
    req.session.celery_tasks = []
    req.session.icon = user.icon
    req.session.userAccess = user.access

    return res.redirect(`${basePath}/`)
  })
}
