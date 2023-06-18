import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const RequireAuth = ({ children }) => {
  let location = useLocation()
  const user = useContext(AuthContext)

  if (!user) return <Navigate to="/" state={{ from: location }} replace />

  return children
}

export default RequireAuth
