import React from 'react'
import Delete from '@material-ui/icons/Delete'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ColorPicker from '../components/ColorPicker'

import { dark_sky_blue } from '../constants/styles'

const BarChartFields = ({ 
  classes,
  formValues,
  setFormValues,
  user
}) => {
  const { title } = formValues

  const updateFormValues = (e,) => setFormValues({ ...formValues, [e.target.name]: e.target.value })
  const addValueAndLabelField = () => setFormValues(prevState => ({
    ...prevState,
    fieldLabelValueMap: [...prevState
      .fieldLabelValueMap,
        {  
          value: '', 
          label: '', 
          color: dark_sky_blue, 
          targetValues: user.userAccess.map((site) => ({ site, value: '' }))
        }
      ]
    }))
  const removeValueAndLabelField = (id) => setFormValues((prevState) => ({ 
    ...prevState,
    fieldLabelValueMap: prevState.fieldLabelValueMap.filter((_, index) => index !== id)
  }))
  const handleValueAndLabelFieldUpdate = (e, id) => setFormValues((prevState) => ({
    ...prevState, 
    fieldLabelValueMap: prevState
      .fieldLabelValueMap
        .map((field, idx) => 
          id === idx
          ? { ...field, [e.target.name]: e.target.value }
          : field
        )
      }))
  const handleTargetValues = (e, id, tid) => {
    setFormValues((prevState) => ({
      ...prevState,
      fieldLabelValueMap: prevState
      .fieldLabelValueMap
        .map((field, idx) => 
          id === idx ? 
            { 
              ...field, 
              targetValues: field.targetValues
                .map((target, tidx) => 
                  tid === tidx 
                  ? { ...target, value: e.target.value } 
                  : target
                ) 
            }
          : field
        )
    }))
  }

  return(
    <>
      <Typography variant='subtitle1' gutterBottom>
        {title} 
      </Typography>
      <TextField
        className={classes.textInput}
        label='Title'
        name='title'
        onChange={updateFormValues}
        value={formValues.title}
        required
        fullWidth
      />
      <TextField
        label='Description'
        name='description'
        multiline
        rowsMax='4'
        value={formValues.description}
        onChange={updateFormValues}
        className={classes.textInput}
        fullWidth
        required
      />
      <TextField
        className={classes.textInput}
        label='Assessment'
        name='assessment'
        onChange={updateFormValues}
        value={formValues.assessment}
        required
        fullWidth
      />
      <TextField
        label='Variable Name'
        name='variable'
        className={classes.textInput}
        onChange={updateFormValues}
        value={formValues.variable}
        required
        fullWidth
      />
      {
        formValues.fieldLabelValueMap.length && 
        formValues.fieldLabelValueMap.map((field, idx) => (
          <>
          <div key={'field-map'+idx} className={classes.formLabelRow}>
            <TextField
              label='Value'
              name='value'
              onChange={(e) => handleValueAndLabelFieldUpdate(e, idx)}
              className={`
                ${classes.formLabelCol} 
                ${classes.variableListInput}
              `}
              value={field.value}
              required
            />
            <TextField
              label='Label'
              name='label'
              className={classes.variableListInput}
              onChange={(e) => handleValueAndLabelFieldUpdate(e, idx)}
              value={field.label}
              required
            />
            <ColorPicker 
             classes={classes} 
             onColorChange={handleValueAndLabelFieldUpdate} 
             idx={idx}
             color={field.color}
            />
            <Button
              type='button'
              variant='text'
              onClick={() => removeValueAndLabelField(idx)}
              className={classes.deleteContainer}
            >
              <Delete className={classes.icon} />
            </Button>
          </div>
          {field.targetValues.length && field.targetValues.map((target, tidx) => (
            <div key={idx+target.site+tidx} className={classes.formLabelRow}>
              <Typography 
                variant='subtitle1' 
                gutterBottom={false} 
                color='textSecondary' 
                className={classes.targetValueContainer}
              >
                {target.site}:
              </Typography>
              <TextField 
                name={target.site}
                value={target.value}
                onChange={(e) => handleTargetValues(e, idx, tidx)}
              />
            </div>
          ))}
          </>
        ))
      }
      <div className={classes.addLabelContainer}>
        <Button
          variant='text'
          type='button'
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
