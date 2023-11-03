/**
 * @jest-environment jsdom
 */
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, waitFor } from '@testing-library/react'
import SidebarFooter from './SidebarFooter'
import { createUser } from '../../../test/fixtures'

describe('SidebarFooter', () => {
  const user = createUser()
  test('renders SidebarFooter component with user data', async () => {
    const { getByText, getByAltText } = render(
      <MemoryRouter>
        <SidebarFooter user={user} />
      </MemoryRouter>
    )

    await waitFor(() => {
      const userNameElement = getByText(user.display_name)
      const userAvatarElement = getByAltText('D')

      expect(userNameElement).toBeDefined()
      expect(userAvatarElement).toBeDefined()
    })
  })

  test('renders Edit Profile and Log Out buttons with correct links', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <SidebarFooter user={user} />
      </MemoryRouter>
    )

    await waitFor(() => {
      const editProfileButton = getByText('Edit Profile')
      const logOutButton = getByText('Log Out')

      expect(editProfileButton).toBeDefined()
      expect(editProfileButton).toHaveAttribute('href', '/user-account')
      expect(logOutButton).toBeDefined()
    })
  })

  test('renders DpDash version correctly', async () => {
    const envVars = process.env

    process.env.DPDASH_VERSION = '1.0.0'

    const { getByText } = render(
      <MemoryRouter>
        <SidebarFooter user={user} />
      </MemoryRouter>
    )
    await waitFor(() => {
      const versionElement = getByText('DpDash v1.0.0')

      expect(versionElement).toBeInTheDocument()

      process.env = envVars
    })
  })
})
