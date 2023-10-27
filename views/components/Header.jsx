import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material/'
import ColorLens from '@mui/icons-material/ColorLens'
import Person from '@mui/icons-material/Person'
import { ThemeContext } from '../contexts/ThemeContext'
import { routes } from '../routes/routes'

const Header = ({ onToggleSidebar, isAccountPage, title }) => {
  const { classes } = useContext(ThemeContext)
  const navigate = useNavigate()

  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="default"
          aria-label="Open drawer"
          onClick={onToggleSidebar}
        >
          <img width="24px" height="24px" src={`/img/favicon.png`} />
        </IconButton>
        <Typography variant="title" color="inherit" className={classes.title}>
          {title}
        </Typography>
        {isAccountPage ? (
          <IconButton onClick={() => navigate(routes.configs)}>
            <ColorLens color="primary" />
          </IconButton>
        ) : (
          <IconButton onClick={() => navigate(routes.accountPage)}>
            <Person color="primary" />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
