import { Router } from 'express'
import passport from 'passport'

import LocalLogin from '../utils/passport/local-login'
import { v1Routes } from '../utils/routes'

const router = Router()

router.route(v1Routes.auth.login).post(function (req, res, next) {
  passport.authenticate('local-login', { session: true }, function (err, user) {
    if (err) return res.status(400).json({ error: err.message })

    return LocalLogin(req, res, next, user)
  })(req, res, next)
})

export default router
