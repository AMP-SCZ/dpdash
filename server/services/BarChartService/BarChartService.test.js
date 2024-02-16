import BarChartService from '.'
import {
  createChart,
  createDb,
  createFieldLabelValue,
  createAssessmentDayData,
} from '../../../test/fixtures'
import { TOTALS_STUDY } from '../../constants'
import BarChartDataProcessor from '../../data_processors/BarChartDataProcessor'

jest.mock('../../data_processors/BarChartDataProcessor')

const labels = {
  Good: { name: 'Good', color: 'good-color' },
  Bar: { name: 'Bad', color: 'bad-color' },
}
const dataBySite = {
  'Site1-Good-0': 1,
  'Site1-Bad-0': 2,
  'Site2-Good-4': 4,
  'Site2-Bad-6': 6,
  [`${TOTALS_STUDY}-Site1`]: 3,
  [`${TOTALS_STUDY}-Site2`]: 10,
}
const studyTotals = {
  Site1: { count: 3, targetValue: undefined },
  Site2: { count: 10, targetValue: 10 },
  [TOTALS_STUDY]: { count: 13 },
}
const db = createDb()
const chart = createChart(
  {
    _id: '1',
    title: 'Eeg Measurements',
    description: 'Participant EEG Measurements',
    assessment: 'eeg',
    variable: 'eeg',
    public: false,
    owner: 'owl',
  },
  [
    createFieldLabelValue({
      value: 'bar',
      label: 'Bar',
      color: 'red',
      targetValues: {
        LA: '2',
        YA: '1',
        MA: '2',
      },
    }),
  ]
)
const participants = [
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'LA1',
    study: 'LA',
    dayData: [{ eeg: 'foo', var: 'var', baz: 'baz' }],
  }),
]
const userAccess = ['Site 1', 'Site 2']

describe(BarChartService, () => {
  describe('.createChart', () => {
    const mockProcessData = jest.fn()

    beforeEach(() => {
      BarChartDataProcessor.mockImplementationOnce(() => {
        return {
          processData: mockProcessData,
        }
      })
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('returns data, labels, and study totals', async () => {
      mockProcessData.mockReturnValue({
        processedDataBySite: new Map(Object.entries(dataBySite)),
        labelMap: new Map(Object.entries(labels)),
        studyTotals,
      })

      const service = new BarChartService(db, chart)

      const createdChart = service.createChart(participants, userAccess)

      expect(createdChart).toEqual({
        dataBySite: [1, 2, 4, 6, 3, 10],
        labels: [
          { name: 'Good', color: 'good-color' },
          { name: 'Bad', color: 'bad-color' },
        ],
        studyTotals,
      })
    })
  })

  describe('.legend', () => {
    it('returns a legend object', () => {
      const service = new BarChartService(db, chart)

      expect(service.legend()).toEqual([
        { name: 'Foo', symbol: { fill: '#e2860a', type: 'square' } },
        { name: 'Bar', symbol: { fill: 'red', type: 'square' } },
      ])
    })
  })
})
