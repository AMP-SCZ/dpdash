import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { MIN_WIDTH } from '../../constants'

import { routes } from '../routes/routes'
import api from '../api'
import ResetPasswordForm from '../forms/ResetPasswordForm'
import { NotificationContext, DimensionsContext } from '../contexts'

const ResetPasswordPage = () => {
  const [width] = useContext(DimensionsContext)
  const [, setNotification] = useContext(NotificationContext)
  const [errors, setErrors] = useState({
    password: { error: false, message: '' },
    confirmPassword: { error: false, message: '' },
  })
  const { handleSubmit, control } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      reset_key: '',
    },
  })
  const navigate = useNavigate()
  const handleFormSubmit = async (resetAttributes) => {
    try {
      if (resetAttributes.password !== resetAttributes.confirmPassword) {
        setErrors({
          ...errors,
          password: { error: true, message: 'passwords do not match' },
          confirmPassword: { error: true, message: 'passwords do not match' },
        })

        return
      } else if (resetAttributes.password === resetAttributes.confirmPassword) {
        setErrors({
          ...errors,
          password: { error: false, message: '' },
          confirmPassword: { error: false, message: '' },
        })
      }

      const isFormReadyToBeSubmitted = Object.values(errors).every(
        (value) => value.error === false
      )

      if (isFormReadyToBeSubmitted) {
        await api.auth.resetPassword(resetAttributes)

        navigate(routes.login)

        setNotification({
          open: true,
          message: 'Password has been updated successfully.',
        })
      } else {
        setNotification({
          open: true,
          message: 'Please fix any errors in the form.',
        })
      }
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'password' || name === 'confirmPassword') {
      if (value.length < 8) {
        setErrors({
          ...errors,
          [name]: {
            error: true,
            message: 'passwords must be a minimum of 8 characters',
          },
        })
      } else {
        setErrors({
          ...errors,
          [name]: { error: false, message: '' },
        })
      }
    }
  }
  return (
    <div>
      <Card>
        <div>
          <CardContent>
            <Typography variant="title">Welcome to DPdash!</Typography>
            <Typography variant="subheading" color="textSecondary">
              Reset your DPdash account.
            </Typography>
          </CardContent>
          <div>
            <div>
              <ResetPasswordForm
                control={control}
                onSubmit={handleSubmit(handleFormSubmit)}
                errors={errors}
                navigate={navigate}
                onInputChange={handleChange}
              />
            </div>

            {width < MIN_WIDTH ? null : <CardMedia image="/img/dpdash.png" />}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ResetPasswordPage
