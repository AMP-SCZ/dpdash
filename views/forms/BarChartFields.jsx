import React from 'react'
import Delete from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';

const BarChartFields = ({ 
  classes,
  formValues,
  setFormValues,
}) => {
  const { title } = formValues
  
  const updateFormValues = (e,) => setFormValues({ ...formValues, [e.target.name]: e.target.value })
  const addValueAndLabelField = () => setFormValues(prevState => ({
    ...prevState,
    fieldLabelValueMap: [...prevState
      .fieldLabelValueMap,
        {  value: '', label: '' }
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
          ? { ...field, [e.target.name]: handleDigits(e.target.value) }
          : field
        )
      }))
  const handleDigits = (input) => {
    const regex = new RegExp(/^[0-9]*$/)
    return regex.test(input) ? parseFloat(input) : input
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
        formValues.fieldLabelValueMap.length > 0 && 
        formValues.fieldLabelValueMap.map((field, idx) => (
          <div key={idx} className={classes.formLabelRow}>
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
            <Button
              type='button'
              variant='text'
              onClick={() => removeValueAndLabelField(idx)}
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
