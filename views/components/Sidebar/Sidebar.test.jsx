/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom' // Use MemoryRouter for testing routes
import Sidebar from '.'
import { createUser } from '../../../test/fixtures'
import SidebarLogo from './SidebarLogo'
import SideNavigation from './SideNavigation'
import SidebarFooter from './SidebarFooter'
import '@testing-library/jest-dom'

jest.mock('./SidebarLogo')
jest.mock('./SideNavigation')
jest.mock('./SidebarFooter')

describe('Sidebar', () => {
  const user = createUser()

  test('renders Sidebar', async () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar user={user} />
      </MemoryRouter>
    )

    await waitFor(() => {
      const drawer = container.firstChild

      expect(drawer).toHaveClass(
        'MuiDrawer-root MuiDrawer-docked css-7ik032-MuiDrawer-docked'
      )
    })
  })
})
