import React from 'react'
import { Fab } from '@mui/material'
import ContentAdd from '@mui/icons-material/Add'
import Save from '@mui/icons-material/Save'
import ConfigFormFields from '../ConfigFields'
import Form from '../Form'

const ConfigForm = ({ onSubmit, onAddNewField, ...rest }) => {
  return (
    <Form onSubmit={onSubmit}>
      <ConfigFormFields {...rest} />
      <div>
        <Fab onClick={() => onAddNewField()}>
          <ContentAdd />
        </Fab>
        <Fab type="submit">
          <Save />
        </Fab>
      </div>
    </Form>
  )
}

export default ConfigForm
