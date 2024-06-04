import React from 'react'

import { Button } from '@mui/material'

import './ConfigFormActions.css'

const ConfigurationFormActions = (props) => {
  return (
    <div className="ConfigFormActions">
      <Button
        disableElevation
        onClick={props.onSubmitDraft}
        sx={{
          backgroundColor: 'grey.A400',
          gridColumnStart: 1,
          gridColumnEnd: 1,
          '&:active': {
            backgroundColor: 'grey.A400',
          },
          '&:hover': {
            backgroundColor: 'grey.A200',
          },
          borderRadius: '8px',
        }}
        variant="contained"
        size="small"
      >
        Save as draft
      </Button>
      <Button
        type="submit"
        size="small"
        disableElevation
        sx={{
          backgroundColor: 'primary.light',
          '&:active': {
            backgroundColor: 'primary.light',
          },
          gridColumnStart: 2,
          gridColumnEnd: 2,
          borderRadius: '8px',
        }}
        variant="contained"
      >
        Publish
      </Button>
    </div>
  )
}

export default ConfigurationFormActions
