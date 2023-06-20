import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { routes } from '../../routes/routes'

const RequireAuth = ({ children }) => {
  const user = useContext(AuthContext)
  const location = useLocation()

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return children
}

export default RequireAuth

// const AuthenticatedRoute = ({ element, path }) => {
//   const [user, setUser] = useContext(UserContext)
//   const [loading, setLoading] = useState(true)
//   const userId = window.sessionStorage.getItem('userId')

//   React.useEffect(() => {
//     if (!user) {
//       API.user.load(userId).then(user => setUser(user)).finally(() => setLoading(false))
//     }

//   }, [])

//   if (!user && !loading) {
//     return <Navigate to={routes.login} />
//   }

//   return <Route path={path} element={element} />
// }

/**
 *
 *
 * Store the uid
 * getRequest to get the user from the uid
 * store in context
 * check that if a user enters their uid in session storage they can't bwe
 */
