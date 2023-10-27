import React from 'react'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Input from '@mui/material/Input'

const menuProps = {
  PaperProps: {
    style: {
      marginTop: '50px',
    },
  },
}

const ShareChart = ({
  chart,
  usernames,
  handleChange,
  handleClose,
  classes,
}) => {
  const [sharedWith, setSharedWith] = React.useState(chart.sharedWith || [])

  return (
    <Dialog open onClose={handleClose} fullScreen={true}>
      <DialogTitle
        id="alert-dialog-title"
        disableTypography={true}
        className={classes.dialogTitle}
      >
        <Typography variant="title" className={classes.dialogTypography}>
          Share your chart
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Select
          multiple
          value={sharedWith}
          onChange={(event) => setSharedWith(event.target.value)}
          input={<Input id="select-multiple" />}
          MenuProps={menuProps}
          fullWidth
          renderValue={(selected) => (
            <>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={() => {
                    const updatedSharedWith = sharedWith.filter(
                      (username) => username !== value
                    )
                    setSharedWith(updatedSharedWith)

                    if (
                      chart.sharedWith.find((username) => username === value)
                    ) {
                      return handleChange(chart._id, updatedSharedWith, {
                        closeDialog: false,
                      })
                    }
                  }}
                  onMouseDown={(event) => {
                    event.stopPropagation()
                  }}
                />
              ))}
            </>
          )}
        >
          {usernames.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} className={classes.dialogCancelButton}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          className={classes.dialogShareButton}
          onClick={() =>
            handleChange(chart._id, sharedWith, { closeDialog: true })
          }
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShareChart
