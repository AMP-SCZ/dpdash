const babyProofPreferences = (preferences) => {
  const defaultPreferences = {
    complete: {},
    star: {},
    sort: 0,
  }

  return { ...defaultPreferences, ...preferences }
}

export const preparePreferences = (configuration, preferences) => {
  let preference = {}
  preference['config'] = configuration
  preference['complete'] =
    'complete' in preferences ? preferences['complete'] : {}
  preference['star'] = 'star' in preferences ? preferences['star'] : {}
  preference['sort'] = 'sort' in preferences ? preferences['sort'] : 0
  preference = babyProofPreferences(preference)
  return preference
}
