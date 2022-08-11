export const babyProofPreferences = (preferences) => {
  let preference = {}
  preference['star'] = 'star' in preferences ? preferences['star'] : {}
  preference['sort'] = 'sort' in preferences ? preferences['sort'] : 0
  preference['config'] = 'config' in preferences ? preferences['config'] : ''
  preference['complete'] =
    'complete' in preferences ? preferences['complete'] : {}
  return preference
}

export const preparePreferences = (configurations, preferences) => {
  console.log(configurations, preferences)
  let preference = {}
  preference['config'] = configurations._id
  preference['complete'] =
    'complete' in preferences ? preferences['complete'] : {}
  preference['star'] = 'star' in preferences ? preferences['star'] : {}
  preference['sort'] = 'sort' in preferences ? preferences['sort'] : 0
  preference = babyProofPreferences(preference)
  return preference
}
