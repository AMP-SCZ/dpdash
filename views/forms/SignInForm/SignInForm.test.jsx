import React from 'react'
import { render, screen } from '@testing-library/react'
import LoginForm from '.'
import FormProviderFixture from '../../../test/FormProviderFixture'

describe('Login Form', () => {
  beforeEach(() => {
    render(<LoginForm />, { wrapper: FormProviderFixture })
  })

  test('renders the text inputs', () => {
    const usernameField = screen.getByLabelText('username')
    const passwordField = screen.getByLabelText('password')

    expect(usernameField).toBeInTheDocument()
    expect(passwordField).toBeInTheDocument()
  })

  test('renders the Sign In button', () => {
    const signInButton = screen.getByText('Sign in')

    expect(signInButton).toBeInTheDocument()
  })
})
