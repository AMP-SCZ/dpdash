import React, { useState, useEffect } from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

const ConfigDropDown = ({
  configurations,
  updatePreferences,
  currentConfig,
}) => {
  const [selectValue, setSelectValue] = useState('')
  const handleConfigChange = (e) => {
    setSelectValue(e.target.value.name)
    updatePreferences(e.target.value)
  }

  useEffect(() => {
    const configNameValue =
      (!!configurations.length &&
        configurations?.filter(
          (configuration) => configuration._id === currentConfig.config
        )[0].name) ||
      ''
    setSelectValue(configNameValue)
  }, [configurations])

  return (
    <form autoComplete='off'>
      <FormControl style={{ width: '100%' }}>
        <InputLabel
          htmlFor='config'
          style={{ marginTop: '25px', marginLeft: '30px' }}
        >
          {selectValue}
        </InputLabel>
        <Select
          value={selectValue}
          onChange={handleConfigChange}
          inputProps={{
            name: 'config',
            id: 'config',
          }}
        >
          {!!configurations.length &&
            configurations?.map((configuration) => (
              <MenuItem key={configuration._id} value={configuration}>
                {configuration.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </form>
  )
}

export default ConfigDropDown
