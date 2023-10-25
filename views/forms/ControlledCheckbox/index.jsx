import { Controller } from 'react-hook-form'
import { Checkbox } from '@material-ui/core'

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
          defaultChecked={typeof checked === 'boolean' ? checked : false}
        />
      )}
    />
  )
}

export default ControlledCheckbox
