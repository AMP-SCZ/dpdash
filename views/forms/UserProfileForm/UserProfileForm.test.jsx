import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import UserProfileForm from '.'

describe('User Profile Form', () => {
  const pngFile = new File(['hello'], 'hello.png', { type: 'image/png' })
  const defaultProps = {
    initialValues: {
      icon: '',
      display_name: '',
      mail: '',
      title: '',
      department: '',
      company: '',
    },
    onCancel: () => {},
    onSubmit: () => {},
  }
  const elements = {
    displayNameField: () => screen.getByRole('textbox', { name: 'Full Name' }),
    emailField: () => screen.getByRole('textbox', { name: 'Email' }),
    titleField: () => screen.getByRole('textbox', { name: 'Title' }),
    departmentField: () => screen.getByRole('textbox', { name: 'Department' }),
    companyField: () => screen.getByRole('textbox', { name: 'Company' }),
    iconField: () => screen.getByTestId('icon-input'),
    submitBtn: () => screen.getByText('Save'),
  }
  const renderForm = (props = defaultProps) => {
    render(<UserProfileForm {...props} />)
  }

  test('calls the onSubmit prop when the form is submitted with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const props = { ...defaultProps, onSubmit }

    renderForm(props)
    await user.type(elements.displayNameField(), 'My Full Name')
    await user.type(elements.emailField(), 'myEmail@example.test')
    await user.type(elements.titleField(), 'My Title')
    await user.type(elements.departmentField(), 'My Department')
    await user.type(elements.companyField(), 'My Company')
    await user.upload(elements.iconField(), pngFile)
    await user.click(elements.submitBtn())

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          display_name: 'My Full Name',
          mail: 'myEmail@example.test',
          title: 'My Title',
          department: 'My Department',
          company: 'My Company',
          icon: expect.stringContaining('data:image/png;base64'),
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
    await user.type(elements.emailField(), 'not-an-email')
    await user.click(elements.submitBtn())

    await waitFor(() =>
      expect(screen.getByText('mail must be a valid email')).toBeInTheDocument()
    )
    expect(
      screen.getByText('display_name is a required field')
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
