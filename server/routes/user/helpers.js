const removeSiteSubject = (siteSubjects, currentSubject) =>
  siteSubjects.filter((subject) => subject !== currentSubject)

const addSubjectToSiteSubjectsStarred = (siteSubjects, { site, subject }) => {
  const siteSubjectSiteIndex = siteSubjects.findIndex(
    (siteSubject) => siteSubject.site === site
  )

  if (siteSubjectSiteIndex > -1) {
    siteSubjects[siteSubjectSiteIndex].starredSubjects.push(subject)
  } else {
    siteSubjects.push({
      site: site,
      starredSubjects: [subject],
    })
  }

  return siteSubjects
}

const addSubjectToSiteSubjectsComplete = (siteSubjects, { site, subject }) => {
  const siteSubjectSiteIndex = siteSubjects.findIndex(
    (siteSubject) => siteSubject.site === site
  )

  if (siteSubjectSiteIndex > -1) {
    siteSubjects[siteSubjectSiteIndex].completedSubjects.push(subject)
  } else {
    siteSubjects.push({
      site: site,
      completedSubjects: [subject],
    })
  }

  return siteSubjects
}

export {
  removeSiteSubject,
  addSubjectToSiteSubjectsStarred,
  addSubjectToSiteSubjectsComplete,
}
