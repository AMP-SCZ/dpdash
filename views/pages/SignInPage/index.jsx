import React, { useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { routes } from '../../routes/routes'
import api from '../../api'
import { AuthContext, NotificationContext } from '../../contexts'
import SignInForm from '../../forms/SignInForm'
import './SignInPage.css'

const SignInPage = () => {
  const navigate = useNavigate()
  const [, setUser] = useContext(AuthContext)
  const [, setNotification] = useContext(NotificationContext)
  const onSubmit = async (data) => {
    try {
      const user = await api.auth.login(data)

      setUser(user)
      navigate(routes.main)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  return (
    <Box className="SignInPage_container" sx={{ boxShadow: 5 }}>
      <Typography variant="h4" gutterBottom={true}>
        Sign In
      </Typography>
      <Typography variant="body1">
        Need a DPDash Account?{' '}
        <Link className="SignInPageRegister_link" to={routes.register}>
          Sign Up
        </Link>
      </Typography>
      <SignInForm
        initialValues={{ username: '', password: '' }}
        onSubmit={onSubmit}
      />
      <Typography
        component={Link}
        to={routes.resetpw}
        sx={{ color: 'primary.main', pt: '20px' }}
      >
        Request Password Assistance
      </Typography>
    </Box>
  )
}

export default SignInPage
