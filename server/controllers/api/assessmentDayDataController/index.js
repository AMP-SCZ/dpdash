import AssessmentDayDataModel from '../../../models/AssessmentDayDataModel'
import AssessmentModel from '../../../models/AssessmentModel'
import AssessmentVariablesModel from '../../../models/AssessmentVariablesModel'
import SiteMetadataModel from '../../../models/SiteMetadataModel'
import { collections } from '../../../utils/mongoCollections'

const AssessmentDayDataController = {
  create: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { metadata, participant_assessments, assessment_variables } =
        req.body

      if (!metadata || !participant_assessments.length)
        return res.status(400).json({ message: 'Nothing to import' })

      const { assessment, participant, study, Consent, Active } = metadata
      let parsedConsent = null

      try {
        if (Consent) {
          parsedConsent = new Date(Consent)
        }
      } catch {
        // Missing consent dates could come in a number of formats,
        // so we attempt to parse the date and leave it as null if there's
        // an error
      }

      const query = {
        assessment,
        participant,
      }
      const assessmentQuery = {
        name: assessment,
      }
      const newAssessmentProperties = AssessmentModel.withDefaults({
        name: assessment,
      })

      const participantAssessmentData = await AssessmentDayDataModel.findOne(
        appDb,
        query
      )

      let sortedDayData = participant_assessments
      let maxDayInDayData = Math.max(
        ...participant_assessments.map((pa) => pa.day)
      )

      if (participantAssessmentData) {
        sortedDayData = sortDayData(
          participantAssessmentData,
          participant_assessments
        )
        maxDayInDayData = Math.max(
          ...sortedDayData.map((dayData) => dayData.day)
        )

        await AssessmentDayDataModel.update(appDb, query, {
          ...participantAssessmentData,
          ...metadata,
          Consent: parsedConsent,
          daysInStudy: maxDayInDayData,
          dayData: sortedDayData,
        })
      } else {
        await AssessmentDayDataModel.create(appDb, {
          ...metadata,
          Consent: parsedConsent,
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
            setAttributes: {
              study,
              participants: [
                {
                  Active,
                  Consent: parsedConsent,
                  study,
                  participant,
                  daysInStudy: maxDayInDayData,
                  synced: new Date(),
                },
              ],
            },
          }
        )
      } else {
        const isParticipantInDocument = await SiteMetadataModel.findOne(appDb, {
          participants: { $elemMatch: { participant } },
        })
        if (isParticipantInDocument) {
          await SiteMetadataModel.upsert(
            appDb,
            { participants: { $elemMatch: { participant } } },
            {
              setAttributes: {
                'participants.$.daysInStudy': maxDayInDayData,
                'participants.$.synced': new Date(),
              },
            }
          )
        } else {
          await SiteMetadataModel.upsert(
            appDb,
            { study },
            {
              addToSetAttributes: {
                participants: {
                  Active,
                  Consent: parsedConsent,
                  daysInStudy: maxDayInDayData,
                  study,
                  participant,
                  synced: new Date(),
                },
              },
            }
          )
        }
      }

      await AssessmentModel.upsert(
        appDb,
        assessmentQuery,
        newAssessmentProperties
      )

      if (assessment_variables.length) {
        await Promise.all(
          assessment_variables.map(
            async (variableMetadata) =>
              await AssessmentVariablesModel.upsert(
                appDb,
                variableMetadata,
                variableMetadata
              )
          )
        )
      }

      return res
        .status(200)
        .json({ data: `${participant} ${assessment} data imported` })
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  },
  destroy: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      await appDb.collection(collections.assessmentDayData).drop()

      return res.status(200)
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  },
}

function sortDayData(participantAssessmentData, participant_assessments) {
  const { dayData } = participantAssessmentData
  const filteredDays = dayData.filter(
    ({ day }) =>
      !participant_assessments.find((assessment) => day === assessment.day)
  )
  return filteredDays
    .concat(participant_assessments)
    .sort((prevParticipant, nextParticipant) =>
      prevParticipant.day < nextParticipant.day
        ? -1
        : prevParticipant.day > nextParticipant.day
          ? 1
          : 0
    )
}

export default AssessmentDayDataController
