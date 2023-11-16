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
import { fontSize } from '../../../constants'

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
    <TableContainer component={Paper} sx={{ border: 0, boxShadow: 'none' }}>
      <MuiTable
        size="small"
        sx={{ border: 0, borderCollapse: 'separate', borderSpacing: '0 16px' }}
      >
        <TableHead
          sortDirection={sortDirection}
          sortProperty={sortProperty}
          onRequestSort={handleRequestSort}
          headCells={headers}
        />
        <TableBody>
          {data.map((rowData) => (
            <TableRow>
              {headers.map((header, cellIndex) => (
                <TableCell
                  key={header.dataProperty}
                  sx={{
                    ...(cellIndex === 0
                      ? {
                          borderLeftWidth: 1,
                          borderLeftStyle: 'solid',
                          borderLeftColor: 'grey.100',
                          borderBottomLeftRadius: 4,
                          borderTopLeftRadius: 4,
                        }
                      : {}),
                    ...(cellIndex === headers.length - 1
                      ? {
                          borderRightWidth: 1,
                          borderRightStyle: 'solid',
                          borderRightColor: 'grey.100',
                          borderBottomRightRadius: 4,
                          borderTopRightRadius: 4,
                        }
                      : {}),
                    borderBottomWidth: 1,
                    borderBottomColor: 'grey.100',
                    borderBottomStyle: 'solid',
                    borderTopWidth: 1,
                    borderTopColor: 'grey.100',
                    borderTopStyle: 'solid',
                    fontSize: fontSize[16],
                  }}
                >
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
