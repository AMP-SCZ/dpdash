import React from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  MenuItem,
  TextField,
} from '@mui/material'
import { ExpandMore, Add } from '@mui/icons-material'

import ControlledSelectInput from '../ControlledSelect'

const ConfigurationSection = (props) => {
  const { control } = props
  return (
    <Accordion
      sx={{
        gridColumnStart: 1,
        gridColumnEnd: 1,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel221-content"
        id="panel221-header"
        sx={{ pl: '15px' }}
      >
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridGap: '20px',
            gridTemplateColumns: 'repeat(12, 1fr)',
          }}
        >
          <TextField
            sx={{ gridColumnStart: 1, gridColumnEnd: 3, height: '50%' }}
            label="Quantity"
            InputLabelProps={{ shrink: true }}
            inputProps={{ type: 'number', min: 0 }}
            required
          />
          <ControlledSelectInput
            control={control}
            name={`config.${props.sectionKey}.${props.section}.color`}
            value={props.colorValue}
            label="Theme"
            InputLabelProps={{ shrink: true }}
            required
            margin="dense"
            sx={{ gridColumnStart: 3, gridColumnEnd: 6, height: '50%' }}
          >
            {props.colors.map(({ value, label }, colorsIndex) => (
              <MenuItem value={value} key={`${label}-${value}`}>
                <div className="ColorPaletteDropdown">
                  {label.map((palette) => (
                    <span
                      key={palette}
                      style={{ backgroundColor: palette }}
                      className="ColorPaletteBlock"
                    />
                  ))}
                </div>
              </MenuItem>
            ))}
          </ControlledSelectInput>
          <Button
            sx={{
              gridColumnStart: 6,
              gridColumnEnd: 6,
              textTransform: 'none',
              height: '50%',
            }}
            variant="outlined"
            size="small"
            disableRipple
          >
            <Add />
            Add
          </Button>
        </div>
      </AccordionSummary>
    </Accordion>
  )
}

export default ConfigurationSection
