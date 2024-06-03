import React from 'react'
import { Typography } from '@mui/material'

import ConfigAssessmentFormFields from '../ConfigAssessmentFormFields'
import ConfigTypeFormFields from '../ConfigTypeFormFields'

import './ConfigFields.css'
import ConfigurationSection from '../ConfigurationSection'
import { fontSize } from '../../../constants'

const ConfigFormFields = ({
  control,
  fields,
  friendsList,
  onCopy,
  onRemove,
  assessmentOptions,
  handleAssessmentSearch,
  handleClearAssessments,
  handleClearUsers,
  handleSelectAllUsers,
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
        <ConfigurationSection control={control} />
      </div>
    </>
  )
}

export default ConfigFormFields
