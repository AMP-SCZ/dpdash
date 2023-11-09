import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography } from '@mui/material'

import RegistrationForm from '../forms/RegisterForm'
import { NotificationContext } from '../contexts'
import api from '../api'
import { routes } from '../routes/routes'

const RegisterPage = () => {
  const [, setNotification] = useContext(NotificationContext)
  const navigate = useNavigate()
  const onSubmit = async (data) => {
    try {
      await api.auth.signup(data)
      setNotification({
        open: true,
        message:
          'Account has been created, please wait for an Admin to provide access.',
      })
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
      })
    }
  }
  return (
    <>
      <Typography variant="h4">Welcome to DPdash!</Typography>
      <Typography variant="body1" color="textSecondary">
        Please create your DPdash account to continue.
      </Typography>
      <RegistrationForm
        initialValues={{
          username: '',
          password: '',
          confirmPassword: '',
          email: '',
          fullName: '',
        }}
        onCancel={() => navigate(routes.login)}
        onSubmit={onSubmit}
      />
    </>
  )
}

export default RegisterPage
