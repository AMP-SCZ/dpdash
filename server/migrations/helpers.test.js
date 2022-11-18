import { calculatePreferences } from './helpers'

describe(calculatePreferences, () => {
  it('converts legacy dpdash preference object into new data structure', () => {
    const user = {
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
      config: 'foo',
      sort: 0,
      star: [
        { site: 'CA', starredSubjects: [] },
        { site: 'LA', starredSubjects: [] },
      ],
      complete: [{ site: 'CA', completedSubjects: [] }],
    })
  })

  it('retains user preferences if it is using the new data structure', () => {
    const user = {
      preferences: {
        config: '636d1b784723201176bf0bda',
        sort: 0,
        star: [
          {
            site: 'LA',
            starredSubjects: [],
          },
        ],
        complete: [
          {
            site: 'YA',
            completedSubjects: ['YA01508'],
          },
          {
            site: 'ProNET',
            completedSubjects: ['P6'],
          },
        ],
      },
    }
    expect(calculatePreferences(user)).toEqual({
      config: '636d1b784723201176bf0bda',
      sort: 0,
      star: [
        {
          site: 'LA',
          starredSubjects: [],
        },
      ],
      complete: [
        {
          site: 'YA',
          completedSubjects: ['YA01508'],
        },
        {
          site: 'ProNET',
          completedSubjects: ['P6'],
        },
      ],
    })
  })
})
