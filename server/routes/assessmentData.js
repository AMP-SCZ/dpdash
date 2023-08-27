import { Router } from 'express'
import AssessmentDayDataController from '../controllers/assessmentDayDataController'
import { v1Routes } from '../utils/routes'

const router = Router()

router
  .route(v1Routes.assessmentData.index)
  .post(AssessmentDayDataController.create)

export default router
