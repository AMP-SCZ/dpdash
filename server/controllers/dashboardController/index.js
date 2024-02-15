import { ObjectId } from 'mongodb'
import UserModel from '../../models/UserModel'
import ConfigModel from '../../models/ConfigModel'
import DashboardService from '../../services/DashboardService'
import DashboardDataProcessor from '../../data_processors/DashboardDataProcessor'

const DashboardsController = {
  show: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { study, subject } = req.params
      const user = await UserModel.findOne(appDb, { uid: req.user.uid })
      const userConfigurationQuery = {
        _id: new ObjectId(user.preferences.config),
      }
      const config = await ConfigModel.findOne(appDb, userConfigurationQuery)
      const flatConfig = Object.values(config.config).flat()

      const { dashboardDataCursor, consentDate } = new DashboardService(
        appDb,
        study,
        subject,
        flatConfig
      )
      const participantConsentDate = await consentDate()
      const dataStream = await dashboardDataCursor()
      const participantDataMap = new Map()

      dataStream.on('data', (doc) => {
        const dayData = doc?.dayData.length ? doc.dayData : []

        participantDataMap.set(doc.assessment, dayData)
      })

      await new Promise((resolve, reject) => {
        dataStream.on('end', () => resolve())

        dataStream.on('error', (err) => reject(err))
      })

      const dashboardProcessor = new DashboardDataProcessor(
        flatConfig,
        participantDataMap
      )

      return res.status(200).json({
        data: {
          subject: { sid: subject, project: study },
          graph: {
            matrixData: dashboardProcessor.calculateDashboardData(),
            configurations: flatConfig,
            consentDate: participantConsentDate,
          },
        },
      })
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  },
}

export default DashboardsController
