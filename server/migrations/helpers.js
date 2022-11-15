function calculatePreferences(user) {
  const preferences = migratePreferences(user)

  return {
    siteSubjects: user.access.length ? migrateSiteSubjects(user) : [],
    preferences,
  }
}

function migrateSiteSubjects(user) {
  return user.access.map((site) => ({
    site,
    starredSubjects: user.preferences.star[site] || [],
    completedSubjects: user.preferences.complete[site] || [],
  }))
}

function migratePreferences(user) {
  return {
    sort: user.preferences.sort || 0,
    config: user.preferences.config || '',
  }
}

export { calculatePreferences }
