import { apiRoutes } from '../../routes/routes'
import http from '../http'

const assessments = {
  loadAll: async (queryParams) =>
    http.get(apiRoutes.assessments.index, queryParams),
  rawData: async (assessment, variable) =>
    http.get(apiRoutes.assessments.rawData(assessment, variable)),
}

export default assessments
