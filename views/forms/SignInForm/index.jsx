import React from 'react'
import TextInput from '../TextInput'
import { Button } from '@mui/material'
import Form from '../Form'
import './SignInForm.css'

const SignInForm = ({ onSubmit }) => {
  return (
    <Form onSubmit={onSubmit}>
      <TextInput
        name="username"
        label="Username"
        required={true}
        fullWidth={true}
        margin="normal"
        variant="outlined"
      />
      <TextInput
        name="password"
        type="password"
        label="Password"
        required={true}
        margin="normal"
        variant="outlined"
      />
      <div className="SignInForm_submitBtnContainer">
        <Button
          className="SignInForm_button"
          sx={{
            backgroundColor: 'primary.dark',
          }}
          variant="contained"
          type="submit"
          fullWidth={true}
        >
          Sign in
        </Button>
      </div>
    </Form>
  )
}

export default SignInForm
