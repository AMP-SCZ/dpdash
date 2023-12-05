import React from 'react'
import Settings from '@mui/icons-material/Settings'
import Clear from '@mui/icons-material/Clear'
import LockOpen from '@mui/icons-material/LockOpen'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'

import Table from '../Table'

const AdminUsersTable = (props) => {
  const headers = [
    {
      dataProperty: 'uid',
      label: 'Username',
      sortable: false,
    },
    {
      dataProperty: 'display_name',
      label: 'Name',
      sortable: false,
    },
    {
      dataProperty: 'mail',
      label: 'Email',
      sortable: false,
    },
    {
      dataProperty: 'role',
      label: 'Role',
      sortable: false,
    },
    {
      dataProperty: 'access',
      label: 'Access',
      sortable: false,
    },
    {
      dataProperty: 'account_expires',
      label: 'Account Expiration',
      sortable: false,
    },
    {
      dataProperty: 'force_reset_pw',
      label: 'Reset Password',
      sortable: false,
    },
    {
      dataProperty: 'blocked',
      label: 'Inactive',
      sortable: false,
    },
    {
      dataProperty: 'delete',
      label: 'Delete',
      sortable: false,
    }
  ]

  const cellRenderer = (user, property, rowIndex) => {
    switch (property) {
      case 'access':
        return (
          <div className="IconStyles">
            <Settings onClick={() => props.onAccess(rowIndex)}></Settings>
          </div>
        )
      case 'account_expires':
        return (
          <DatePicker
            name={`users.${rowIndex}.account_expires`}
            value={moment(user[property])}
            onChange={(value) => props.onChangeAccountExpiration(rowIndex, value)}
          />
        )
      case 'force_reset_pw':
        return (
          <div className="IconStyles">
            <IconButton
              aria-label="Reset Password"
              onClick={() => props.onResetPassword(rowIndex)}
            >
              <LockOpen />
            </IconButton>
          </div>
        )
      case 'blocked':
        return (
          <Checkbox
            name={`users.${rowIndex}.blocked`}
            checked={Boolean(user[property])}
            onChange={() => props.onUserBlock(rowIndex)}
          />
        )
      case 'delete':
        return (
          <div className="IconStyles">
            <IconButton
              color="error"
              aria-label="Delete a user"
              onClick={() => props.onDeleteUser(rowIndex)}
            >
              <Clear />
            </IconButton>
          </div>
        )
      default:
        return user[property]
    }
  }

  return (
    <Table headers={headers} data={props.users} cellRenderer={cellRenderer} />
  )
}

export default AdminUsersTable
