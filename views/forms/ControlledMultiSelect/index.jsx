import React from 'react'
import { Controller } from 'react-hook-form'
import { Autocomplete, TextField } from '@mui/material'

const ControlledMultiSelect = (props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field }) => (
        <Autocomplete
          id={props.name}
          fullWidth={props.fullWidth}
          isOptionEqualToValue={(option, value) => {
            return option.value === value.value
          }}
          multiple
          onChange={(_, data) => field.onChange(data)}
          options={props.options}
          renderInput={(params) => (
            <TextField
              {...params}
              label={props.label}
              placeholder={props.placeholder}
            />
          )}
          value={field.value}
        />
      )}
    />
  )
}

export default ControlledMultiSelect
