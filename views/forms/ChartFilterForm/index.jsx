import React from 'react'
import { useForm } from 'react-hook-form'
import { Button, List, ListItem, Typography, InputLabel } from '@mui/material'

import { FILTER_CATEGORIES, TRUE_STRING } from '../../../constants'
import ControlledCheckbox from '../ControlledCheckbox'
import ControlledMultiSelect from '../ControlledMultiSelect'

const ChartFilterForm = ({ initialValues, onSubmit, siteOptions }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: initialValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        {Object.keys(initialValues)
          .filter((key) => key !== 'sites')
          .map((filterKey) => {
            return (
              <div key={filterKey}>
                <Typography variant="subtitle2">
                  {FILTER_CATEGORIES[filterKey]}
                </Typography>
                <div>
                  {initialValues[filterKey].map((filter, index) => {
                    const filterID = `${filterKey}-${filter.name}`

                    return (
                      <List key={filterID} component="div" disablePadding>
                        <ListItem>
                          <InputLabel htmlFor={filterID}>
                            {filter.name}
                          </InputLabel>
                          <ControlledCheckbox
                            checked={filter.value === TRUE_STRING}
                            control={control}
                            name={`${filterKey}.${index}.value`}
                            id={filterID}
                          />
                        </ListItem>
                      </List>
                    )
                  })}
                </div>
              </div>
            )
          })}
      </div>
      <div>
        <InputLabel id="sites-select" variant="subtitle2">
          Sites
        </InputLabel>
        <ControlledMultiSelect
          labelId="sites-select"
          name="sites"
          control={control}
          options={siteOptions}
          placeholder="Select a site to view data"
          fullWidth
        />
      </div>
      <div>
        <Button type="submit" color="primary" variant="contained">
          Apply Filters
        </Button>
      </div>
    </form>
  )
}

export default ChartFilterForm
