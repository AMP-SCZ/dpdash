import { Router } from 'express'

import ensureUser from '../utils/passport/ensure-user'
import ConfigurationsController from '../controllers/configurationsController'
import { v1Routes } from '../utils/routes'

const router = Router()

router
  .route(v1Routes.config.index)
  .get(ConfigurationsController.index)
  .post(ConfigurationsController.create)

router
  .route(v1Routes.config.show)
  .delete(ConfigurationsController.destroy)
  .patch(ConfigurationsController.update)

export default router
