import React from 'react'

import { render, screen } from '@testing-library/react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

import AdminUsersTable from '.'
import { createUser } from '../../../test/fixtures'

describe('AdminUsersTable', () => {
  const users = [
    createUser({
      uid: 'user',
      mail: 'test@example.com',
      role: 'admin',
    }),
    createUser({
      uid: 'foo',
      mail: 'foo@example.com',
      role: 'member',
    }),
  ]
  it('renders the table', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <AdminUsersTable  users={users}
                          onAccess={jest.fn()} 
                          onUserBlock={jest.fn()} 
                          onResetPassword={jest.fn()} 
                          onDeleteUser={jest.fn()} 
                          onChangeAccountExpiration={jest.fn()}/>
      </LocalizationProvider>
    )

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('foo@example.com')).toBeInTheDocument()
  })
})
