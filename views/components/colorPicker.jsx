import { Paper, Typography } from "@material-ui/core"
import React, { useCallback, useRef } from "react"
import { HexColorPicker } from "react-colorful"

import useClickOutside from "../hooks/useClickOutside"

const ColorPicker = ({ classes, color, onColorChange,   isColorPickerOpen,
  setColorPickerToggle, idx }) => {
  const popover = useRef()

  const close = useCallback(() => setColorPickerToggle(false), [])
  useClickOutside(popover, close)

  return (
    <div className={classes.swatchContainer}>
      {!isColorPickerOpen &&(
        <>    
          <Typography variant='caption' className={classes.colorLabel}>
            Color
          </Typography>
          <Paper
            className={classes.swatch}
            style={{ backgroundColor: color }}
            onClick={() => setColorPickerToggle(true)}
          />
        </>

      )}
      {isColorPickerOpen && (
        <div className="popover" ref={popover}>
          <HexColorPicker color={color} onChange={(newColor) => onColorChange({target: { name: 'color', value: newColor }}, idx)} />
        </div>
      )}
    </div>
  )
}

export default ColorPicker
