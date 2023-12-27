import React from 'react'
import { Box } from '@mui/material'

import ParticipantsTable from '../tables/ParticipantsTable'
import TableSearchForm from '../forms/TableSearchForm'
import PageHeader from '../components/PageHeader'
import useParticipantsList from '../hooks/useParticipantsList'

const ParticipantsPage = () => {
  const {
    handleSearch,
    searchSubjects,
    onSort,
    onStar,
    sortBy,
    sortDirection,
    participants,
    searchOptions,
  } = useParticipantsList()

  return (
    <Box sx={{ p: '20px' }}>
      <PageHeader
        title="Participants"
        form={
          <TableSearchForm
            name="participants"
            onSubmit={handleSearch}
            initialValues={{
              participants: searchSubjects,
            }}
            allOptions={searchOptions}
          />
        }
      />

      <ParticipantsTable
        participants={participants}
        onStar={onStar}
        onSort={onSort}
        sortProperty={sortBy}
        sortDirection={sortDirection}
        sortable
      />
    </Box>
  )
}

export default ParticipantsPage
