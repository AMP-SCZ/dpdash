export const legend = (fieldValues) =>
  fieldValues.map(({ fieldLabelValueMap: { label, color } }) => ({
    name: label,
    symbol: {
      type: 'square',
      fill: color,
    },
  }))

export const chartVariableColors = (fieldValues) =>
  fieldValues.map(({ fieldLabelValueMap: { color } }) => color)
