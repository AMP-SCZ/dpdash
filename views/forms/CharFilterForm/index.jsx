import React from 'react'
import { Button, List, ListItem, Typography, InputLabel } from '@mui/material'

import { FILTER_CATEGORIES, TRUE_STRING } from '../../../constants'
import ControlledCheckbox from '../ControlledCheckbox'
import ControlledReactSelect from '../ControlledReactSelect'

const ChartFilterForm = ({
  initialValues,
  onSubmit,

  control,
  siteOptions,
}) => {
  return (
    <form onSubmit={onSubmit}>
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
        <Typography variant="subtitle2">Sites</Typography>
        <ControlledReactSelect
          name="sites"
          control={control}
          options={siteOptions}
          placeholder="Select a site to view data"
          isMulti
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
