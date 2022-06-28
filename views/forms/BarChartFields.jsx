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
  addValueAndLabelField
}) => {
  const [chartTitle, setTitle] = useState('')
  
  useEffect(() => {
    setTitle(formValues[title])
    console.log(valueAndLabelFields)
  }, [formValues, valueAndLabelFields])

  return(
    <>
      <Typography variant="subtitle1" align="center" gutterBottom>
        {chartTitle} 
      </Typography>
      <TextField
        className={classes.textInput}
        label="Title"
        name="title"
        onChange={updateFormValues}
        required
        fullWidth
      />
      <TextField
        className={classes.textInput}
        label="Assessment"
        name="assessment"
        onChange={updateFormValues}
        required
        fullWidth
      />
      <TextField
        label="Variable Name"
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
              label="Value"
              // onChange={(e) => handleValueLabelChange(e, idx, 'value')}
              className={`${classes.formLabelCol} ${classes.variableListInput}`}
            />
            <TextField
              label="Label"
              className={`${classes.variableListInput}`}
              // onChange={(e) => handleValueLabelChange(e, idx, 'label')}
            />
                                              <Button
                        type="button"
                        variant="text"
                        // onClick={() => removeDetails(_id)}
                      >
                        <Delete className={classes.icon} />
                      </Button>
          </div>
        ))
      }
      <div className={classes.addLabelContainer}>
      <Button
        variant="text"
        type="button"
        className={classes.textButton}
        onClick={addValueAndLabelField}
      >
        + Add label/grouping for variable value
      </Button>
      </div>
  </>
  )
}

export default BarChartFields
