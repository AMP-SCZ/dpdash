import React from 'react'
import { Controller } from 'react-hook-form'
import Select from '@mui/material/Select'
import { Box, Chip, MenuItem } from '@mui/material'

const ControlledMultiSelect = ({ name, control, options, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...rest}
          {...field}
          multiple
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      )}
    />
  )
}

export default ControlledMultiSelect
