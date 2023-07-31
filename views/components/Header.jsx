import React, { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core/'
import ColorLens from '@material-ui/icons/ColorLens'
import Person from '@material-ui/icons/Person'
import { ThemeContext } from '../contexts/ThemeContext'
import basePathConfig from '../../server/configs/basePathConfig'
import { routes } from '../routes/routes'

const basePath = basePathConfig || ''

const Header = ({ onClose, isAccountPage, title, onShow }) => {
  const { classes } = useContext(ThemeContext)
  const navigate = useNavigate()
  const { study, subject } = useParams()

  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <IconButton color="default" aria-label="Open drawer" onClick={onClose}>
          <img width="24px" height="24px" src={`${basePath}/img/favicon.png`} />
        </IconButton>
        <Typography variant="title" color="inherit" className={classes.title}>
          {onShow ? title : subject + ' - ' + study}
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
