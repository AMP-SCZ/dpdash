import { collections } from '../../utils/mongoCollections'
import { ASC } from '../../constants'

const $Consent = '$Consent'
const participant = 'participant'
const $participant = '$participant'
const $participants = '$participants'
const $synced = '$synced'
const timeUnit = 'day'

const ParticipantsModel = {
  index: async (db, user, queryParams) =>
    await db
      .collection(collections.metadata)
      .aggregate(allParticipantsQuery(user, queryParams))
      .toArray(),
}

const allParticipantsQuery = (user, queryParams) => {
  const { star, complete } = user.preferences
  const starred = star ? Object.values(star).flat() : []
  const completed = complete ? Object.values(complete).flat() : []
  const { status, sortBy, sortDirection, searchParticipants, studies } =
    queryParams
  const direction = sortDirection === ASC ? 1 : -1
  const sort = { $sort: { star: -1, [sortBy]: direction } }
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
    { $replaceRoot: { newRoot: $participants } },
    {
      $project: {
        Active: 1,
        Consent: 1,
        complete: {
          $in: [$participant, completed],
        },
        days: 1,
        star: {
          $in: [$participant, starred],
        },
        study: 1,
        participant: 1,
        synced: 1,
        daysInStudy: {
          $cond: {
            if: { $ne: [$synced, null] },
            then: {
              $dateDiff: {
                startDate: { $toDate: $Consent },
                endDate: { $toDate: $synced },
                unit: timeUnit,
              },
            },
            else: {
              $dateDiff: {
                startDate: { $toDate: $Consent },
                endDate: new Date(),
                unit: timeUnit,
              },
            },
          },
        },
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
