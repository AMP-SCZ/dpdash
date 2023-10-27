import React from 'react'
import { ImageList } from '@mui/material'
import ConfigurationCard from '../ConfigurationCard'

const ConfigurationsList = ({
  classes,
  configurations,
  gridState,
  ...rest
}) => {
  return (
    <>
      <ImageList
        className={classes.gridList}
        cols={gridState.columns}
        cellHeight="auto"
      >
        {configurations.map((config) => {
          return (
            <ConfigurationCard
              key={config._id}
              classes={classes}
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
