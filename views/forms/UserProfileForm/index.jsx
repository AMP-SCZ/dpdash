import React, { useEffect, useRef, useState } from 'react'
import { Avatar, Button } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import TextInput from '../TextInput'
import FileModel from '../../models/FileModel'

const schema = yup.object({
  company: yup.string(),
  department: yup.string(),
  display_name: yup.string().required(),
  icon: yup.string(),
  mail: yup.string().email().required(),
  title: yup.string(),
})

const UserProfileForm = ({ initialValues, onSubmit }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  })
  const fileInput = useRef()
  const iconFile = watch('iconFile')
  const [iconSrc, setIconSrc] = useState()

  useEffect(() => {
    if (iconFile) {
      FileModel.toDataURL(iconFile).then(setIconSrc)
    } else {
      setIconSrc(undefined)
    }
  }, [iconFile])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="iconFile"
          render={({ field }) => {
            return (
              <div>
                <input
                  accept="image/*"
                  data-testid="icon-input"
                  id="iconFile"
                  multiple
                  type="file"
                  {...field}
                  ref={(inputRef) => {
                    fileInput.current = inputRef
                    field.ref(inputRef)
                  }}
                  value={undefined}
                  onChange={(event) => {
                    const { files } = event.target

                    if (files[0]) {
                      field.onChange(files[0])
                    }
                  }}
                />
                <label htmlFor="iconFile">Edit Profile Photo</label>
              </div>
            )
          }}
        />
        <button
          type="button"
          onClick={() => {
            setValue('iconFile', null)
            fileInput.current.value = ''
          }}
        >
          Remove profile image
        </button>
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
      <Avatar
        alt="User avatar"
        src={iconSrc}
        style={{ height: 100, width: 100, objectFit: 'scale-down' }}
      />
    </>
  )
}

export default UserProfileForm
