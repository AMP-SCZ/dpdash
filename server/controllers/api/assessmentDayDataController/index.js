import AssessmentDayDataModel from '../../../models/AssessmentDayDataModel'
import SiteMetadataModel from '../../../models/SiteMetadataModel'

const AssessmentDayDataController = {
  create: async (req, res) => {
    try {
      const { appDb } = req.app.locals

      const { metadata, participant_assessments } = req.body

      if (!metadata || !participant_assessments.length)
        return res.status(400).json({ message: 'Nothing to import' })

      const { assessment, participant, study } = metadata
      const query = {
        assessment,
        participant,
      }
      const participantAssessmentData = await AssessmentDayDataModel.findOne(
        appDb,
        query
      )

      if (participantAssessmentData) {
        const { dayData } = participantAssessmentData

        const filteredDays = dayData.filter(
          ({ day }) =>
            !participant_assessments.find(
              (assessment) => day === assessment.day
            )
        )
        const sortedDayData = filteredDays
          .concat(participant_assessments)
          .sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0))

        await AssessmentDayDataModel.update(appDb, query, {
          ...participantAssessmentData,
          ...metadata,
          dayData: sortedDayData,
        })
      } else {
        await AssessmentDayDataModel.create(appDb, {
          ...metadata,
          dayData: participant_assessments,
        })
      }
      const studyMetadata = await SiteMetadataModel.findOne(appDb, {
        study,
      })

      if (!studyMetadata) {
        await SiteMetadataModel.upsert(
          appDb,
          { study },
          {
            $set: {
              study,
              participants: [
                {
                  Active: 1,
                  Consent: new Date(),
                  study,
                  participant,
                  synced: new Date(),
                },
              ],
            },
          }
        )
      } else {
        await SiteMetadataModel.upsert(
          appDb,
          { participants: { $elemMatch: { participant } } },
          { $set: { 'participants.$.synced': new Date() } }
        )
      }

      return res
        .status(200)
        .json({ data: `${participant} ${assessment} data imported` })
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  },
}

export default AssessmentDayDataController
