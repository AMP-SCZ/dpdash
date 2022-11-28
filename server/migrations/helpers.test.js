import { calculatePreferences } from './helpers'

describe(calculatePreferences, () => {
  it('converts legacy dpdash preference object into new data structure', () => {
    const user = {
      access: ['CA', 'LA'],
      preferences: {
        complete: {
          CA: [],
        },
        star: {
          CA: [],
          LA: [],
        },
        sort: 0,
        config: 'foo',
      },
    }

    expect(calculatePreferences(user)).toEqual({
      siteSubjects: [
        { site: 'CA', starredSubjects: [], completedSubjects: [] },
        { site: 'LA', starredSubjects: [], completedSubjects: [] },
      ],
      preferences: { config: 'foo', sort: 0 },
    })
  })

  it("appends a site's star subjects in the siteSubjects[site].starredSubjects list", () => {
    const user = {
      access: ['CA', 'LA'],
      preferences: {
        complete: {},
        star: {
          CA: ['CA4', 'CA6', 'CA7'],
          LA: ['LA1', 'LA2', 'LA3'],
        },
        sort: 0,
        config: 'foo',
      },
    }

    expect(calculatePreferences(user)).toEqual({
      siteSubjects: [
        {
          site: 'CA',
          starredSubjects: ['CA4', 'CA6', 'CA7'],
          completedSubjects: [],
        },
        {
          site: 'LA',
          starredSubjects: ['LA1', 'LA2', 'LA3'],
          completedSubjects: [],
        },
      ],
      preferences: { config: 'foo', sort: 0 },
    })
  })

  it("appends a site's complete subjects in the siteSubjects[site].completedSubjects list ", () => {
    const user = {
      access: ['CA', 'LA'],
      preferences: {
        complete: { CA: ['CA4', 'CA6', 'CA7'], LA: ['LA1', 'LA2', 'LA3'] },
        star: {},
        sort: 0,
        config: 'foo',
      },
    }

    expect(calculatePreferences(user)).toEqual({
      siteSubjects: [
        {
          site: 'CA',
          starredSubjects: [],
          completedSubjects: ['CA4', 'CA6', 'CA7'],
        },
        {
          site: 'LA',
          starredSubjects: [],
          completedSubjects: ['LA1', 'LA2', 'LA3'],
        },
      ],
      preferences: { config: 'foo', sort: 0 },
    })
  })

  it("creates empty starredSubjects list and completedSubjects list for a site not found in a user's preference", () => {
    const user = {
      access: ['CA', 'LA', 'MA', 'YA'],
      preferences: {
        complete: {
          CA: ['CA1', 'CA2', 'CA3'],
          LA: ['LA4', 'LA5', 'LA6'],
        },
        star: {
          CA: ['CA4', 'CA6', 'CA7'],
          LA: ['LA1', 'LA2', 'LA3'],
        },
        sort: 0,
        config: 'foo',
      },
    }

    expect(calculatePreferences(user)).toEqual({
      siteSubjects: [
        {
          site: 'CA',
          starredSubjects: ['CA4', 'CA6', 'CA7'],
          completedSubjects: ['CA1', 'CA2', 'CA3'],
        },
        {
          site: 'LA',
          starredSubjects: ['LA1', 'LA2', 'LA3'],
          completedSubjects: ['LA4', 'LA5', 'LA6'],
        },
        { site: 'MA', starredSubjects: [], completedSubjects: [] },
        { site: 'YA', starredSubjects: [], completedSubjects: [] },
      ],
      preferences: { config: 'foo', sort: 0 },
    })
  })
})
