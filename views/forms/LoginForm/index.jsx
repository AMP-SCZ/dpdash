import React from 'react'
import TextInput from '../TextInput'
import { InputAdornment, Button, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Link } from 'react-router-dom'
import Form from '../Form'
import { routes } from '../../routes/routes'

const LoginForm = ({ control, showPassword, onSubmit, setShowPassword }) => {
  return (
    <div>
      <Form onSubmit={onSubmit}>
        <TextInput
          name="username"
          label="Username"
          autoFocus={true}
          required={true}
          fullWidth={true}
          margin="normal"
          control={control}
        />
        <br />
        <TextInput
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          control={control}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required={true}
          margin="normal"
        />
        <br />
        <Typography component={Link} to={routes.resetpw}>
          Forgot your password?
        </Typography>
        <br />
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          fullWidth={true}
        >
          Log In
        </Button>
        <br />
        <Typography component={Link} to={routes.register}>
          <span>Don't have an account?</span>
          &nbsp;
          <span>Sign up</span>
        </Typography>
      </Form>
    </div>
  )
}

export default LoginForm
