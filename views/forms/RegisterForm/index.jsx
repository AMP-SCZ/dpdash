import { Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import TextInput from '../TextInput'

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required().min(8),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'passwords do not match'),
  fullName: yup.string().required(),
  email: yup.string().required().email(),
})

const RegistrationForm = ({ initialValues, onCancel, onSubmit }) => {
  const {
    handleSubmit,
    control,
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
