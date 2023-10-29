import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Add from '@mui/icons-material/Add'

const UploadFile = ({ handleChangeFile }) => {
  return (
    <div>
      <input
        accept=".json"
        name="file"
        id="raised-button-file"
        multiple
        type="file"
        style={{ display: 'none' }}
        onChange={handleChangeFile}
      />
      <label htmlFor="raised-button-file">
        <Button
          component="span"
          variant="fab"
          focusRipple
          style={{ marginBottom: '8px' }}
        >
          <Tooltip title="Upload Details">
            <Add />
          </Tooltip>
        </Button>
      </label>
    </div>
  )
}

export default UploadFile
