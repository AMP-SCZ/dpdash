import { Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import TextInput from '../TextInput'

const schema = z
  .object({
    username: z.string(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    fullName: z.string(),
    email: z.string().email(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['password'],
      })
    }
  })

const RegistrationForm = ({ initialValues, onCancel, onSubmit }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        control={control}
        errors={errors.username}
        fullWidth
        label="Username"
        margin="normal"
        name="username"
        required={true}
      />
      <TextInput
        control={control}
        errors={errors.password}
        fullWidth
        inputProps={{ 'data-testid': 'pw' }}
        label="Password"
        margin="normal"
        name="password"
        required={true}
        type="password"
      />
      <TextInput
        control={control}
        errors={errors.confirmPassword}
        fullWidth
        inputProps={{ 'data-testid': 'confirm-pw' }}
        label="Confirm Password"
        margin="normal"
        name="confirmPassword"
        required={true}
        type="password"
      />
      <TextInput
        control={control}
        errors={errors.fullName}
        fullWidth
        label="Full Name"
        margin="normal"
        name="fullName"
        required={true}
      />
      <TextInput
        control={control}
        errors={errors.email}
        fullWidth
        label="Email"
        margin="normal"
        name="email"
        required={true}
      />

      <div>
        <Button color="primary" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button variant="outlined" type="submit">
          Submit
        </Button>
      </div>
    </form>
  )
}

export default RegistrationForm
