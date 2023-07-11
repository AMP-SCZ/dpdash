import UserConfigModel from '.'

describe('Models - User Confg', () => {
  const colors = [
    {
      value: 221,
      label: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
    },
  ]

  describe(UserConfigModel.processNewConfig, () => {
    const formValues = UserConfigModel.defaultFormValues({
      readers: [
        { label: 'fang', value: 'fang' },
        { label: 'talon', value: 'talon' },
        { label: 'mabel', value: 'mabel' },
      ],
      config: [
        UserConfigModel.defaultConfigValues,
        UserConfigModel.defaultConfigValues,
      ],
    })

    it('returns config form values as user config object', async () => {
      const newUserConfig = await UserConfigModel.processNewConfig(
        formValues,
        colors,
        'owl'
      )

      expect(newUserConfig).toEqual({
        config: {
          0: [
            {
              analysis: '',
              category: '',
              color: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
              label: '',
              range: ['0', '1'],
              variable: '',
            },
            {
              analysis: '',
              category: '',
              color: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
              label: '',
              range: ['0', '1'],
              variable: '',
            },
          ],
        },
        name: 'default',
        owner: 'owl',
        readers: ['fang', 'talon', 'mabel'],
        type: 'matrix',
      })
    })
  })

  describe(UserConfigModel.processConfigToFormFields, () => {
    it('returns a current configuration into form values', async () => {
      const currentConfiguration = {
        config: {
          0: [
            {
              analysis: '',
              category: '',
              color: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
              label: '',
              range: ['0', '1'],
              variable: '',
            },
            {
              analysis: '',
              category: '',
              color: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
              label: '',
              range: ['0', '1'],
              variable: '',
            },
          ],
        },
        name: 'default',
        owner: 'owl',
        readers: ['fang', 'talon', 'owl'],
        type: 'matrix',
      }
      const formFields = await UserConfigModel.processConfigToFormFields(
        currentConfiguration,
        colors
      )

      expect(formFields).toEqual(
        UserConfigModel.defaultFormValues({
          owner: 'owl',
          readers: [
            { label: 'fang', value: 'fang', isFixed: false },
            { label: 'talon', value: 'talon', isFixed: false },
            { label: 'owl', value: 'owl', isFixed: true },
          ],
          config: [
            UserConfigModel.defaultConfigValues,
            UserConfigModel.defaultConfigValues,
          ],
        })
      )
    })
  })
})
