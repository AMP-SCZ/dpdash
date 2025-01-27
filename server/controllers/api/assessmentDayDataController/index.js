import AssessmentDayDataModel from '../../../models/AssessmentDayDataModel'
import AssessmentModel from '../../../models/AssessmentModel'
import AssessmentVariablesModel from '../../../models/AssessmentVariablesModel'
import SiteMetadataModel from '../../../models/SiteMetadataModel'
import { collections } from '../../../utils/mongoCollections'

const AssessmentDayDataController = {
  create: async (req, res, next) => {
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
        await AssessmentDayDataModel.upsert(appDb, query, {
          ...participantAssessmentData,
          ...metadata,
          daysInStudy: maxDayInDayData,
          dayData: sortedDayData,
        })
      } else {
        await AssessmentDayDataModel.upsert(appDb, query, {
          ...metadata,
          Consent: parsedConsent,
          dayData: participant_assessments,
        })
      }

      const studyMetadata = await SiteMetadataModel.findOne(appDb, {
        study,
      })

      if (!studyMetadata) {
        await SiteMetadataModel.upsert$Set(
          appDb,
          { study },
          {
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
          }
        )
      } else {
        const isParticipantInDocument = await SiteMetadataModel.findOne(appDb, {
          participants: { $elemMatch: { participant } },
        })

        if (isParticipantInDocument) {
          await SiteMetadataModel.upsert$Set(
            appDb,
            { participants: { $elemMatch: { participant } } },
            {
              'participants.$.daysInStudy': maxDayInDayData,
              'participants.$.synced': new Date(),
            }
          )
        } else {
          await SiteMetadataModel.upsert$addToSet(
            appDb,
            { study },
            {
              participants: {
                Active,
                Consent: parsedConsent,
                daysInStudy: maxDayInDayData,
                study,
                participant,
                synced: new Date(),
              },
            }
          )
        }
      }

      const currentAssessment = await AssessmentModel.upsert(
        appDb,
        assessmentQuery,
        newAssessmentProperties
      )

      if (assessment_variables.length) {
        await Promise.all(
          assessment_variables.map(async ({ name }) => {
            const variableAttributes = {
              name,
              assessment_id: currentAssessment._id,
            }

            return await AssessmentVariablesModel.upsert(
              appDb,
              variableAttributes,
              variableAttributes
            )
          })
        )
      }
      return res
        .status(200)
        .json({ data: `${participant} ${assessment} data imported` })
    } catch (err) {
      return next(err)
    }
  },
  destroy: async (req, res, next) => {
    try {
      const { appDb } = req.app.locals
      await appDb.collection(collections.assessmentDayData).drop()

      return res.status(200)
    } catch (error) {
      next(error)
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
