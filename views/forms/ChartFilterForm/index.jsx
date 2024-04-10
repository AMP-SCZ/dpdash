import React, { useState } from 'react'

import { Button, FormControl, InputLabel } from '@mui/material'
import { useForm } from 'react-hook-form'

import { SITES_BY_NETWORK } from '../../../constants'
import { FILTER_CATEGORIES } from '../../../constants/vars'
import DropdownCheckboxGroup from '../DropdownCheckboxGroup'
import './ChartFilterForm.css'

const NETWORKS_FILTER_KEY = 'networks'
const SITES_FILTER_KEY = 'sites'

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
    if (label === NETWORKS_FILTER_KEY) {
      const allowedSiteOptions = { ...initialValues.sites }
      const allowedSites = value.flatMap((network) => SITES_BY_NETWORK[network])
      const selectableSites = Object.keys(initialValues.sites)
      for (const site of selectableSites) {
        if (allowedSites.length && !allowedSites.includes(site)) {
          delete allowedSiteOptions[site]
        }
      }
      setValue(SITES_FILTER_KEY, allowedSiteOptions)
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
              }}
            >
              <InputLabel id={`multi-chip-label-${filterKey}`}>
                {FILTER_CATEGORIES[filterKey]}
              </InputLabel>
              {filterKey === SITES_FILTER_KEY ? (
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
