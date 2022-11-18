function calculatePreferences(user) {
  const updatedPreferences = {
    config: '',
    sort: 0,
    star: user?.preferences?.star || [],
    complete: user?.preferences?.complete || [],
  }
  // Update complete
  if (
    !!user.preferences &&
    user.preferences.complete &&
    Object.keys(user.preferences.complete).length &&
    !Array.isArray(user.preferences.complete)
  ) {
    updatedPreferences.complete = Object.keys(user.preferences.complete).map(
      (siteName) => {
        return {
          site: siteName,
          completedSubjects: user.preferences.complete[siteName],
        }
      }
    )
  }

  //Update Starred
  if (
    !!user.preferences &&
    user.preferences.star &&
    Object.keys(user.preferences.star).length &&
    !Array.isArray(user.preferences.star)
  ) {
    updatedPreferences.star = Object.keys(user.preferences.star).map(
      (siteName) => {
        return {
          site: siteName,
          starredSubjects: user.preferences.star[siteName],
        }
      }
    )
  }

  if (user.preferences?.config && !!user.preferences?.config)
    updatedPreferences.config = user.preferences.config || ''

  if (user.preferences?.sort && !!user.preferences?.sort)
    updatedPreferences.sort = user.preferences.sort || ''
  return updatedPreferences
}

export { calculatePreferences }
