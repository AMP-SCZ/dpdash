import React from 'react'
import { Fab } from '@mui/material'
import { ContentAdd, Save } from '@mui/icons-material'

import ConfigFormFields from '../ConfigFields'

const ConfigForm = ({ onSubmit, onAddNewField, ...rest }) => {
  return (
    <form onSubmit={onSubmit}>
      <ConfigFormFields {...rest} />
      <div>
        <Fab onClick={() => onAddNewField()}>
          <ContentAdd />
        </Fab>
        <Fab type="submit">
          <Save />
        </Fab>
      </div>
    </form>
  )
}

export default ConfigForm
