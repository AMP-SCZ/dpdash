import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'

import { createChart } from '../fe-utils/fetchUtil'

import Form from './Form'
import BarChartFields from './BarChartFields'

const ChartForm = ({ classes }) => {
  const [formValues, setFormValues] = useState({})
  const [fieldLabelValueMap, setFieldLabelValueMap] = useState([])

  const updateFormValues = (e,) => setFormValues({...formValues, [e.target.name]: e.target.value})
  const addValueAndLabelField = () => setFieldLabelValueMap(prevState => [{ value: '', label: '' }, ...prevState ])
  const removeValueAndLabelField = (id) => setFieldLabelValueMap(prevState => [...prevState.filter((_, index) => index !== id)])
  const handleValueAndLabelFieldUpdate = (e, id) => setFieldLabelValueMap(prevState => 
    [...prevState
      .map((field, idx) => 
        id === idx
        ? 
          ({ ...field, [e.target.name]: e.target.value }) 
        : 
          ({...field})
        )
      ])
  const handleSubmit = async (e) => {
    e.preventDefault()
    const values = { ...formValues, fieldLabelValueMap: fieldLabelValueMap }
    await createChart(values)
  }

  return (
    <Form handleSubmit={handleSubmit}>
      <BarChartFields 
        classes={classes} 
        updateFormValues={updateFormValues} 
        formValues={formValues}
        fieldLabelValueMap={fieldLabelValueMap}
        addValueAndLabelField={addValueAndLabelField}
        removeField={removeValueAndLabelField}
        updateFieldValues={handleValueAndLabelFieldUpdate}
      />
      <div className={classes.submitButtonContainer}>
        <Button
          type='submit'
          variant='raised'
          className={classes.textButton}
        >
          Submit Form
        </Button>
      </div>
    </Form>
  )
}

export default ChartForm
