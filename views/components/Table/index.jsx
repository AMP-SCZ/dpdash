import React from 'react'
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material'

import TableHead from './TableHead'

const Table = (props) => {
  const {
    cellRenderer,
    data,
    headers,
    sortDirection,
    sortProperty,
    handleRequestSort,
  } = props

  return (
    <TableContainer component={Paper}>
      <MuiTable size="small">
        <TableHead
          sortDirection={sortDirection}
          sortProperty={sortProperty}
          onRequestSort={handleRequestSort}
          headCells={headers}
        />
        <TableBody>
          {data.map((rowData) => (
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header.dataProperty}>
                  {cellRenderer(rowData, header.dataProperty)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}

export default Table
