import { Controller } from 'react-hook-form'
import { Checkbox } from '@mui/material'

const ControlledCheckbox = ({ name, control, onChange, checked }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Checkbox
          onChange={(e) => {
            field.onChange(e)
            if (onChange) onChange()
          }}
          defaultChecked={checked}
        />
      )}
    />
  )
}

export default ControlledCheckbox
