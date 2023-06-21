import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ConfigPage from '../pages/ConfigPage'
import LoginPage from '../pages/LoginPage'
import AuthenticatedRoute from '../hoc/AuthenticatedRoute'
import MainPage from '../pages/MainPage'
import AccountPage from '../pages/AccountPage'
import ChartsPage from '../pages/ChartsPage'
import NewChartPage from '../pages/NewChartPage'
import EditChartPage from '../pages/EditChartPage'
import ViewChartPage from '../pages/ViewChartPage'
import AdminPage from '../pages/AdminPage'
import GraphPage from '../pages/GraphPage'
import EditConfigPage from '../pages/EditConfigPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import RegisterPage from '../pages/RegisterPage'

const Router = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace={true} />} />
        <Route path="/login" element={<LoginPage setUser={props.setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="dashboard/:study/:subject"
          element={
            <GraphPage
              user={props.user}
              classes={props.classes}
              theme={props.theme}
            />
          }
        />

        <Route
          element={
            <AuthenticatedRoute>
              <MainLayout classes={props.classes} theme={props.theme} />
            </AuthenticatedRoute>
          }
        >
          <Route path="configs" element={<ConfigPage />} />
          <Route
            path="main"
            element={
              <MainPage
                user={props.user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
          <Route
            path="user-account"
            element={
              <AccountPage
                user={props.user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
          <Route
            path="charts"
            element={
              <ChartsPage
                classes={props.classes}
                theme={props.theme}
                user={props.user}
              />
            }
          />
          <Route
            path="charts/new"
            element={
              <NewChartPage
                user={props.user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
          <Route
            path="charts/:chart_id/edit"
            element={
              <EditChartPage
                user={props.user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
          <Route
            path="charts/:chart_id"
            element={
              <ViewChartPage
                user={props.user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
          <Route
            path="admin"
            element={
              <AdminPage
                user={props.user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
          <Route
            path="config/:config_id/edit"
            element={
              <EditConfigPage
                user={props.user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
