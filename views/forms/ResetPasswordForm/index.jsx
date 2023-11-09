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
    reset_key: z.string(),
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

const ResetPasswordForm = ({ initialValues, onCancel, onSubmit }) => {
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
        name="username"
        label="Username"
        required={true}
        margin="normal"
      />
      <TextInput
        control={control}
        errors={errors.password}
        fullWidth
        inputProps={{ 'data-testid': 'pw' }}
        name="password"
        label="Password"
        type="password"
        required={true}
        margin="normal"
      />
      <TextInput
        control={control}
        errors={errors.confirmPassword}
        fullWidth
        inputProps={{ 'data-testid': 'confirm-pw' }}
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        required={true}
        margin="normal"
      />
      <TextInput
        control={control}
        errors={errors.reset_key}
        fullWidth
        label="Reset Key"
        margin="normal"
        name="reset_key"
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

export default ResetPasswordForm
