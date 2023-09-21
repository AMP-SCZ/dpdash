import DashboardDataProcessor from '.'
import {
  createDb,
  createAnalysisConfig,
  createSubjectDayData,
  createAssessmentsFromConfig,
  createMatrixData,
} from '../../../test/fixtures'
import { collections } from '../../utils/mongoCollections'

describe('Data Processors - Dashboard', () => {
  describe(DashboardDataProcessor.calculateDashboardData, () => {
    const subject = 'subject'
    const assessmentsFromConfig = [
      createAssessmentsFromConfig({
        assessment: 'size_of',
        collection: 'size-of-collection',
      }),
      createAssessmentsFromConfig({
        assessment: 'jump_of',
        collection: 'jump-of-collection',
      }),
      createAssessmentsFromConfig({
        assessment: 'read_of',
        collection: 'read-of-collection',
      }),
    ]
    const config = [
      createAnalysisConfig({
        label: 'Size',
        analysis: 'size_of',
        color: ['red', 'blue', 'white'],
        range: [1, 2],
        variable: 'sizeVariable',
        category: 'measurements',
      }),
      createAnalysisConfig({
        label: 'Jump',
        analysis: 'jump_of',
        color: ['red', 'blue', 'white'],
        range: [1, 2],
        variable: 'jumpVariable',
        category: 'power',
      }),
      createAnalysisConfig({
        label: 'Read',
        analysis: 'read_of',
        color: ['red', 'blue', 'white'],
        range: [1, 2],
        variable: 'readVariable',
        category: 'reading',
      }),
    ]
    const jumpVariableData = [
      createSubjectDayData({
        assessment: 'jump_of',
        subject,
        day: 10,
        jumpVariable: 1,
      }),
      createSubjectDayData({
        assessment: 'jump_of',
        subject,
        day: 20,
        jumpVariable: 30,
      }),
    ]
    const sizeVariableData = [
      createSubjectDayData({
        assessment: 'size_of',
        subject,
        day: 1,
        sizeVariable: 30,
      }),
      createSubjectDayData({
        assessment: 'size_of',
        subject,
        day: 45,
        sizeVariable: 2,
      }),
    ]

    it('calculates the min, max and mean of the data and appends it to the matrix result array', async () => {
      await appDb.collection(collections.assessmentSubjectDayData).insertMany([
        ...jumpVariableData,
        ...sizeVariableData,
      ])

      const dashboardProcessor = new DashboardDataProcessor(
        assessmentsFromConfig,
        config,
        subject,
        appDb,
      )
      const { matrixData } = await dashboardProcessor.calculateDashboardData()

      expect(matrixData).toEqual([
        createMatrixData({
          analysis: 'size_of',
          category: 'measurements',
          color: ['red', 'blue', 'white'],
          data: [
            {
              day: 1,
              sizeVariable: 30,
            },
            {
              day: 45,
              sizeVariable: 2,
            },
          ],
          label: 'Size',
          range: [1, 2],
          stat: [
            {
              max: 30,
              mean: 16,
              min: 2,
            },
          ],
          variable: 'sizeVariable',
        }),
        createMatrixData({
          analysis: 'jump_of',
          category: 'power',
          color: ['red', 'blue', 'white'],
          data: [
            {
              day: 10,
              jumpVariable: 1,
            },
            {
              day: 20,
              jumpVariable: 30,
            },
          ],
          label: 'Jump',
          range: [1, 2],
          stat: [
            {
              max: 30,
              mean: 15.5,
              min: 1,
            },
          ],
          variable: 'jumpVariable',
        }),
        createMatrixData({
          analysis: 'read_of',
          category: 'reading',
          color: ['red', 'blue', 'white'],
          data: [],
          label: 'Read',
          range: [1, 2],
          stat: [],
          variable: 'readVariable',
        }),
      ])
    })
  })
})
