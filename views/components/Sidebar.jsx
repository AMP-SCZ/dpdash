import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import DrawerComponent from './Drawer'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import { ThemeContext } from '../contexts/ThemeContext'
import { AuthContext } from '../contexts/AuthContext'
import api from '../api'
import { routes } from '../routes/routes'

const Sidebar = ({
  onClose,
  onPersist,
  sidebarOpen,
  totalDays,
  totalStudies,
  totalSubjects,
}) => {
  const { classes } = useContext(ThemeContext)
  const [user, setUser] = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.auth.logout()

      setUser(null)
      navigate(routes.login)
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <div className={classes.sideBar}>
      <Hidden>
        <Drawer
          variant={onPersist}
          anchor="left"
          open={sidebarOpen}
          onClose={onClose}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <DrawerComponent
            classes={classes}
            onLogout={handleLogout}
            totalStudies={totalStudies}
            totalSubjects={totalSubjects}
            totalDays={totalDays}
            user={user}
          />
        </Drawer>
      </Hidden>
    </div>
  )
}

export default Sidebar
