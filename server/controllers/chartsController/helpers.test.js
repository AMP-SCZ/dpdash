import { createChart, createFieldLabelValue } from '../../../test/fixtures'
import * as helpers from './helpers'
import * as helpersFactories from './testUtils'
import { FALSE_STRING, TOTALS_STUDY, TRUE_STRING } from '../../constants'

describe('chartsController - helpers', () => {
  describe(helpers.studyTargetTotal, () => {
    describe('when there are totals for the study', () => {
      describe('when the target total is undefined', () => {
        const newTargetValue = 10
        const studyTotals = {
          targetTotal: undefined,
          count: 0,
        }

        it('returns the existing study totals', () => {
          expect(helpers.studyTargetTotal(studyTotals, newTargetValue)).toBe(
            studyTotals
          )
        })
      })

      describe('when there is a target total', () => {
        const studyTotals = {
          targetTotal: 100,
          count: 0,
        }

        describe('when the new target value is defined', () => {
          const newTargetValue = 10

          it('adds the new target value to the existing target total', () => {
            expect(
              helpers.studyTargetTotal(studyTotals, newTargetValue)
            ).toEqual({ ...studyTotals, targetTotal: 110 })
          })
        })

        describe('when the new target value is not defined', () => {
          const newTargetValue = undefined

          it('sets the target total to "undefined"', () => {
            expect(
              helpers.studyTargetTotal(studyTotals, newTargetValue)
            ).toEqual({ ...studyTotals, targetTotal: undefined })
          })
        })
      })
    })

    describe('when there are no totals for the study', () => {
      it('returns a study totals object with a count of 0 and target value', () => {
        const newTargetValue = 10
        const studyTotals = undefined

        expect(helpers.studyTargetTotal(studyTotals, newTargetValue)).toEqual({
          count: 0,
          targetTotal: newTargetValue,
        })
      })
    })
  })

  describe(helpers.totalStudyTargetValue, () => {
    describe('when the total study target value is undefined', () => {
      const totalsStudyTargetTotal = undefined

      it('returns undefined', () => {
        const siteTargetValue = 10

        expect(
          helpers.totalStudyTargetValue(totalsStudyTargetTotal, siteTargetValue)
        ).toBe(undefined)
      })
    })

    describe('when there is a total study target value', () => {
      const totalsStudyTargetTotal = 100

      describe('when there is a site target value', () => {
        const siteTargetValue = 10

        it('returns the sum of the existing total target value and the new site value', () => {
          expect(
            helpers.totalStudyTargetValue(
              totalsStudyTargetTotal,
              siteTargetValue
            )
          ).toBe(110)
        })
      })

      describe('when the site target value is undefined', () => {
        const siteTargetValue = undefined

        it('returns the sum of the existing total target value and the new site value', () => {
          expect(
            helpers.totalStudyTargetValue(
              totalsStudyTargetTotal,
              siteTargetValue
            )
          ).toBe(undefined)
        })
      })
    })
  })

  describe(helpers.generateStudyTargetTotals, () => {
    it('generates a study targets object for all sites and the totals site', () => {
      const targetValues = { MA: '10', NY: '50', Foo: '4' }
      const allowedStudies = ['MA', 'NY', 'Foo']
      const chart = createChart({
        fieldLabelValueMap: [
          createFieldLabelValue({
            value: 'valueA',
            label: 'labelA',
            targetValues,
          }),
          createFieldLabelValue({
            value: 'valueB',
            label: 'labelB',
            targetValues,
          }),
        ],
      })

      expect(helpers.generateStudyTargetTotals(chart, allowedStudies)).toEqual({
        Madrid: { count: 0, targetTotal: 20 },
        NY: { count: 0, targetTotal: 100 },
        Foo: { count: 0, targetTotal: 8 },
        Totals: { count: 0, targetTotal: 128 },
      })
    })

    it('generates a study targets with undefined if a known site does not include a target', () => {
      const targetValues = { MA: '10', NY: '50', Foo: '' }
      const allowedStudies = ['MA', 'NY', 'Foo']
      const chart = createChart({
        fieldLabelValueMap: [
          createFieldLabelValue({
            value: 'valueA',
            label: 'labelA',
            targetValues,
          }),
          createFieldLabelValue({
            value: 'valueB',
            label: 'labelB',
            targetValues,
          }),
        ],
      })

      expect(helpers.generateStudyTargetTotals(chart, allowedStudies)).toEqual({
        Madrid: { count: 0, targetTotal: 20 },
        NY: { count: 0, targetTotal: 100 },
        Foo: { count: 0, targetTotal: undefined },
        Totals: { count: 0, targetTotal: undefined },
      })
    })

    it('does not update totals data with new empty sites', () => {
      const targetValues = { MA: '10', NY: '50', Foo: '4' }
      const allowedStudies = ['MA', 'NY', 'Foo', 'Bar']
      const chart = createChart({
        fieldLabelValueMap: [
          createFieldLabelValue({
            value: 'valueA',
            label: 'labelA',
            targetValues,
          }),
          createFieldLabelValue({
            value: 'valueB',
            label: 'labelB',
            targetValues,
          }),
        ],
      })

      expect(helpers.generateStudyTargetTotals(chart, allowedStudies)).toEqual({
        Madrid: { count: 0, targetTotal: 20 },
        NY: { count: 0, targetTotal: 100 },
        Foo: { count: 0, targetTotal: 8 },
        Bar: { count: 0, targetTotal: undefined },
        Totals: { count: 0, targetTotal: 128 },
      })
    })

    it('generates a study targets with undefined if a known site does not include a target and a new site is available', () => {
      const targetValues = { MA: '10', NY: '50', Foo: '' }
      const allowedStudies = ['MA', 'NY', 'Foo', 'Bar']
      const chart = createChart({
        fieldLabelValueMap: [
          createFieldLabelValue({
            value: 'valueA',
            label: 'labelA',
            targetValues,
          }),
          createFieldLabelValue({
            value: 'valueB',
            label: 'labelB',
            targetValues,
          }),
        ],
      })

      expect(helpers.generateStudyTargetTotals(chart, allowedStudies)).toEqual({
        Madrid: { count: 0, targetTotal: 20 },
        NY: { count: 0, targetTotal: 100 },
        Foo: { count: 0, targetTotal: undefined },
        Bar: { count: 0, targetTotal: undefined },
        Totals: { count: 0, targetTotal: undefined },
      })
    })
  })

  describe(helpers.isAnyTargetIncluded, () => {
    it('returns true when all sites have target totals', () => {
      const studyTotals = {
        MA: { count: 10, targetTotal: 15 },
        NY: { count: 35, targetTotal: 35 },
        Foo: { count: 5, targetTotal: 20 },
        [TOTALS_STUDY]: { count: 50, targetTotal: 70 },
      }

      expect(helpers.isAnyTargetIncluded(studyTotals)).toBe(true)
    })

    it('returns true when one site has target totals', () => {
      const studyTotals = {
        MA: { count: 10, targetTotal: undefined },
        NY: { count: 35, targetTotal: 35 },
        Foo: { count: 5, targetTotal: undefined },
        [TOTALS_STUDY]: { count: 50, targetTotal: undefined },
      }

      expect(helpers.isAnyTargetIncluded(studyTotals)).toBe(true)
    })

    it('returns false when no site has target totals', () => {
      const studyTotals = {
        MA: { count: 10, targetTotal: undefined },
        NY: { count: 35, targetTotal: undefined },
        Foo: { count: 5, targetTotal: undefined },
        [TOTALS_STUDY]: { count: 50, targetTotal: undefined },
      }

      expect(helpers.isAnyTargetIncluded(studyTotals)).toBe(false)
    })
  })

  describe(helpers.postProcessData, () => {
    it('builds an object with graph data per site', () => {
      const studyTotals = {
        Madrid: { count: 10, targetTotal: undefined },
        'New York': { count: 35, targetTotal: 35 },
        Foo: { count: 5, targetTotal: 20 },
        [TOTALS_STUDY]: { count: 50, targetTotal: 70 },
      }
      const postProcessedData = helpers.postProcessData(
        helpersFactories.postProcessDataFactory({
          'Madrid-male-undefined-MA': 5,
          'Madrid-female-10-MA': 5,
          'New York-male-15-NY': 10,
          'New York-female-20-NY': 25,
          'Foo-male-10-F': 5,
          'Foo-female-10-F': 0,
          [`${TOTALS_STUDY}-male`]: 20,
          [`${TOTALS_STUDY}-female`]: 30,
        }),
        studyTotals
      )

      expect(Object.fromEntries(postProcessedData)).toEqual({
        Madrid: {
          counts: { 'N/A': 0, female: 5, male: 5 },
          name: 'Madrid',
          percentages: {
            'N/A': 0,
            female: 50,
            male: 50,
          },
          siteCode: 'MA',
          targets: { female: 10, male: undefined },
          totalsForStudy: { count: 10, targetTotal: undefined },
        },
        'New York': {
          counts: { 'N/A': 0, female: 25, male: 10 },
          name: 'New York',
          percentages: {
            'N/A': 0,
            female: 71.42857142857143,
            male: 28.57142857142857,
          },
          siteCode: 'NY',
          targets: { female: 20, male: 15 },
          totalsForStudy: { count: 35, targetTotal: 35 },
        },
        Foo: {
          counts: { 'N/A': 15, female: 0, male: 5 },
          name: 'Foo',
          percentages: { 'N/A': 75, female: 0, male: 25 },
          siteCode: 'F',
          targets: { female: 10, male: 10 },
          totalsForStudy: { count: 5, targetTotal: 20 },
        },
        Totals: {
          counts: { 'N/A': 20, female: 30, male: 20 },
          name: 'Totals',
          percentages: {
            'N/A': 28.57142857142857,
            female: 42.857142857142854,
            male: 28.57142857142857,
          },
          siteCode: undefined,
          targets: { female: 40, male: 25 },
          totalsForStudy: { count: 50, targetTotal: 70 },
        },
      })
    })

    it('builds an object with graph data per site when there are only counts and no targets', () => {
      const studyTotals = {
        Madrid: { count: 10, targetTotal: undefined },
        'New York': { count: 35, targetTotal: undefined },
        Foo: { count: 5, targetTotal: undefined },
        Bar: { count: 0, targetTotal: undefined },
        [TOTALS_STUDY]: { count: 50, targetTotal: undefined },
      }
      const data = helpersFactories.postProcessDataFactory({
        'Madrid-male-undefined-MA': 5,
        'Madrid-female-undefined-MA': 5,
        'New York-male-undefined-NY': 10,
        'New York-female-undefined-NY': 25,
        'Foo-male-undefined-F': 5,
        'Foo-female-undefined-F': 0,
        'Bar-male-undefined-B': 0,
        'Bar-female-undefined-B': 0,
        [`${TOTALS_STUDY}-male`]: 20,
        [`${TOTALS_STUDY}-female`]: 30,
      })
      const postProcessedData = helpers.postProcessData(data, studyTotals)

      expect(Object.fromEntries(postProcessedData)).toEqual({
        Madrid: {
          counts: { 'N/A': 0, female: 5, male: 5 },
          name: 'Madrid',
          percentages: {
            'N/A': 0,
            female: 50,
            male: 50,
          },
          siteCode: 'MA',
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 10, targetTotal: undefined },
        },
        'New York': {
          counts: { 'N/A': 0, female: 25, male: 10 },
          name: 'New York',
          percentages: {
            'N/A': 0,
            female: 71.42857142857143,
            male: 28.57142857142857,
          },
          siteCode: 'NY',
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 35, targetTotal: undefined },
        },
        Foo: {
          counts: { 'N/A': 0, female: 0, male: 5 },
          name: 'Foo',
          siteCode: 'F',
          percentages: { 'N/A': 0, female: 0, male: 100 },
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 5, targetTotal: undefined },
        },
        Bar: {
          name: 'Bar',
          siteCode: 'B',
          counts: { male: 0, female: 0, 'N/A': 0 },
          totalsForStudy: { count: 0, targetTotal: undefined },
          percentages: { male: 0, female: 0, 'N/A': 0 },
          targets: { male: undefined, female: undefined },
        },
        Totals: {
          counts: { 'N/A': 0, female: 30, male: 20 },
          name: 'Totals',
          percentages: {
            'N/A': 0,
            female: 60,
            male: 40,
          },
          targets: {},
          totalsForStudy: { count: 50, targetTotal: undefined },
        },
      })
    })

    it('it replaces site abbreviation for the site name', () => {
      const studyTotals = {
        Madrid: { count: 10, targetTotal: undefined },
        Melbourne: { count: 35, targetTotal: undefined },
        NORTHWELL: { count: 5, targetTotal: undefined },
        UNC: { count: 0, targetTotal: undefined },
        [TOTALS_STUDY]: { count: 50, targetTotal: undefined },
      }
      const data = helpersFactories.postProcessDataFactory({
        'Madrid-male-undefined-MA': 5,
        'Madrid-female-undefined-MA': 5,
        'Melbourne-male-undefined-ME': 10,
        'Melbourne-female-undefined-ME': 25,
        'NORTHWELL-male-undefined-NW': 5,
        'NORTHWELL-female-undefined-NW': 0,
        'UNC-male-undefined-UNC': 0,
        'UNC-female-undefined-UNC': 0,
        [`${TOTALS_STUDY}-male`]: 20,
        [`${TOTALS_STUDY}-female`]: 30,
      })
      const postProcessedData = helpers.postProcessData(data, studyTotals)

      expect(Object.fromEntries(postProcessedData)).toEqual({
        Madrid: {
          counts: { 'N/A': 0, female: 5, male: 5 },
          name: 'Madrid',
          percentages: {
            'N/A': 0,
            female: 50,
            male: 50,
          },
          siteCode: 'MA',
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 10, targetTotal: undefined },
        },
        Melbourne: {
          counts: { 'N/A': 0, female: 25, male: 10 },
          name: 'Melbourne',
          percentages: {
            'N/A': 0,
            female: 71.42857142857143,
            male: 28.57142857142857,
          },
          siteCode: 'ME',
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 35, targetTotal: undefined },
        },
        NORTHWELL: {
          counts: { 'N/A': 0, female: 0, male: 5 },
          name: 'NORTHWELL',
          siteCode: 'NW',
          percentages: { 'N/A': 0, female: 0, male: 100 },
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 5, targetTotal: undefined },
        },
        UNC: {
          name: 'UNC',
          counts: { male: 0, female: 0, 'N/A': 0 },
          totalsForStudy: { count: 0, targetTotal: undefined },
          percentages: { male: 0, female: 0, 'N/A': 0 },
          siteCode: 'UNC',
          targets: { male: undefined, female: undefined },
        },
        Totals: {
          counts: { 'N/A': 0, female: 30, male: 20 },
          name: 'Totals',
          percentages: {
            'N/A': 0,
            female: 60,
            male: 40,
          },
          targets: {},
          totalsForStudy: { count: 50, targetTotal: undefined },
        },
      })
    })

    it('it defaults to site abbreviation if site name is not available', () => {
      const studyTotals = {
        Madrid: { count: 10, targetTotal: undefined },
        NY: { count: 35, targetTotal: undefined },
        Foo: { count: 5, targetTotal: undefined },
        UNC: { count: 0, targetTotal: undefined },
        [TOTALS_STUDY]: { count: 50, targetTotal: undefined },
      }
      const data = helpersFactories.postProcessDataFactory({
        'Madrid-male-undefined-MA': 5,
        'Madrid-female-undefined-MA': 5,
        'NY-male-undefined-NY': 10,
        'NY-female-undefined-NY': 25,
        'Foo-male-undefined-F': 5,
        'Foo-female-undefined-F': 0,
        'UNC-male-undefined-UNC': 0,
        'UNC-female-undefined-UNC': 0,
        [`${TOTALS_STUDY}-male`]: 20,
        [`${TOTALS_STUDY}-female`]: 30,
      })
      const postProcessedData = helpers.postProcessData(data, studyTotals)

      expect(Object.fromEntries(postProcessedData)).toEqual({
        Madrid: {
          counts: { 'N/A': 0, female: 5, male: 5 },
          name: 'Madrid',
          percentages: {
            'N/A': 0,
            female: 50,
            male: 50,
          },
          siteCode: 'MA',
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 10, targetTotal: undefined },
        },
        NY: {
          counts: { 'N/A': 0, female: 25, male: 10 },
          name: 'NY',
          percentages: {
            'N/A': 0,
            female: 71.42857142857143,
            male: 28.57142857142857,
          },
          siteCode: 'NY',
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 35, targetTotal: undefined },
        },
        Foo: {
          counts: { 'N/A': 0, female: 0, male: 5 },
          name: 'Foo',
          percentages: { 'N/A': 0, female: 0, male: 100 },
          siteCode: 'F',
          targets: { female: undefined, male: undefined },
          totalsForStudy: { count: 5, targetTotal: undefined },
        },
        UNC: {
          name: 'UNC',
          counts: { male: 0, female: 0, 'N/A': 0 },
          totalsForStudy: { count: 0, targetTotal: undefined },
          percentages: { male: 0, female: 0, 'N/A': 0 },
          siteCode: 'UNC',
          targets: { male: undefined, female: undefined },
        },
        Totals: {
          counts: { 'N/A': 0, female: 30, male: 20 },
          name: 'Totals',
          percentages: {
            'N/A': 0,
            female: 60,
            male: 40,
          },
          targets: {},
          totalsForStudy: { count: 50, targetTotal: undefined },
        },
      })
    })
  })

  describe(helpers.processTotals, () => {
    it('creates a new site on studyTotals with a count and targetValue property', () => {
      const studyTotals = {
        [TOTALS_STUDY]: {
          count: 0,
          targetTotal: 0,
        },
      }
      const totalsToProcess = {
        shouldCountSubject: true,
        studyTotals,
        siteName: 'Foo',
        targetValue: 2,
      }
      helpers.processTotals(totalsToProcess)

      expect(studyTotals).toEqual({
        Foo: { count: 1, targetValue: 2 },
        [TOTALS_STUDY]: {
          count: 1,
          targetTotal: 0,
        },
      })
    })

    it("adds to a site's studyTotals count if subject should be counted", () => {
      const studyTotals = {
        Foo: { count: 1, targetValue: 2 },
        [TOTALS_STUDY]: {
          count: 1,
          targetTotal: 0,
        },
      }
      const totalsToProcess = {
        shouldCountSubject: true,
        studyTotals,
        siteName: 'Foo',
        targetValue: 2,
      }
      helpers.processTotals(totalsToProcess)

      expect(studyTotals).toEqual({
        Foo: { count: 2, targetValue: 2 },
        [TOTALS_STUDY]: {
          count: 2,
          targetTotal: 0,
        },
      })
    })

    it("does not add to a site's count if subject is not to be counted", () => {
      const studyTotals = {
        Foo: { count: 1, targetValue: 2 },
        [TOTALS_STUDY]: {
          count: 1,
          targetTotal: 0,
        },
      }
      const totalsToProcess = {
        shouldCountSubject: false,
        studyTotals,
        siteName: 'Foo',
        targetValue: 2,
      }
      helpers.processTotals(totalsToProcess)

      expect(studyTotals).toEqual({
        Foo: { count: 1, targetValue: 2 },
        [TOTALS_STUDY]: {
          count: 1,
          targetTotal: 0,
        },
      })
    })
  })

  describe(helpers.mongoQueryFromFilters, () => {
    it('returns undefined when there are no filters', () => {
      const filters = undefined

      expect(helpers.mongoQueryFromFilters(filters)).toBeUndefined()
    })

    it('returns an object that can be used to query mongo', () => {
      const filters = {
        chrcrit_part: [
          { name: 'HC', value: TRUE_STRING },
          { name: 'CHR', value: FALSE_STRING },
          { name: 'Missing', value: TRUE_STRING },
        ],
        included_excluded: [
          { name: 'Included', value: FALSE_STRING },
          { name: 'Excluded', value: TRUE_STRING },
          { name: 'Missing', value: FALSE_STRING },
        ],
      }

      expect(helpers.mongoQueryFromFilters(filters)).toEqual([
        { chrcrit_part: { $in: [2, ''] } },
        { included_excluded: { $in: [0] } },
      ])
    })
  })
})
