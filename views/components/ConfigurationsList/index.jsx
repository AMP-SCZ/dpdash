import React from 'react'
import { ImageList } from '@mui/material'
import ConfigurationCard from '../ConfigurationCard'

const ConfigurationsList = ({ configurations, gridState, ...rest }) => {
  return (
    <>
      <ImageList cols={gridState.columns} cellHeight="auto">
        {configurations.map((config) => {
          return (
            <ConfigurationCard
              key={config._id}
              config={config}
              width={gridState.gridWidth}
              {...rest}
            />
          )
        })}
      </ImageList>
    </>
  )
}

export default ConfigurationsList
