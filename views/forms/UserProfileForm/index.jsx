import React, { useRef } from 'react'
import { Button } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { EMAIL_REGEX } from '../../../constants'
import TextInput from '../TextInput'

const schema = yup.object({
  company: yup.string(),
  department: yup.string(),
  display_name: yup.string().required(),
  icon: yup.string(),
  mail: yup.string().email().required(),
  title: yup.string(),
})

const UserProfileForm = ({ initialValues, onSubmit }) => {
  const profileImageRef = useRef()
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  })

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="icon"
          render={({ field }) => {
            return (
              <div>
                <input
                  accept="image/*"
                  data-testid="icon-input"
                  id="icon"
                  multiple
                  type="file"
                  {...field}
                  value={field.value?.fileName}
                  onChange={(event) => {
                    const { files } = event.target

                    if (files[0]) {
                      const reader = new FileReader()

                      reader.readAsDataURL(files[0])
                      reader.onload = (e) => {
                        field.onChange(e.target.result)
                      }
                    }
                  }}
                />
                <label htmlFor="icon">Edit Profile Photo</label>
              </div>
            )
          }}
        />
        <TextInput
          control={control}
          errors={errors.display_name}
          label="Full Name"
          name="display_name"
          fullWidth={true}
        />
        <TextInput
          control={control}
          errors={errors.mail}
          label="Email"
          pattern={EMAIL_REGEX}
          name="mail"
          fullWidth={true}
        />
        <TextInput
          control={control}
          errors={errors.title}
          label="Title"
          name="title"
          fullWidth={true}
        />
        <TextInput
          control={control}
          errors={errors.department}
          label="Department"
          name="department"
          fullWidth={true}
        />
        <TextInput
          control={control}
          errors={errors.company}
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
      <img
        ref={profileImageRef}
        src={watch('icon')}
        style={{ height: 200, width: 200, objectFit: 'scale-down' }}
      />
    </>
  )
}

export default UserProfileForm
