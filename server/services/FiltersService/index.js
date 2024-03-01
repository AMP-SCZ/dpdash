import {
  INCLUSION_EXCLUSION_CRITERIA_FORM,
  SOCIODEMOGRAPHICS_FORM,
  TRUE_STRING,
  FALSE_STRING,
} from '../../constants'
import StudiesModel from '../../models/StudiesModel'

export const FILTER_TO_MONGO_VALUE_MAP = {
  HC: 2,
  CHR: 1,
  Missing: null,
  Included: 1,
  Excluded: 0,
  Male: 1,
  Female: 2,
}

export const INDIVIDUAL_FILTERS_MONGO_PROJECTION = {
  study: 1,
  collection: 1,
  _id: 0,
  subject: 1,
}

export const DEFAULT_FILTERS = {
  chrcrit_part: [
    { name: 'HC', value: TRUE_STRING },
    { name: 'CHR', value: TRUE_STRING },
    { name: 'Missing', value: TRUE_STRING },
  ],
  included_excluded: [
    { name: 'Included', value: TRUE_STRING },
    { name: 'Excluded', value: FALSE_STRING },
    { name: 'Missing', value: FALSE_STRING },
  ],
  sex_at_birth: [
    { name: 'Male', value: TRUE_STRING },
    { name: 'Female', value: TRUE_STRING },
    { name: 'Missing', value: TRUE_STRING },
  ],
  sites: {},
}

class FiltersService {
  constructor(filters, allSites) {
    this._filters = filters || DEFAULT_FILTERS
    this.allSites = allSites || []
  }

  allFiltersInactive = () => {
    const { sites, ...filters } = this.filters

    return Object.keys(filters).every((filterKey) =>
      filters[filterKey].every((filter) => filter.value === FALSE_STRING)
    )
  }

  get filters() {
    const filtersSites = Object.values(this._filters.sites)
    const unsanitizedSites =
      filtersSites.length > 0 ? filtersSites : this.allSites
    return {
      ...this._filters,
      sites: StudiesModel.sanitizeAndSort(unsanitizedSites),
    }
  }

  get filterQueries() {
    const filterQueries = []
    for (let filterKey of Object.keys(this.filters)) {
      const filter = this.filters[filterKey]
      const includedFilters = filter.filter(({_, value}) => value === TRUE_STRING)
      const includedValues = includedFilters.map(({name, _}) => FILTER_TO_MONGO_VALUE_MAP[name])
      switch (filterKey) {
        case 'included_excluded':
          filterQueries.push({
            $and: [
              { assessment: INCLUSION_EXCLUSION_CRITERIA_FORM },
              {'dayData.included_excluded': {$in: includedValues } }
            ]
          })
          break
        case 'chrcrit_part':
          filterQueries.push({
            $and: [
              { assessment: INCLUSION_EXCLUSION_CRITERIA_FORM },
              {'dayData.chrcrit_part': {$in: includedValues } }
            ]
          })
          break
        case 'sex_at_birth':
          filterQueries.push({
            $and: [
              { assessment: SOCIODEMOGRAPHICS_FORM },
              {'dayData.chrdemo_sexassigned': {$in: includedValues } }
            ]
          })
          break
      }
    }
    return filterQueries
  }
}

export default FiltersService
