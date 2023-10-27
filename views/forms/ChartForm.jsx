import React from 'react'
import Button from '@mui/material/Button'

import Form from './Form'
import BarChartFields from './BarChartFields'

const ChartForm = ({ onSubmit, fields, control, ...rest }) => {
  return (
    <Form onSubmit={onSubmit}>
      <BarChartFields control={control} fields={fields} {...rest} />
      <div>
        <Button type="submit" variant="contained">
          Submit Form
        </Button>
      </div>
    </Form>
  )
}

export default ChartForm
