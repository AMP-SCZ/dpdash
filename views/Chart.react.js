import React from 'react'
import Button from '@material-ui/core/Button';
import basePathConfig from '../server/configs/basePathConfig';

const basePath = basePathConfig || '';

export default function Charts() {
  return (
    <>
      <h1> Charts</h1>
      <br />
      <Button
        variant="outlined"
        color="primary"
        href={`${basePath}/charts/new`}
      >
        New Chart
      </Button>
    </>
  )
}
