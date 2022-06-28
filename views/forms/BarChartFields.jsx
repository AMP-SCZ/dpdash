import React, { useState, useEffect } from 'react'
import Delete from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';

const title = 'title'

const BarChartFields = ({ 
  classes,
  updateFormValues,
  formValues,
  valueAndLabelFields,
  addValueAndLabelField,
  removeField,
  updateFieldValues
}) => {
  const [chartTitle, setTitle] = useState('')
  
  useEffect(() => {
    setTitle(formValues[title])
    console.log(valueAndLabelFields)
  }, [formValues, valueAndLabelFields])

  return(
    <>
      <Typography variant='subtitle1'  gutterBottom>
        {chartTitle} 
      </Typography>
      <TextField
        className={classes.textInput}
        label='Title'
        name='title'
        onChange={updateFormValues}
        required
        fullWidth
      />
      <TextField
        className={classes.textInput}
        label='Assessment'
        name='assessment'
        onChange={updateFormValues}
        required
        fullWidth
      />
      <TextField
        label='Variable Name'
        name='variable'
        className={classes.textInput}
        onChange={updateFormValues}
        required
        fullWidth
      />
      {
        valueAndLabelFields.length > 0 && 
        valueAndLabelFields.map((field, idx) => (
          <div key={idx} className={classes.formLabelRow}>
            <TextField
              label='Value'
              name='value'
              onChange={(e) => updateFieldValues(e, idx)}
              className={`${classes.formLabelCol} ${classes.variableListInput}`}
            />
            <TextField
              label='Label'
              name='label'
              className={`${classes.variableListInput}`}
              onChange={(e) => updateFieldValues(e, idx)}
            />
            <Button
              type='button'
              variant='text'
              onClick={() => removeField(idx)}
            >
              <Delete className={classes.icon} />
            </Button>
          </div>
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
