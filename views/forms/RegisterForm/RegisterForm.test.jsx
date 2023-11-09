import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import RegisterForm from '.'

describe('Register Form', () => {
  const defaultProps = {
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      email: '',
    },
    onCancel: () => {},
    onSubmit: () => {},
  }
  const elements = {
    usernameField: () => screen.getByRole('textbox', { name: 'Username' }),
    passwordField: () => screen.getByTestId('pw'),
    confirmPasswordField: () => screen.getByTestId('confirm-pw'),
    fullNameField: () => screen.getByRole('textbox', { name: 'Full Name' }),
    emailField: () => screen.getByRole('textbox', { name: 'Email' }),
    cancelBtn: () => screen.getByText('Cancel'),
    submitBtn: () => screen.getByText('Submit'),
  }
  const renderForm = (props = defaultProps) => {
    render(<RegisterForm {...props} />)
  }

  test('calls the onSubmit prop when the form is submitted with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const props = { ...defaultProps, onSubmit }

    renderForm(props)
    await user.type(elements.usernameField(), 'myUsername')
    await user.type(elements.passwordField(), 'myPassword')
    await user.type(elements.confirmPasswordField(), 'myPassword')
    await user.type(elements.fullNameField(), 'Joe Schmoe')
    await user.type(elements.emailField(), 'joe@example.test')
    await user.click(elements.submitBtn())

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          username: 'myUsername',
          password: 'myPassword',
          confirmPassword: 'myPassword',
          fullName: 'Joe Schmoe',
          email: 'joe@example.test',
        },
        expect.anything()
      )
    )
  })

  test('displays errors and does not submit the form with invalid data', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const props = { ...defaultProps, onSubmit }

    renderForm(props)
    await user.type(elements.usernameField(), 'myUsername')
    await user.type(elements.passwordField(), 'nope')
    await user.type(elements.confirmPasswordField(), 'nope')
    await user.type(elements.fullNameField(), 'Joe Schmoe')
    await user.type(elements.emailField(), 'not-an-email')
    await user.click(elements.submitBtn())

    await waitFor(() =>
      expect(
        screen.getAllByText('String must contain at least 8 character(s)')
      ).toHaveLength(2)
    )
    expect(screen.getByText('Invalid email')).toBeInTheDocument()

    expect(onSubmit).not.toHaveBeenCalled()
  })

  test('displays errors and does not submit the form with unmatched passwords', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const props = { ...defaultProps, onSubmit }

    renderForm(props)
    await user.type(elements.usernameField(), 'myUsername')
    await user.type(elements.passwordField(), 'thisIsMyPassword')
    await user.type(
      elements.confirmPasswordField(),
      'thisIsMyConfirmedPassword'
    )
    await user.type(elements.fullNameField(), 'Joe Schmoe')
    await user.type(elements.emailField(), 'joe@example.test')
    await user.click(elements.submitBtn())

    await waitFor(() =>
      expect(screen.getAllByText('Passwords do not match')).toHaveLength(2)
    )

    expect(onSubmit).not.toHaveBeenCalled()
  })

  test('calls the onCancel prop when the cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = jest.fn()
    const props = { ...defaultProps, onCancel }

    renderForm(props)
    await user.click(elements.cancelBtn())

    await waitFor(() => expect(onCancel).toHaveBeenCalledWith())
  })
})
