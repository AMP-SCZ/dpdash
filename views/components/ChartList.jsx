import React, { useEffect, useState } from 'react'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';

import { getCharts, deleteChart } from '../fe-utils/fetchUtil'

const ChartList = () => {
  const [chartList, setChartList] = useState([])

  useEffect(() => {
    getCharts().then((res) => setChartList(res.data))
  }, [])

  const removeChart = async (id) => {
    try {
      const deleted = await deleteChart(id)

      if (deleted.data > 0) {
        await getCharts().then(({ data }) => {
          setChartList(data)
        })
      }
    } catch (error) {
      console.error(error, "*****")
    }
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center">Title</TableCell>
            <TableCell align="center">Assessment</TableCell>
            <TableCell align="center">Variable</TableCell>
            <TableCell align="center">Delete</TableCell>
          </TableRow>
      </TableHead>
      <TableBody>
        {chartList.map(({title, assessment, variable, _id}) => (
          <TableRow key={_id}>
            <TableCell align="center">
              {title}
            </TableCell>
            <TableCell align="center">
              {assessment}
            </TableCell>
            <TableCell align="center">
              {variable}
            </TableCell>
            <TableCell align="center">
              <Button
                type="button"
                variant="text"
                onClick={() => removeChart(_id)}
              >
                <Delete />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ChartList
