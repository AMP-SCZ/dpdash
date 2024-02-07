import { collections } from '../../utils/mongoCollections'
import { ASC } from '../../constants'

const $Consent = '$Consent'
const participant = 'participant'
const $subject = '$subject'
const $subjects = '$subjects'
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
  const { status, sortBy, sortDirection, searchSubjects, studies } = queryParams
  const direction = sortDirection === ASC ? 1 : -1
  const sort = { $sort: { star: -1, [sortBy]: direction } }
  const studiesSet = new Set(studies?.length ? studies : user.access)

  searchSubjects?.forEach((participant) =>
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

    { $unwind: $subjects },
    { $replaceRoot: { newRoot: $subjects } },
    {
      $project: {
        Active: 1,
        Consent: 1,
        complete: {
          $in: [$subject, completed],
        },
        days: 1,
        star: {
          $in: [$subject, starred],
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

  if (searchSubjects?.length) {
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
              subject: {
                $in: searchSubjects,
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
              subject: {
                $in: searchSubjects,
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
        subjects: {
          $filter: {
            input: $subjects,
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
