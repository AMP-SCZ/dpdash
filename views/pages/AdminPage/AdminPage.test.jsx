import { screen } from '@testing-library/react'

import AdminPage from '.'
import { createUser } from '../../../test/fixtures'
import renderPage from '../../../test/PageRenderer'

const mockUser = createUser()
const mockUsers = [createUser(), createUser()]

jest.mock(
  'react-router-dom',
  () => {
    return {
      ...jest.requireActual('react-router-dom'),
      useOutletContext: () => {
        return {
          user: mockUser,
          users: mockUsers,
          setNotification: jest.fn(),
        }
      },
    }
  },
  {}
)
describe('Admin Page', () => {
  it('renders the page', () => {
    renderPage(AdminPage)

    const pageTitle = screen.getByText('Admin')

    expect(pageTitle).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})
