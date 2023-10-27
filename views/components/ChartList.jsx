import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Link,
} from '@mui/material'
import { Delete, Edit, Share, PlaylistAdd } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import { routes } from '../routes/routes'
import UserAvatar from './UserAvatar'

const ChartList = ({
  handleShareChart,
  chartList,
  removeChart,
  onDuplicateChart,
  user,
}) => {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Chart</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell align="center">Duplicate</TableCell>
            <TableCell align="center">Edit</TableCell>
            <TableCell align="center">Share</TableCell>
            <TableCell align="center">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chartList.map((chart) => {
            const userIsOwner = user.uid === chart.owner

            return (
              <TableRow key={chart._id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    color="textPrimary"
                    to={routes.viewChart(chart._id)}
                  >
                    {chart.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <span>
                    <UserAvatar user={chart.chartOwner} small={true} />
                    <Typography variant="subtitle2">
                      {chart.chartOwner.display_name}
                    </Typography>
                  </span>
                </TableCell>
                <TableCell align="center">
                  <Button
                    type="button"
                    variant="text"
                    onClick={() => onDuplicateChart(chart._id)}
                  >
                    <PlaylistAdd />
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Link
                    component={RouterLink}
                    to={userIsOwner ? routes.editChart(chart._id) : '#'}
                    color="textPrimary"
                  >
                    <Edit />
                  </Link>
                </TableCell>
                <TableCell align="center">
                  <Button
                    type="button"
                    variant="text"
                    onClick={() => handleShareChart(chart)}
                  >
                    <Share />
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    disabled={!userIsOwner}
                    type="button"
                    variant="text"
                    onClick={() => removeChart(chart._id)}
                  >
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

export default ChartList
