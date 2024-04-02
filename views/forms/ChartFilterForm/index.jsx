import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, FormControl, InputLabel } from '@mui/material'
import { useForm } from 'react-hook-form'

import { FILTER_CATEGORIES } from '../../../constants/vars'
import DropdownCheckboxGroup from '../DropdownCheckboxGroup'

import './ChartFilterForm.css'
import { SITES_BY_NETWORK } from '../../../constants'

const ChartFilterForm = ({ initialValues, onSubmit }) => {
  const { handleSubmit, setValue, getValues } = useForm({
    defaultValues: initialValues,
  })
  const formValues = getValues()
  const [resetSiteOptions, setResetSiteOptions] = useState(false)

  const handleChange = (label, value) => {
    const newFilterValues = Object.keys(initialValues[label]).reduce(
      (acc, key) => {
        acc[key] = value.includes(key)
          ? { label: key, value: 1 }
          : { label: key, value: 0 }
        return acc
      },
      {}
    )
    if (label === 'networks') {
      const allowedSiteOptions = { ...initialValues.sites }
      const allowedSites = value.flatMap((network) => SITES_BY_NETWORK[network])
      const selectableSites = Object.keys(initialValues.sites)
      for (let site of selectableSites) {
        if (allowedSites.length && !allowedSites.includes(site)) {
          delete allowedSiteOptions[site]
        }
      }
      setValue('sites', allowedSiteOptions)
      setResetSiteOptions(true)
    }
    setValue(label, newFilterValues)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="filter_form">
      <div className="ChartFilterForm">
        {Object.keys(initialValues).map((filterKey, i) => {
          return (
            <FormControl
              key={filterKey}
              sx={{
                gridColumnStart: i,
                gridColumnEnd: i + 1,
                width: '275px',
              }}
            >
              <InputLabel id={`multi-chip-label-${filterKey}`}>
                {FILTER_CATEGORIES[filterKey]}
              </InputLabel>
              {filterKey === 'sites' ? (
                <DropdownCheckboxGroup
                  label={filterKey}
                  initialValues={formValues[filterKey]}
                  resetOptions={resetSiteOptions}
                  onReset={() => setResetSiteOptions(false)}
                  onChange={handleChange}
                />
              ) : (
                <DropdownCheckboxGroup
                  label={filterKey}
                  initialValues={formValues[filterKey]}
                  onChange={handleChange}
                />
              )}
            </FormControl>
          )
        })}
      </div>
      <Button type="submit">Set Filters</Button>
    </form>
  )
}

export default ChartFilterForm
