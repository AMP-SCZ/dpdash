import { Button, Tooltip } from '@mui/material'
import { Controller } from 'react-hook-form'

import { EMAIL_REGEX } from '../../../constants'
import TextInput from '../TextInput'

const UserProfileForm = ({ control, onSubmit, setUser, user }) => {
  return (
    <form onSubmit={onSubmit}>
      <Controller
        control={control}
        name="icon"
        render={({ field: { value, onChange, ...field } }) => {
          return (
            <div>
              <input
                accept="image/*"
                id="icon"
                multiple
                type="file"
                {...field}
                value={value?.fileName}
                onChange={(event) => {
                  const { files } = event.target

                  if (files[0]) {
                    const reader = new FileReader()

                    reader.readAsDataURL(files[0])
                    reader.onload = (e) => {
                      setUser({ ...user, icon: e.target.result })
                      onChange(e.target.result)
                    }
                  }
                }}
              />
              <label htmlFor="icon">
                <span>
                  <Tooltip title="Edit Profile Photo"></Tooltip>
                </span>
              </label>
            </div>
          )
        }}
      />
      <TextInput
        control={control}
        label="Full Name"
        name="display_name"
        fullWidth={true}
      />
      <TextInput
        control={control}
        label="Email"
        type="email"
        pattern={EMAIL_REGEX}
        name="mail"
        fullWidth={true}
      />
      <TextInput
        control={control}
        label="Title"
        name="title"
        fullWidth={true}
      />
      <TextInput
        control={control}
        label="Department"
        name="department"
        fullWidth={true}
      />
      <TextInput
        control={control}
        label="Company"
        name="company"
        fullWidth={true}
      />
      <div>
        <Button variant="outlined" type="submit">
          Save
        </Button>
      </div>
    </form>
  )
}

export default UserProfileForm
