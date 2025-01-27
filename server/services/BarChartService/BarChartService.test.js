import { ObjectId } from 'mongodb'

import BarChartService from '.'
import { createChart, createFieldLabelValue } from '../../../test/fixtures'
import { dayDataAssessments } from '../../../test/testUtils'
import { collections } from '../../utils/mongoCollections'
import FiltersService, { DEFAULT_FILTERS } from '../FiltersService'

describe(BarChartService, () => {
  describe('methods', () => {
    describe('createChart', () => {
      let appDb
      const chart = createChart(
        {
          _id: new ObjectId(),
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

      beforeAll(async () => {
        appDb = await global.MONGO_INSTANCE.db('barService')

        await appDb
          .collection(collections.assessmentDayData)
          .insertMany(dayDataAssessments)
      })

      afterAll(async () => {
        await appDb.dropDatabase()
      })
      it('returns data, labels, and study totals', async () => {
        const filters = {
          ...DEFAULT_FILTERS,
          recruitment_status: {
            Recruited: { label: 'Recruited', value: 0 },
            'Not recruited': { label: 'Not Recruited', value: 0 },
          },
          sites: {
            YA: { label: 'YA', value: 1 },
            LA: { label: 'LA', value: 1 },
            MA: { label: 'MA', value: 1 },
          },
        }
        const filterService = new FiltersService(filters, ['YA', 'LA', 'MA'])
        const chartService = new BarChartService(appDb, chart, filterService)
        const chartData = await chartService.createChart()
        expect(chartData).toEqual({
          labelMap: new Map()
            .set('Foo', {
              color: '#e2860a',
              name: 'Foo',
            })
            .set('Bar', {
              color: 'red',
              name: 'Bar',
            })
            .set('N/A', {
              color: '#808080',
              name: 'N/A',
            }),

          processedDataBySite: new Map()
            .set('Yale', {
              counts: {
                Bar: 2,
                Foo: 2,
                'N/A': 0,
              },
              siteCode: 'YA',
              name: 'Yale',
              percentages: {
                Bar: 50,
                Foo: 50,
                'N/A': 0,
              },
              targets: {
                Bar: 1,
                Foo: 3,
              },
              totalsForStudy: {
                count: 4,
                targetTotal: 4,
              },
            })
            .set('Totals', {
              counts: {
                Bar: 2,
                Foo: 6,
                'N/A': 6,
              },
              siteCode: 'Totals',
              name: 'Totals',
              percentages: {
                Bar: 14.285714285714285,
                Foo: 42.857142857142854,
                'N/A': 42.857142857142854,
              },
              targets: {
                Bar: 3,
                Foo: 6,
              },
              totalsForStudy: {
                count: 8,
                targetTotal: 14,
              },
            })
            .set('Madrid', {
              counts: {
                Bar: 0,
                Foo: 4,
                'N/A': 1,
              },
              siteCode: 'MA',
              name: 'Madrid',
              percentages: {
                Bar: 0,
                Foo: 80,
                'N/A': 20,
              },
              targets: {
                Bar: 2,
                Foo: 3,
              },
              totalsForStudy: {
                count: 4,
                targetTotal: 5,
              },
            }),
          studyTotals: {
            Madrid: {
              count: 4,
              targetTotal: 5,
            },
            Totals: {
              count: 8,
              targetTotal: 14,
            },
            UCLA: {
              count: 0,
              targetTotal: 5,
            },
            Yale: {
              count: 4,
              targetTotal: 4,
            },
          },
        })
      })
    })
  })
  describe('.legend', () => {
    const chart = createChart(
      {
        _id: new ObjectId(),
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

    it('returns a legend object', () => {
      const service = new BarChartService({}, chart, {})

      expect(service.legend()).toEqual([
        { name: 'Foo', symbol: { fill: '#e2860a', type: 'rect' } },
        { name: 'Bar', symbol: { fill: 'red', type: 'rect' } },
      ])
    })
  })
})
