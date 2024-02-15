import { collections } from '../../utils/mongoCollections'
import SiteMetadataModel from '../../models/SiteMetadataModel'

class DashboardService {
  constructor(appDb, study, participant, configuration) {
    this.configuration = configuration
    this.db = appDb
    this.study = study
    this.participant = participant
  }

  get assessmentsFromConfig() {
    const assessments = new Map()

    this.configuration.forEach((configuration) => {
      const key = this.study + this.participant + configuration.analysis

      if (!assessments.has(key)) assessments.set(key, configuration.analysis)
    })

    return [...assessments.values()]
  }

  consentDate = async () => {
    const query = {
      study: this.study,
    }

    const studyMetadata = await SiteMetadataModel.findOne(this.db, query)

    return studyMetadata.participants.filter(
      ({ participant }) => participant === this.participant
    )[0].Consent
  }

  dashboardDataCursor = async () =>
    await this.db
      .collection(collections.assessmentDayData)
      .find(
        {
          participant: this.participant,
          study: this.study,
          assessment: { $in: this.assessmentsFromConfig },
        },
        { projection: { dayData: 1, assessment: 1 } }
      )
      .stream()
}

export default DashboardService
