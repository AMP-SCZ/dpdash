import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import ReactSelect from 'react-select'

import ParticipantsTable from '../components/VirtualTables/ParticipantsTable'
import { components } from '../forms/ControlledReactSelect/components'
import { useEffect } from 'react'
import api from '../api'
import { SORT_DIRECTION } from '../../constants'

const HomePage = () => {
  const { user, setNotification, setUser } = useOutletContext()
  const { uid, preferences } = user

  const [participants, setParticipants] = useState([])
  const [searchSubjects, setSearchSubjects] = useState([])
  const [searchOptions, setSearchOptions] = useState([])
  const [sortDirection, setDirection] = useState(SORT_DIRECTION.ASC)
  const [sortBy, setSortBy] = useState('')

  const fetchParticipants = async (sortParams) =>
    await api.participants.all(sortParams)

  const handleUserUpdate = async (e) => {
    try {
      const { name, value } = e.target
      const [key, study] = name.split('-')
      const values = preferences[key] || {}

      if (values[study]) {
        if (values[study].includes(value)) {
          values[study] = values[study].filter(
            (participant) => participant !== value
          )
        } else values[study].push(value)
      } else values[study] = [value]
      const userAttributes = {
        ...user,
        preferences: { ...preferences, [key]: values },
      }
      const updatedUser = await api.users.update(uid, userAttributes)
      const participantsList =
        sortBy && sortDirection
          ? await fetchParticipants({
              sortBy,
              sortDirection,
            })
          : await fetchParticipants()

      setUser(updatedUser)
      setParticipants(participantsList)
      setNotification({ open: true, message: 'User updated successfully.' })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const sort = async (newSortBy, newSortDirection) => {
    const participantList = await fetchParticipants({
      sortBy: newSortBy,
      sortDirection: newSortDirection,
      searchSubjects: normalizeSearchSubjects(searchSubjects),
    })

    setSortBy(newSortBy)
    setDirection(newSortDirection)
    setParticipants(participantList)
  }

  const handleSearch = async (e) => {
    setSearchSubjects(e)

    const participantsList = await fetchParticipants({
      sortBy,
      sortDirection,
      searchSubjects: normalizeSearchSubjects(e),
    })

    setParticipants(participantsList)
    setRowcount(participantsList.length)

    if (e.length === 0) {
      const participantsList = await fetchParticipants()

      setParticipants(participantsList)
    }
  }
  const normalizeSearchSubjects = (searchSubjects) =>
    searchSubjects.map(({ value }) => value)

  useEffect(() => {
    fetchParticipants().then((participantsList) => {
      const dropDownOptions = participantsList.map(({ study, subject }) => ({
        value: `${subject}`,
        label: `${subject} in ${study}`,
      }))

      setParticipants(participantsList)
      setSearchOptions(dropDownOptions)
    })
  }, [])

  return (
    <>
      <ReactSelect
        placeholder="Search a study or participant"
        value={searchSubjects}
        onChange={handleSearch}
        options={searchOptions}
        autoFocus={true}
        components={components}
        isMulti
      />
      <ParticipantsTable
        participants={participants}
        onUpdate={handleUserUpdate}
        onSort={sort}
        sortProperty={sortBy}
        sortDirection={sortDirection}
        sortable
      />
    </>
  )
}

export default HomePage
