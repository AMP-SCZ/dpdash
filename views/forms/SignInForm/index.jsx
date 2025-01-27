import React from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import TextInput from '../TextInput'
import './SignInForm.css'

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().min(8).required(),
})

const SignInForm = ({ initialValues, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        control={control}
        errors={errors.username}
        name="username"
        label="Username"
        required
        fullWidth
        margin="normal"
        type="text"
      />
      <TextInput
        control={control}
        errors={errors.password}
        fullWidth
        InputProps={{ 'data-testid': 'pw' }}
        label="Password"
        margin="normal"
        name="password"
        required
        type="password"
      />
      <div className="SignInForm_submitBtnContainer">
        <Button
          className="SignInForm_button"
          sx={{
            backgroundColor: 'primary.dark',
          }}
          variant="contained"
          type="submit"
          fullWidth
        >
          Sign in
        </Button>
      </div>
    </form>
  )
}

export default SignInForm
