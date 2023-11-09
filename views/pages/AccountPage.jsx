import React from 'react'
import { useOutletContext } from 'react-router-dom'

import api from '../api'
import UserProfileForm from '../forms/UserProfileForm'

const AccountPage = () => {
  const { user, setUser, setNotification } = useOutletContext()
  const { icon, display_name, mail, title, department, company } = user

  const onSubmit = async (userProfileValues) => {
    try {
      const updatedUser = await api.users.update(user.uid, {
        ...user,
        ...userProfileValues,
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
      initialValues={{ icon, display_name, mail, title, department, company }}
      onSubmit={onSubmit}
    />
  )
}

export default AccountPage
