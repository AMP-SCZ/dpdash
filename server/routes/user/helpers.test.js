import * as userHelpers from './helpers'

describe('userHelpers', () => {
  const req = {}
  const user = {}

  beforeEach(() => {
    req.body = { site: 'CA', subject: 'CA2' }
    user.siteSubjects = [
      {
        site: 'CA',
        starredSubjects: ['CA1', 'CA2', 'CA3', 'CA4'],
        completedSubjects: ['CA1', 'CA2', 'CA3', 'CA4'],
      },
    ]
  })

  describe(userHelpers.removeSiteSubject, () => {
    it('Removes a subject from a starredSubjects list', () => {
      const siteSubjectIndex = user.siteSubjects.findIndex(
        (siteSubject) => siteSubject.site === req.body.site
      )

      expect(
        userHelpers.removeSiteSubject(
          user.siteSubjects[siteSubjectIndex].starredSubjects,
          req.body.subject
        )
      ).toEqual(['CA1', 'CA3', 'CA4'])
    })

    it('Removes a subject from a completedSubjects list', () => {
      const siteSubjectIndex = user.siteSubjects.findIndex(
        (siteSubject) => siteSubject.site === req.body.site
      )

      expect(
        userHelpers.removeSiteSubject(
          user.siteSubjects[siteSubjectIndex].completedSubjects,
          req.body.subject
        )
      ).toEqual(['CA1', 'CA3', 'CA4'])
    })
  })

  describe(userHelpers.addSubjectToSiteSubjectsComplete, () => {
    it('Appends a user to siteSubjects completedSubjects list', () => {
      req.body.subject = 'CA6'

      expect(
        userHelpers.addSubjectToSiteSubjectsComplete(
          user.siteSubjects,
          req.body
        )
      ).toEqual([
        {
          site: 'CA',
          starredSubjects: ['CA1', 'CA2', 'CA3', 'CA4'],
          completedSubjects: ['CA1', 'CA2', 'CA3', 'CA4', 'CA6'],
        },
      ])
    })

    it('Creates a new siteSubjects object if site is not in the siteSubjects list', () => {
      req.body.site = 'LA'
      req.body.subject = 'LA55'

      expect(
        userHelpers.addSubjectToSiteSubjectsComplete(
          user.siteSubjects,
          req.body
        )
      ).toEqual([
        {
          site: 'CA',
          starredSubjects: ['CA1', 'CA2', 'CA3', 'CA4'],
          completedSubjects: ['CA1', 'CA2', 'CA3', 'CA4'],
        },
        {
          site: 'LA',
          completedSubjects: ['LA55'],
        },
      ])
    })
  })

  describe(userHelpers.addSubjectToSiteSubjectsStarred, () => {
    it('Appends a user to siteSubjects completedSubjects list', () => {
      req.body.subject = 'CA6'

      expect(
        userHelpers.addSubjectToSiteSubjectsStarred(user.siteSubjects, req.body)
      ).toEqual([
        {
          site: 'CA',
          starredSubjects: ['CA1', 'CA2', 'CA3', 'CA4', 'CA6'],
          completedSubjects: ['CA1', 'CA2', 'CA3', 'CA4'],
        },
      ])
    })

    it('Creates a new siteSubjects object if site is not in the siteSubjects list', () => {
      req.body.site = 'LA'
      req.body.subject = 'LA55'

      expect(
        userHelpers.addSubjectToSiteSubjectsStarred(user.siteSubjects, req.body)
      ).toEqual([
        {
          site: 'CA',
          starredSubjects: ['CA1', 'CA2', 'CA3', 'CA4'],
          completedSubjects: ['CA1', 'CA2', 'CA3', 'CA4'],
        },
        {
          site: 'LA',
          starredSubjects: ['LA55'],
        },
      ])
    })
  })
})
