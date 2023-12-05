import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import SearchIcon from '@mui/icons-material/Search'

import ControlledMultiSelect from '../ControlledMultiSelect'
import { InputAdornment } from '@mui/material'

const schema = yup.object({
  users: yup.array()
})

export const AdminUsersSearchForm = ({ onSubmit, allOptions}) => {
  const { handleSubmit, control, formState, watch } = useForm({
    defaultValues: {
      users: []
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const data = watch()

  useEffect(() => {
    if (formState.isValid && !formState.isValidating) {
      onSubmit(data.users)
    }
  }, [data, formState])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ControlledMultiSelect
        name="users"
        control={control}
        options={allOptions}
        placeholder="Search for users"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        fullWidth
      />
    </form>
  )
}