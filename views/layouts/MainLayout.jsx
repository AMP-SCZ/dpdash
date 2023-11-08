import React, { useState, useEffect, useContext } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Sidebar from '../components/Sidebar/'
import {
  AuthContext,
  ConfigurationsContext,
  NotificationContext,
} from '../contexts'
import api from '../api'
import { routes } from '../routes/routes'

const MainLayout = () => {
  const [configurations, setConfigurations] = useContext(ConfigurationsContext)
  const [, setNotification] = useContext(NotificationContext)
  const [user, setUser] = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const navigate = useNavigate()
  const fetchUsers = async () => {
    try {
      const usersList = await api.users.loadAll()
      setUsers(usersList)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const loadAllConfigurations = async () => {
    try {
      const configurations = await api.userConfigurations.all(user.uid)

      setConfigurations(configurations)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const handleLogout = async () => {
    try {
      await api.auth.logout()

      setUser(null)
      navigate(routes.login)
    } catch (error) {
      alert(error.message)
    }
  }
  useEffect(() => {
    fetchUsers()
    loadAllConfigurations()
  }, [])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
      <Sidebar sidebarOpen={true} user={user} onLogout={handleLogout} />
      <Outlet
        context={{
          configurations,
          navigate,
          setConfigurations,
          setNotification,
          setUser,
          setUsers,
          user,
          users,
        }}
      />
    </Box>
  )
}
export default MainLayout
