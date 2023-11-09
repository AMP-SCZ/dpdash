import { Button } from '@mui/material'

import TextInput from '../TextInput'

const ResetPasswordForm = ({
  onSubmit,
  control,
  errors,
  navigate,
  onInputChange,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <TextInput
        control={control}
        name="username"
        label="Username"
        required={true}
        margin="normal"
      />
      <TextInput
        control={control}
        name="password"
        label="Password"
        type="password"
        required={true}
        margin="normal"
        onChange={(e) => onInputChange(e)}
        error={errors.password.error}
        helperText={errors.password.message}
      />
      <TextInput
        control={control}
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        onChange={(e) => onInputChange(e)}
        error={errors.confirmPassword.error}
        helperText={errors.confirmPassword.message}
        required={true}
        margin="normal"
      />
      <TextInput
        name="reset_key"
        label="Reset Key"
        control={control}
        required={true}
        margin="normal"
      />

      <div>
        <Button color="primary" onClick={() => navigate(`/login`)}>
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
