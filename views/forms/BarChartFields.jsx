import React from 'react'
import Delete from '@material-ui/icons/Delete'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ColorPicker from '../components/ColorPicker'
import Checkbox from '@material-ui/core/Checkbox'
import InputLabel from '@material-ui/core/InputLabel'
import Tooltip from '@material-ui/core/Tooltip'

import { colors, presetColors } from '../../constants'

import { targetValuesFields } from '../fe-utils/targetValuesUtil'

const BarChartFields = ({ classes, formValues, setFormValues, studies }) => {
  const updateFormValues = (e) =>
    setFormValues({
      ...formValues,
      [e.target.name]:
        e.target.type !== 'checkbox' ? e.target.value : e.target.checked,
    })
  const addValueAndLabelField = () =>
    setFormValues((prevState) => ({
      ...prevState,
      fieldLabelValueMap: [
        ...prevState.fieldLabelValueMap,
        {
          value: '',
          label: '',
          color: colors.dark_sky_blue,
          targetValues: targetValuesFields(studies),
        },
      ],
    }))
  const removeValueAndLabelField = (id) =>
    setFormValues((prevState) => ({
      ...prevState,
      fieldLabelValueMap: prevState.fieldLabelValueMap.filter(
        (_, index) => index !== id
      ),
    }))
  const handleValueAndLabelFieldUpdate = (e, id) =>
    setFormValues((prevState) => ({
      ...prevState,
      fieldLabelValueMap: prevState.fieldLabelValueMap.map((field, idx) =>
        id === idx ? { ...field, [e.target.name]: e.target.value } : field
      ),
    }))
  const handleTargetValues = (e, id) => {
    setFormValues((prevState) => ({
      ...prevState,
      fieldLabelValueMap: prevState.fieldLabelValueMap.map((field, idx) => {
        if (id === idx) {
          field.targetValues[e.target.name] = e.target.value
          return field
        } else {
          return field
        }
      }),
    }))
  }
  const handleColorChange = (color, id) =>
    setFormValues((prevState) => ({
      ...prevState,
      fieldLabelValueMap: prevState.fieldLabelValueMap.map((field, idx) =>
        id === idx ? { ...field, color } : field
      ),
    }))

  return (
    <>
      <TextField
        className={classes.textInput}
        label="Title"
        name="title"
        onChange={updateFormValues}
        value={formValues.title}
        required
        fullWidth
      />
      <TextField
        label="Description"
        name="description"
        multiline
        rowsMax="4"
        value={formValues.description}
        onChange={updateFormValues}
        className={classes.textInput}
        fullWidth
        required
      />
      <TextField
        className={classes.textInput}
        label="Assessment"
        name="assessment"
        onChange={updateFormValues}
        value={formValues.assessment}
        required
        fullWidth
      />
      <TextField
        label="Variable Name"
        name="variable"
        className={classes.textInput}
        onChange={updateFormValues}
        value={formValues.variable}
        required
        fullWidth
      />
      <div className={classes.formLabelRow}>
        <InputLabel htmlFor="public_checkbox" className={classes.publicText}>
          Public
        </InputLabel>
        <Checkbox
          checked={formValues.public}
          onChange={updateFormValues}
          name="public"
          color="default"
          id="public_checkbox"
          aria-label
        />
      </div>
      {formValues.fieldLabelValueMap.map((field, idx) => (
        <React.Fragment key={idx}>
          <div className={classes.formLabelRow}>
            <Tooltip
              disableFocusListener
              title="Leave blank to count empty values"
            >
              <TextField
                label="Value"
                name="value"
                onChange={(e) => handleValueAndLabelFieldUpdate(e, idx)}
                className={`
                ${classes.formLabelCol} 
                ${classes.variableListInput}
              `}
                value={field.value}
              />
            </Tooltip>
            <TextField
              label="Label"
              name="label"
              className={classes.variableListInput}
              onChange={(e) => handleValueAndLabelFieldUpdate(e, idx)}
              value={field.label}
              required
            />
            <ColorPicker
              classes={classes}
              handleColorChange={handleColorChange}
              idx={idx}
              color={field.color}
              presetColors={presetColors}
            />
            <Button
              type="button"
              variant="text"
              onClick={() => removeValueAndLabelField(idx)}
              className={classes.deleteContainer}
            >
              <Delete className={classes.icon} />
            </Button>
          </div>
          <div className={classes.formLabelRow}>
            <Typography variant="h6" color="textSecondary">
              Targets
            </Typography>
          </div>
          {Object.keys(field.targetValues).map((study) => (
            <div key={idx + study} className={classes.formLabelRow}>
              <Typography
                variant="subtitle1"
                gutterBottom={false}
                color="textSecondary"
                className={classes.targetValueContainer}
              >
                {study}:
              </Typography>
              <TextField
                name={study}
                value={field.targetValues[study]}
                onChange={(e) => handleTargetValues(e, idx)}
              />
            </div>
          ))}
          <div className={classes.formLabelRow}>
            <br />
          </div>
        </React.Fragment>
      ))}
      <div className={classes.addLabelContainer}>
        <Button
          variant="text"
          type="button"
          className={classes.textButton}
          onClick={addValueAndLabelField}
        >
          + Add label and value group combination
        </Button>
      </div>
    </>
  )
}

export default BarChartFields
