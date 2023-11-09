import React from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material'

import ControlledReactSelect from '../ControlledReactSelect'

const ShareForm = ({ control, onClose, onSubmit, open, options, title }) => {
  return (
    <Dialog open={open} onClose={onClose} fullScreen={true}>
      <DialogTitle id="alert-dialog-title" disableTypography={true}>
        <Typography variant="title">{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <ControlledReactSelect
            isMulti={true}
            control={control}
            name="readers"
            options={options}
            placeholder="Shared with"
          />
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>,
            <Button variant="outlined" type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ShareForm
