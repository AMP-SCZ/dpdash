import React, { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

import withRoot from './withRoot'
import MainLayout from './layouts/MainLayout'
import ConfigPage from './pages/ConfigPage'
import { styles } from './styles'
import LoginPage from './pages/LoginPage'
import { AuthContext } from './contexts/AuthContext'
import AuthenticatedRoute from './components/hoc/AuthenticatedRoute'
import MainPage from './pages/MainPage'
import AccountPage from './pages/AccountPage'
import ChartsPage from './pages/ChartsPage'
import NewChartPage from './pages/NewChartPage'
import EditChartPage from './pages/EditChartPage'
import ViewChartPage from './pages/ViewChartPage'
import AdminPage from './pages/AdminPage'
import GraphPage from './pages/GraphPage'
import EditConfigPage from './pages/EditConfigPage'

import 'react-virtualized/styles.css'
import RegisterPage from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

const App = (props) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  return (
    <AuthContext.Provider value={[user, setUser]}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace={true} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route
          path="/register"
          element={<RegisterPage navigate={navigate} />}
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="dashboard/:study/:subject"
          element={
            <GraphPage
              user={user}
              classes={props.classes}
              theme={props.theme}
            />
          }
        />

        <Route
          element={
            <AuthenticatedRoute>
              <MainLayout
                classes={props.classes}
                theme={props.theme}
                navigate={navigate}
              />
            </AuthenticatedRoute>
          }
        >
          <Route path="configs" element={<ConfigPage />} />
          <Route
            path="main"
            element={
              <MainPage
                user={user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
          <Route
            path="user-account"
            element={
              <AccountPage
                user={user}
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
                navigate={navigate}
                theme={props.theme}
                user={user}
              />
            }
          />
          <Route
            path="charts/new"
            element={
              <NewChartPage
                user={user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
          <Route
            path="charts/:chart_id/edit"
            element={
              <EditChartPage
                user={user}
                classes={props.classes}
                theme={props.theme}
                navigate={navigate}
              />
            }
          />
          <Route
            path="charts/:chart_id"
            element={
              <ViewChartPage
                user={user}
                classes={props.classes}
                theme={props.theme}
                navigate={navigate}
              />
            }
          />
          <Route
            path="admin"
            element={
              <AdminPage
                user={user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
          <Route
            path="config/:config_id/edit"
            element={
              <EditConfigPage
                user={user}
                classes={props.classes}
                theme={props.theme}
              />
            }
          />
        </Route>
      </Routes>
    </AuthContext.Provider>
  )
}

export default withRoot(withStyles(styles, { withTheme: true })(App))
