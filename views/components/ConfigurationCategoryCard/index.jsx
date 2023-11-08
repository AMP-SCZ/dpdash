import React from 'react'
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
} from '@mui/material'
import { Delete, ContentCopy } from '@mui/icons-material'

const ConfigurationCategoryCard = ({
  children,
  formIndex,
  onCopy,
  onRemove,
  rowNum,
  width,
}) => {
  return (
    <Card style={{ width: width }}>
      <CardHeader subheader={'Row ' + rowNum}></CardHeader>
      <Divider />
      <CardContent>{children}</CardContent>
      <CardActions>
        <IconButton aria-label="delete" onClick={() => onRemove(formIndex)}>
          <Delete />
        </IconButton>
        <IconButton aria-label="copy" onClick={() => onCopy(formIndex)}>
          <ContentCopy />
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default ConfigurationCategoryCard
