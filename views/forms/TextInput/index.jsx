import React from 'react'
import TextField from '@mui/material/TextField'
import { Controller, useFormContext } from 'react-hook-form'

const TextInput = (props) => {
  const { name, onChange, ...rest } = props
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          aria-label={name}
          fullWidth={true}
          margin="dense"
          {...field}
          {...rest}
          inputRef={field.ref}
          onChange={(e) => {
            field.onChange(e)

            if (onChange) onChange(e)
          }}
        />
      )}
    />
  )
}

export default TextInput
