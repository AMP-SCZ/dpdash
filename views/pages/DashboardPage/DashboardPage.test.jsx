import React from 'react'
import { render, screen, within, waitFor } from '@testing-library/react'
import { AuthContext, NotificationContext } from '../../contexts'
import { MemoryRouter } from 'react-router-dom'
import DashboardPage from '.'
import { createParticipantList, createUser } from '../../../test/fixtures'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: () => {
    return {
      user: createUser()
    }
  }
}))
jest.mock('../../api', () => ({
  participants: {
    all: () => Promise.resolve(createParticipantList())
  },
}))
describe('Dashboard Page', () => {
  
  test('Dashboard Page renders', async () => {
    render(
      <MemoryRouter>
        <NotificationContext.Provider value={[{}, jest.fn()]}>
          <AuthContext.Provider value={[{}, jest.fn()]}>
            <DashboardPage />
          </AuthContext.Provider>
        </NotificationContext.Provider>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  test('Dashboard Page shows 5 rows of Participants', async () => {
    render(
      <MemoryRouter>
        <NotificationContext.Provider value={[{}, jest.fn()]}>
          <AuthContext.Provider value={[{}, jest.fn()]}>
            <DashboardPage />
          </AuthContext.Provider>
        </NotificationContext.Provider>
      </MemoryRouter>
    )

    await waitFor(() => {
      const participantRows = within(screen.getAllByRole('table')[0]).getAllByRole('row')
      expect(participantRows.length).toBe(6)
    })
  })
})
