import {
  createChart,
  createFieldLabelValue,
  createSubject,
  createSubjectDayData,
} from '../../../test/fixtures'
import { N_A, TOTALS_STUDY } from '../../constants'
import BarChartDataProcessor from '.'

describe(BarChartDataProcessor, () => {
  const allowedStudies = ['Site 1', 'Site 2']
  const chart = createChart({
    assessment: 'assessment',
    variable: 'surveys_raw',
    fieldLabelValueMap: [
      createFieldLabelValue({
        color: 'good-color',
        label: 'Good',
        value: '1',
        targetValues: {
          'Site 1': '10',
          'Site 2': '11',
        },
      }),
      createFieldLabelValue({
        color: 'bad-color',
        label: 'Bad',
        value: '2',
        targetValues: {
          'Site 1': '10',
          'Site 2': undefined,
        },
      }),
      createFieldLabelValue({
        color: 'other-color',
        label: 'Other',
        value: '',
        targetValues: {},
      }),
    ],
  })
  const initialStudyTotals = {
    [TOTALS_STUDY]: { count: 0, targetTotal: 0 },
    'Site 1': { count: 0, targetTotal: undefined },
    'Site 2': { count: 0, targetTotal: undefined },
  }

  const subject1 = createSubject({ collection: '123', study: 'Site 1', subject: 'subject1' })
  const subject2 = createSubject({ collection: '456', study: 'Site 2', subject: 'subject2' })
  const subject3 = createSubject({ collection: '789', study: 'Site 1', subject: 'subject3' })
  const subject4 = createSubject({ collection: '1011', study: 'Site 2', subject: 'subject4' })

  const subject1DayData = [
    {
      ...subject1,
      ...createSubjectDayData({
        surveys_raw: 1,
      }),
    },
    {
      ...subject1,
      ...createSubjectDayData({
        surveys_raw: '',
      })
    }
  ]

  const subject2DayData = [
    {
      ...subject2,
      ...createSubjectDayData({
        surveys_raw: 2,
      }),
    },
    {
      ...subject2,
      ...createSubjectDayData({
        surveys_raw: '',
      })
    }
  ]

  const subject3DayData = [
    {
      ...subject3,
      ...createSubjectDayData({
        surveys_raw: '',
      }),
    },
    {
      ...subject3,
      ...createSubjectDayData({
        surveys_raw: '',
      })
    },
  ]

  const subject4DayData = [
    {
      ...subject4,
      ...createSubjectDayData({
        surveys_raw: 1,
      }),
    },
    {
      ...subject4,
      ...createSubjectDayData({
        surveys_raw: '',
      })
    }
  ]

  const subjects = [
    subject1,
    subject2,
    subject3,
    subject4,
  ]

  const subjectDayData = [
    ...subject1DayData,
    ...subject2DayData,
    ...subject3DayData,
    ...subject4DayData,
  ]

  describe('.processData', () => {
    it('returns processed data', async () => {
      await appDb.collection('assessmentSubjectDayData').insertMany(subjectDayData)

      const service = new BarChartDataProcessor(appDb, chart, initialStudyTotals)

      const processedData = await service.processData(subjects)

      const expectedLabelMap = {
        Good: { name: 'Good', color: 'good-color' },
        Bad: { name: 'Bad', color: 'bad-color' },
        Other: { name: 'Other', color: 'other-color' },
      }
      const expectedDataMap = {
        'Site 1-Good-10': 1,
        'Totals-Good': 2,
        'Site 1-Bad-10': 0,
        'Site 1-Other-undefined': 1,
        'Site 2-Good-11': 1,
        'Site 2-Bad-undefined': 1,
        'Totals-Bad': 1,
        'Site 2-Other-undefined': 0,
        'Totals-Other': 1,
      }
      const expectedProcessedDataBySite = {
        'Site 1': {
          name: 'Site 1',
          counts: {
            Good: 1,
            Bad: 0,
            [N_A]: 0,
            Other: 1,
          },
          totalsForStudy: {
            count: 2,
            targetTotal: undefined,
          },
          percentages: {
            Good: 50,
            Bad: 0,
            [N_A]: 0,
            Other: 50,
          },
          targets: {
            Good: 10,
            Bad: 10,
            Other: undefined,
          },
        },
        Totals: {
          name: 'Totals',
          counts: {
            Good: 2,
            Bad: 1,
            [N_A]: 0,
            Other: 1,
          },
          totalsForStudy: {
            count: 4,
            targetTotal: 0,
          },
          percentages: {
            Good: 50,
            Bad: 25,
            [N_A]: 0,
            Other: 25,
          },
          targets: {
            Good: 21,
            Bad: 10,
          },
        },
        'Site 2': {
          name: 'Site 2',
          counts: {
            Good: 1,
            Bad: 1,
            [N_A]: 0,
            Other: 0,
          },
          totalsForStudy: {
            count: 2,
            targetTotal: undefined,
          },
          percentages: {
            Good: 50,
            Bad: 50,
            [N_A]: 0,
            Other: 0,
          },
          targets: {
            Good: 11,
            Bad: undefined,
            Other: undefined,
          },
        },
      }

      expect(processedData.processedDataBySite).toEqual(
        new Map(Object.entries(expectedProcessedDataBySite))
      )
      expect(processedData.dataMap).toEqual(
        new Map(Object.entries(expectedDataMap))
      )
      expect(processedData.labelMap).toEqual(
        new Map(Object.entries(expectedLabelMap))
      )
    })
  })
})
