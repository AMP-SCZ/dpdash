import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import * as yup from 'yup'

import ControlledMultiSelect from '../ControlledMultiSelect'

const TableSearchForm = ({ initialValues, name, onSubmit, allOptions }) => {
  const { handleSubmit, control, formState, watch } = useForm({
    defaultValues: initialValues,
    mode: 'onChange',
    resolver: yupResolver(
      yup.object({
        [name]: yup.array(),
      })
    ),
  })
  const data = watch()

  useEffect(() => {
    if (formState.isValid && !formState.isValidating) {
      onSubmit(data)
    }
  }, [data, formState])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ControlledMultiSelect
        name={name}
        control={control}
        options={allOptions}
        placeholder={`Search ${name} you'd like to view`}
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

export default TableSearchForm
