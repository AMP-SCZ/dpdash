import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import * as yup from 'yup'

import TextInput from '../TextInput'

const schema = yup.object({
  searchCharts: yup.string(),
})

const ChartsSearchForm = ({ initialValues, onSubmit }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: initialValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        name="searchCharts"
        control={control}
        placeholder={`Search charts you'd like to view`}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        fullWidth
        onChange={(value) => onSubmit({ searchedCharts: value })}
      />
    </form>
  )
}

export default ChartsSearchForm
