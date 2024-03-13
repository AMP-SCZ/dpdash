import React, { useState } from 'react'
import { FormControl, OutlinedInput, InputLabel, Select, MenuItem, Box, Chip } from '@mui/material'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const DropdownCheckboxGroup = ({
  label,
  initialValues,
  onChange
}) => {
  const options = Object.keys(initialValues)
  const selectedValues = Object.keys(initialValues).filter(k => initialValues[k].value === 1)
  const [selectedValue, setSelectedValue] = useState(selectedValues)

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedValue(value)
    onChange(label, value)
  }
  return (
    <>      
      <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id={`multi-chip-label-${label}`}>{label}</InputLabel>
      <Select
        labelId={`multi-chip-label-${label}`}
        id={`multi-chip-${label}`}
        multiple
        value={selectedValue}
        onChange={handleChange}
        input={<OutlinedInput id={`select-multiple-${label}`} label={label} />}
        renderValue={(selected) => {
          const EtcChip = selected.length > 5 ? <Chip key={"etc"} label="..." /> : <></>
          return <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 0.5 }}>
            {selected.slice(0, 5).map((value) => {
              return <Chip key={value} label={value} />
            }).concat([EtcChip])}
          </Box>
        }}
        MenuProps={MenuProps}
      >
        {options.map((value) => {
          return <MenuItem
            key={value}
            value={value}
          >
            {value}
          </MenuItem>
        })}
      </Select>
    </FormControl>
  </>
    // <>
    //   <TextField
    //     label={filterKey}
    //     id={`${filterKey}`}
    //     placeholder="Select"
    //     InputLabelProps={{
    //       shrink: true,
    //       sx: {
    //         color: 'grey.A100',
    //         '&.Mui-focused': { color: 'grey.A100' },
    //         '&:hover': { cursor: 'none' },
    //       },
    //     }}
    //     onClick={handleClick}
    //     onFocus={(e) => e.currentTarget.blur()}
    //     sx={{
    //       borderColor: 'grey.A100',
    //     }}
    //     InputProps={{
    //       sx: {
    //         '&.Mui-focused': { borderColor: 'grey.A100' },
    //       },
    //       endAdornment: (
    //         <InputAdornment position="start">
    //           <KeyboardArrowDown />
    //         </InputAdornment>
    //       ),
    //     }}
    //   />

    //   <Menu
    //     id={`${filterKey}`}
    //     anchorEl={anchorEl}
    //     open={open}
    //     onClose={handleClose}
    //     disableAutoFocus
    //     disableAutoFocusItem
    //   >
    //     {options.map((filter) => {
    //       const currentValue = +formValues?.[filter.label].value

    //       return (
    //         <ListItem>
    //           <ControlledCheckbox
    //             control={control}
    //             name={`${filterKey}.${filter.label}.value`}
    //             label={filter.label}
    //             checked={currentValue === 1}
    //           />
    //         </ListItem>
    //       )
    //     })}
    //   </Menu>
    // </>
  )
}

export default DropdownCheckboxGroup
