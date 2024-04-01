import React from 'react'

import { VisibilityOffOutlined, Visibility } from '@mui/icons-material'
import { MenuItem } from '@mui/material'

import ConfigurationCategoryCard from '../../components/ConfigurationCategoryCard'
import ControlledCheckbox from '../ControlledCheckbox'
import ControlledSelectInput from '../ControlledSelect'
import TextInput from '../TextInput'
import './ConfigAssessmentFormFields.css'

const ConfigAssessmentFormFields = ({
  control,
  colors,
  index,
  id,
  onCopy,
  onRemove,
}) => {
  return (
    <ConfigurationCategoryCard
      formIndex={index}
      onCopy={onCopy}
      onRemove={onRemove}
      rowNum={index + 1}
    >
      <TextInput
        control={control}
        name={`config.${index}.category`}
        label="Category"
        fullWidth
      />
      <TextInput
        control={control}
        name={`config.${index}.analysis`}
        label="Assessment"
        fullWidth
      />
      <TextInput
        control={control}
        name={`config.${index}.variable`}
        label="Variable"
      />
      <TextInput
        control={control}
        name={`config.${index}.label`}
        label="Label"
      />
      <ControlledSelectInput
        control={control}
        name={`config.${index}.color`}
        value={221}
        fullWidth
      >
        {colors.map(({ value, label }, colorsIndex) => (
          <MenuItem value={value} key={`${id}-${colorsIndex}-${index}`}>
            <div className="ColorPaletteDropdown">
              {label.map((palette) => (
                <span
                  key={palette}
                  style={{ backgroundColor: palette }}
                  className="ColorPaletteBlock"
                />
              ))}
            </div>
          </MenuItem>
        ))}
      </ControlledSelectInput>
      <div className="RangeFields">
        <TextInput
          control={control}
          fullWidth={false}
          label="Min"
          name={`config.${index}.min`}
          size="small"
        />
        <TextInput
          control={control}
          fullWidth={false}
          label="Max"
          name={`config.${index}.max`}
          size="small"
        />
      </div>
      <ControlledCheckbox
        control={control}
        name={`config.${index}.text`}
        label="Display value"
        labelPlacement="end"
        icon={<VisibilityOffOutlined />}
        checkedIcon={<Visibility />}
      />
    </ConfigurationCategoryCard>
  )
}

export default ConfigAssessmentFormFields
