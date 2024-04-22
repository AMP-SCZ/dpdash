const defaultColorValue = 221
const UserConfigModel = {
  defaultConfigValues: {
    category: '',
    analysis: '',
    variable: '',
    label: '',
    color: defaultColorValue,
    min: '0',
    max: '1',
    text: true,
  },
  defaultFormValues: (overrides = {}) => ({
    configName: '',
    configType: 'matrix',
    readers: [],
    config: [],
    public: false,
    ...overrides,
  }),
  publishConfig: (formValues, colors, owner) => ({
    ...processConfigAssessment(formValues, colors, owner),
    status: 1,
  }),
  saveAsDraft: (formValues, colors, owner) => ({
    ...processConfigAssessment(formValues, colors, owner),
    status: 0,
  }),
  processConfigToFormFields: (currentConfig, colors) => {
    const {
      config,
      name,
      owner,
      public: publicConfig,
      readers,
      type,
    } = currentConfig
    const configKey = Object.keys(config)[0]
    const configCategoryFields = config[configKey].map(
      ({ category, analysis, variable, label, range, color, text }) => {
        const [min, max] = range
        const loadColor = findCategoryColor(color, colors)

        return {
          analysis,
          category,
          color: loadColor ? loadColor.value : defaultColorValue,
          label,
          min,
          max,
          text,
          variable,
        }
      }
    )
    return {
      configName: name,
      configType: type,
      owner,
      readers: readers.map((reader) => ({
        value: reader,
        label: reader,
        isFixed: reader === owner,
      })),
      config: configCategoryFields,
      public: publicConfig,
    }
  },
  isActive: (configuration, property) =>
    configuration[property] === 1 || !Object.hasOwn(configuration, property),
}

export const findCategoryColor = (categoryColors, colors) =>
  colors.find(({ label }) => categoryColors.every((el, i) => el === label[i]))

const processConfigAssessment = (formValues, colors, owner) => {
  return {
    config: {
      0: formValues.config.map(({ min, max, color, ...rest }) => {
        return {
          color: colors.find(({ value }) => value === color).label,
          range: [min, max],
          ...rest,
        }
      }),
    },
    name: formValues.configName,
    owner,
    type: formValues.configType,
    readers: formValues.readers.map(({ value }) => value),
    public: formValues.public,
  }
}

export default UserConfigModel
