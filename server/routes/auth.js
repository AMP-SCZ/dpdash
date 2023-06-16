import { Router } from 'express'

import { v1Routes } from '../utils/routes'

const router = Router()

router.route(v1Routes.auth.login).post(function (req, res, next) {
  passport.authenticate('local-login', { session: true }, function (err, user) {
    if (err) return res.status(400).end()

    return LocalLogin(req, res, next, user)
  })(req, res, next)
})

export default router
