import React, { useState } from 'react'
import Button from '@material-ui/core/Button'

import Form from './Form'
import BarChartFields from './BarChartFields'

const ChartForm = ({ classes, handleSubmit }) => {
  const [formValues, setFormValues] = useState({
    title: '',
    assessment: '',
    variable: '',
    fieldLabelValueMap: [
      {
        value: '',
        label: ''
      }
    ]
  })

  const updateFormValues = (e,) => setFormValues({ ...formValues, [e.target.name]: e.target.value })

  return (
    <Form handleSubmit={(e) => handleSubmit(e, formValues)}>
      <BarChartFields 
        classes={classes} 
        updateFormValues={updateFormValues} 
        formValues={formValues}
        setFormValues={setFormValues}
      />
      <div className={classes.submitButtonContainer}>
        <Button
          type='submit'
          variant='contained'
          className={classes.textButton}
        >
          Submit Form
        </Button>
      </div>
    </Form>
  )
}

export default ChartForm
