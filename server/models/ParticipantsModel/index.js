import {
  ASC,
  ALL_SUBJECTS_MONGO_PROJECTION,
  STUDIES_TO_OMIT,
} from '../../constants'
import { collections } from '../../utils/mongoCollections'

const participant = 'participant'
const $participants = '$participants'

const ParticipantsModel = {
  index: async (db, user, queryParams) =>
    await db
      .collection(collections.metadata)
      .aggregate(allParticipantsQuery(user, queryParams))
      .toArray(),
  allForAssessment: async (db, chart, filtersService) => {
    const { filterQueries } = filtersService
    const query = {
      assessment: chart.assessment,
      study: { $in: filtersService.requestedSites, $nin: STUDIES_TO_OMIT },
    }

    // console.log('Assesment : ', chart.assessment, 'Variable : ', chart.variable)
    // // const data = this.allForAssessmentRaw(db, chart.assessment, chart.variable)
    // // console.log('Data : ', data)
    // const data = await db
    //   .collection(collections.assessmentDayData)
    //   .find(
    //     {
    //       assessment: chart.assessment,
    //       study: { $nin: STUDIES_TO_OMIT },
    //     },
    //     {
    //       projection: ALL_SUBJECTS_MONGO_PROJECTION,
    //     }
    //   )
    //   .toArray()

    // const rawData = {}

    // for (const document of data) {
    //   const dayData = document.dayData
    //   const subjectSite = document.study

    //   if (!rawData[subjectSite]) {
    //     rawData[subjectSite] = []
    //   }

    //   for (const day of dayData) {
    //     const rawDayData = day[chart.variable]
    //     rawData[subjectSite].push(rawDayData)
    //   }
    // }

    // console.log('rawData : ', rawData)

    if (filtersService.allFiltersInactive()) {
      const data = await db
        .collection(collections.assessmentDayData)
        .find(query, { projection: ALL_SUBJECTS_MONGO_PROJECTION })
        .stream()

      return data
    }

    const groupedParticipants = await Promise.all(
      filterQueries.map((query) => {
        return db
          .collection(collections.assessmentDayData)
          .distinct('participant', query)
      })
    )

    return await db
      .collection(collections.assessmentDayData)
      .find({
        ...query,
        participant: {
          $in:
            groupedParticipants.length > 1
              ? ParticipantsModel.intersectParticipants(groupedParticipants)
              : groupedParticipants.flat(),
        },
      })
      .stream()
  },
  intersectParticipants: (groupedParticipants) => {
    const sortedGroupParticipants = groupedParticipants.sort(
      (groupA, groupB) => {
        if (groupA.length === groupB.length) return 0
        if (groupB.length > groupA.length) return 1
        if (groupA.length < groupB.length) return -1
      }
    )

    return sortedGroupParticipants.reduce(
      (participantGroupA, participantGroupB) =>
        participantGroupA.filter((participant) =>
          participantGroupB.includes(participant)
        )
    )
  },
}

const allParticipantsQuery = (user, queryParams) => {
  const { star, complete } = user.preferences
  const starred = star ? Object.values(star).flat() : []
  const completed = complete ? Object.values(complete).flat() : []
  const { status, sortBy, sortDirection, searchParticipants, studies } =
    queryParams
  const direction = sortDirection === ASC ? 1 : -1
  const sortByParams = { [sortBy]: direction }
  const baseSort = { star: -1 }
  const sort = sortBy
    ? { $sort: { ...baseSort, ...sortByParams } }
    : { $sort: baseSort }
  const studiesSet = new Set(studies?.length ? studies : user.access)

  searchParticipants?.forEach((participant) =>
    studiesSet.add(`${participant[0]}${participant[1]}`)
  )
  const studiesQuery = Array.from(studiesSet)

  const query = [
    {
      $match: {
        $or: [
          {
            study: {
              $in: studiesQuery,
            },
          },
        ],
      },
    },

    { $unwind: $participants },
    {
      $project: {
        _id: 0,
        Active: '$participants.Active',
        Consent: '$participants.Consent',
        complete: { $in: ['$participants.participant', completed] },
        days: 1,
        star: { $in: ['$participants.participant', starred] },
        study: 1,
        participant: '$participants.participant',
        synced: '$participants.synced',
        daysInStudy: '$participants.daysInStudy',
      },
    },
  ]

  if (searchParticipants?.length) {
    if (studies?.length) {
      query.push({
        $match: {
          $or: [
            {
              study: {
                $in: studies,
              },
            },
            {
              participant: {
                $in: searchParticipants,
              },
            },
          ],
        },
      })
    } else {
      query.push({
        $match: {
          $or: [
            {
              participant: {
                $in: searchParticipants,
              },
            },
          ],
        },
      })
    }
  }

  if (status) {
    query.splice(1, 0, {
      $project: {
        participants: {
          $filter: {
            input: $participants,
            as: participant,
            cond: { $eq: ['$$participant.Active', +status] },
          },
        },
      },
    })
  }

  query.push(sort)

  return query
}

export default ParticipantsModel
