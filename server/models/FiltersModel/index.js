import { STUDIES_TO_OMIT, TRUE_STRING, FALSE_STRING } from '../../constants'

const FiltersModel = {
  calculateFilters: function (filters, userAccess) {
    if (!filters) {
      this.defaultFilters.sites = userAccess
        .filter((site) => !STUDIES_TO_OMIT.includes(site))
        .sort((prevSite, nextSite) => (prevSite < nextSite ? -1 : 1))

      return this.defaultFilters
    } else {
      filters.sites = Object.values(filters.sites)
        .map(({ value }) => value)
        .sort((prevSite, nextSite) => (prevSite < nextSite ? -1 : 1))

      return filters
    }
  },
  defaultFilters: {
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
  },
  normalizeFilters: (filters) => {
    return {
      ...filters,
      sites: filters.sites.map((site) => ({ label: site, value: site })),
    }
  },
}

export default FiltersModel
