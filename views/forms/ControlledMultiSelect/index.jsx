import React from 'react'
import { Controller } from 'react-hook-form'
import { Autocomplete, InputAdornment, TextField } from '@mui/material'

const ControlledMultiSelect = (props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field, fieldState }) => (
        <Autocomplete
          id={props.name}
          fullWidth={props.fullWidth}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          multiple
          onChange={(_, data) => field.onChange(data)}
          options={props.options}
          renderInput={(params) => (
            <TextField
              {...params}
              aria-invalid={!!fieldState.error ? 'true' : 'false'}
              label={props.label}
              helperText={fieldState.error?.message}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    {props.startAdornment}
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
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
