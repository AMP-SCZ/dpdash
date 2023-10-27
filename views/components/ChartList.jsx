import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Delete from '@mui/icons-material/Delete'
import Edit from '@mui/icons-material/Edit'
import Share from '@mui/icons-material/Share'
import PlaylistAdd from '@mui/icons-material/PlaylistAdd'
import { Link as RouterLink } from 'react-router-dom'

import { routes } from '../routes/routes'
import UserAvatar from './UserAvatar'

const ChartList = ({
  handleShareChart,
  chartList,
  removeChart,
  onDuplicateChart,
  user,
  classes,
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
                  <span className={classes.chartListOwnerContainer}>
                    <UserAvatar user={chart.chartOwner} small={true} />
                    <Typography
                      variant="subtitle2"
                      className={classes.chartListOwnerName}
                    >
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
                    className={userIsOwner ? '' : classes.disable}
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
                    className={userIsOwner ? '' : classes.disable}
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
