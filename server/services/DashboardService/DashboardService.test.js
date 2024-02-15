import dayjs from 'dayjs'
import DashboardService from '.'
import DashboardDataProcessor from '../../data_processors/DashboardDataProcessor'
import {
  createDb,
  createAnalysisConfig,
  createMatrixData,
  createConfiguration,
  createParticipantDayData,
} from '../../../test/fixtures'
import { AbstractCursor } from 'mongodb'
import { collections } from '../../utils/mongoCollections'

describe(DashboardService, () => {
  describe('methods', () => {
    describe('data methods', () => {
      let appDb

      const configAnalysisData = [
        createAnalysisConfig({
          label: 'Jump',
          analysis: 'jump_of',
          variable: 'jumpVariable',
          category: 'power',
        }),
        createAnalysisConfig({
          label: 'Size',
          analysis: 'size_of',
          variable: 'sizeVariable',
          category: 'sizeing',
        }),
      ]

      const dataOne = {
        study: 'YA',
        assessment: 'jump_of',
        participant: 'YA01',
        dayData: [
          createParticipantDayData({
            day: 10,
            jumpVariable: 1,
          }),
          createParticipantDayData({
            day: 20,
            jumpVariable: 30,
          }),
        ],
      }
      const dataTwo = {
        study: 'YA',
        participant: 'YA01',
        assessment: 'size_of',
        dayData: [
          createParticipantDayData({
            day: 1,
            sizeVariable: 30,
          }),
          createParticipantDayData({
            day: 45,
            sizeVariable: 2,
          }),
        ],
      }

      beforeAll(async () => {
        appDb = await global.MONGO_INSTANCE.db('dashService')

        await appDb
          .collection(collections.assessmentDayData)
          .insertMany([dataOne, dataTwo])
        await appDb.collection(collections.metadata).insertOne({
          study: 'YA',
          participants: [
            { participant: 'YA01', Consent: new Date('2022-02-26') },
          ],
        })
      })
      afterAll(async () => await appDb.dropDatabase())
      it('returns a mongodb cursor', async () => {
        let count = 0
        const dashboardService = new DashboardService(
          appDb,
          'YA',
          'YA01',
          configAnalysisData
        )
        const mongoCursor = await dashboardService.dashboardDataCursor()
        mongoCursor.on('data', () => (count = count + 1))
        mongoCursor.on('end', () => {
          expect(count).toEqual(2)
        })
        mongoCursor.on('error', (_) => {})
      })
      it('returns a participants consent date', async () => {
        const dashboardService = new DashboardService(
          appDb,
          'YA',
          'YA01',
          configAnalysisData
        )
        const consentDate = await dashboardService.consentDate()

        expect(consentDate).toEqual(new Date('2022-02-26T00:00:00.000Z'))
      })
    })
  })
})
