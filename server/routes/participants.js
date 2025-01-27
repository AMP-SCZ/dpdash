import { Router } from 'express'
import * as yup from 'yup'

import ParticipantsController from '../controllers/participantsController'
import validateRequest, { baseSchema } from '../middleware/validateRequest'
import ensureAuthenticated from '../utils/passport/ensure-authenticated'
import { v1Routes } from '../utils/routes'

const router = Router()

const schema = baseSchema({
  query: yup.object({
    status: yup.string(),
    sortBy: yup.string(),
    sortDirection: yup.string(),
    searchSubjects: yup.array().optional(),
    studies: yup.array().optional(),
  }),
})

router
  .route(v1Routes.participants.index)
  .get(
    validateRequest(schema),
    ensureAuthenticated,
    ParticipantsController.index
  )

export default router
