/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, waitFor } from '@testing-library/react'
import SideNavigation from './SideNavigation'
import { MemoryRouter } from 'react-router-dom'
import { createUser } from '../../../test/fixtures'

jest.mock('./SidebarLink')

describe('SideNavigation', () => {
  let wrapper

  beforeEach(() => {
    wrapper = render(
      <MemoryRouter>
        <SideNavigation user={user} />
      </MemoryRouter>
    )
  })
  const user = createUser({ role: 'admin' })

  test('renders SideNavigation component', async () => {
    const { container } = wrapper

    await waitFor(() => {
      const nav = container.getElementsByClassName('sidenav')

      expect(nav).toBeDefined()
    })
  })

  test('renders a divider', async () => {
    const { container } = wrapper

    await waitFor(() => {
      const divider = container.querySelector('.MuiDivider-light')

      expect(divider).toBeDefined()
    })
  })
})
