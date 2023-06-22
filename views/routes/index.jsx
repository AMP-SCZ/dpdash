import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ConfigPage from '../pages/ConfigPage'
import LoginPage from '../pages/LoginPage'
import AuthenticatedRoute from '../hoc/AuthenticatedRoute'

const Router = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace={true} />} />
        <Route path="/login" element={<LoginPage setUser={props.setUser} />} />

        <Route
          element={
            <AuthenticatedRoute>
              <MainLayout classes={props.classes} theme={props.theme} />
            </AuthenticatedRoute>
          }
        >
          <Route path="configs" element={<ConfigPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
