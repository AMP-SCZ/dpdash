import React from 'react'

import { Typography } from '@mui/material'

import ConfigTypeFormFields from '../ConfigTypeFormFields'
import ConfigurationSection from '../ConfigurationSection'
import './ConfigFields.css'

const ConfigFormFields = ({
  control,
  colors,
  friendsList,
  handleClearUsers,
  handleSelectAllUsers,
  initialValues,
}) => {
  return (
    <>
      <ConfigTypeFormFields
        control={control}
        friendsList={friendsList}
        handleClearUsers={handleClearUsers}
        handleSelectAllUsers={handleSelectAllUsers}
      />
      <div className="ConfigSectionFields">
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, gridColumnStart: 1, gridColumnEnd: 1 }}
        >
          Configure rows
        </Typography>
        {Object.keys(initialValues).map((key, section) => {
          const colorValue = colors.findIndex(
            ({ label }) => key === label.join('-')
          )
          return (
            <ConfigurationSection
              key={key}
              control={control}
              colors={colors}
              sectionKey={key}
              colorValue={colorValue}
              section={section}
            />
          )
        })}
      </div>
    </>
  )
}

export default ConfigFormFields
