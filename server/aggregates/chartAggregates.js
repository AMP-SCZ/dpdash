import { ObjectID } from 'mongodb'

export const legendQuery = (chart_id) => [
  {
    $match: { _id: new ObjectID(chart_id) },
  },
  {
    $project: {
      _id: 0.0,
      fieldLabelValueMap: 1.0,
    },
  },
  {
    $unwind: { path: '$fieldLabelValueMap' },
  },
]
