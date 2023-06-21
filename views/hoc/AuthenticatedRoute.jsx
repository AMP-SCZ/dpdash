import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import api from '../api'

const AuthenticatedRoute = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useContext(AuthContext)
  const userId = window.sessionStorage.getItem('userId')

  const fetchUser = async () => {
    const res = await api.users.findOne(userId)
    if (res.status === 200) setUser(res.data)
    else navigate('/login')
  }

  useEffect(() => {
    if (!user) fetchUser()
  }, [])

  return user ? children : <div>Loading...</div>
}

export default AuthenticatedRoute
