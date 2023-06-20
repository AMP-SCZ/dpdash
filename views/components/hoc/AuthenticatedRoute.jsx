import React, { useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { UserModel } from '../../models'

const AuthenticatedRoute = ({ children }) => {
  const [user, setUser] = useContext(AuthContext)
  const navigate = useNavigate()
  const userId = window.sessionStorage.getItem('userId')

  const fetchUser = async () => {
    const res = await UserModel.findOne(userId)
    if (res.status === 200) setUser(res.data)
    else navigate('/login')
  }

  useEffect(() => {
    if (!user) fetchUser()
  }, [])

  return user ? children : <div>Loading...</div>
}

export default AuthenticatedRoute
