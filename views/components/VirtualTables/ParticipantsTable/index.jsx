import React from 'react'
import { Checkbox } from '@mui/material'
import StarBorder from '@mui/icons-material/StarBorder'
import Star from '@mui/icons-material/Star'

import Table from '../../Table'
import { SORT_DIRECTION } from '../../../../constants'

const ParticipantsTable = (props) => {
  const {
    onSort,
    sortProperty,
    sortDirection,
    sortable,
    participants,
    onUpdate,
  } = props
  const handleRequestSort = (_event, property) => {
    const isAsc =
      sortProperty === property && sortDirection === SORT_DIRECTION.ASC
    return onSort(property, isAsc ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC)
  }
  const headers = [
    {
      dataProperty: 'subject',
      label: 'Participant ID',
      sortable: !!sortable,
    },
    {
      dataProperty: 'study',
      label: 'Study',
      sortable: !!sortable,
    },
    {
      dataProperty: 'days',
      label: 'Days In Study',
      sortable: !!sortable,
    },
    {
      dataProperty: 'star',
      label: '',
      sortable: false,
    },
  ]
  const cellRenderer = (participant, property) => {
    switch (property) {
      case 'star':
        return (
          <Checkbox
            name={`star-${participant.study}`}
            disableRipple={true}
            icon={<StarBorder />}
            checked={participant.star || false}
            checkedIcon={<Star style={{ color: '#FFB80A' }} />}
            value={participant.subject}
            onChange={onUpdate}
          />
        )

      default:
        return participant[property]
    }
  }

  return (
    <Table
      cellRenderer={cellRenderer}
      data={participants}
      headers={headers}
      sortDirection={sortDirection}
      sortProperty={sortProperty}
      handleRequestSort={handleRequestSort}
    />
  )
}

export default ParticipantsTable
