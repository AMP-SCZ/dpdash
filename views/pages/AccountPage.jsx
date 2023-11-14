import React from 'react'
import { useOutletContext } from 'react-router-dom'

import api from '../api'
import UserProfileForm from '../forms/UserProfileForm'
import FileModel from '../models/FileModel'

const AccountPage = () => {
  const { user, setUser, setNotification } = useOutletContext()
  const { icon, iconFileName, display_name, mail, title, department, company } =
    user
  const iconFile =
    !!icon && !!iconFileName
      ? FileModel.fromDataURL(icon, iconFileName)
      : undefined

  const onSubmit = async (userProfileValues) => {
    const { iconFile, ...formData } = userProfileValues
    try {
      const icon = iconFile ? await FileModel.toDataURL(iconFile) : ''
      const iconFileName = iconFile ? iconFile.name : ''
      const updatedUser = await api.users.update(user.uid, {
        ...formData,
        icon,
        iconFileName,
      })

      setUser(updatedUser)
      setNotification(() => ({
        open: true,
        message: 'User has been updated.',
      }))
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
      })
    }
  }

  return (
    <UserProfileForm
      initialValues={{
        iconFile,
        display_name,
        mail,
        title,
        department,
        company,
      }}
      onSubmit={onSubmit}
    />
  )
}

export default AccountPage
