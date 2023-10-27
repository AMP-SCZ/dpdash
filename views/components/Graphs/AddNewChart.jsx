import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import Add from '@mui/icons-material/Add'

const AddNewChart = ({ onNewChart }) => {
  return (
    <div
      style={{
        right: 4,
        bottom: 4,
        position: 'fixed',
      }}
    >
      <Fab
        component="span"
        focusRipple
        onClick={() => onNewChart()}
        style={{ marginBottom: '8px' }}
      >
        <Tooltip title="Create A New Chart">
          <Add />
        </Tooltip>
      </Fab>
    </div>
  )
}

export default AddNewChart
