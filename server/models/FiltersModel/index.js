import { STUDIES_TO_OMIT, TRUE_STRING, FALSE_STRING } from '../../constants'

const DEFAULT_FILTERS = {
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
  sites: [],
}

const FiltersModel = {
  calculateFilters: function (filters, userAccess) {
    if (!filters) {
      return {
        ...DEFAULT_FILTERS,
        sites: userAccess
          .filter((site) => !STUDIES_TO_OMIT.includes(site))
          .sort((prevSite, nextSite) => (prevSite < nextSite ? -1 : 1)),
      }
    } else {
      return {
        ...filters,
        sites: Object.values(filters.sites)
          .map(({ value }) => value)
          .sort((prevSite, nextSite) => (prevSite < nextSite ? -1 : 1)),
      }
    }
  },
  normalizeFilters: (filters) => {
    return {
      ...filters,
      sites: filters.sites.map((site) => ({ label: site, value: site })),
    }
  },
}

export default FiltersModel
