import React, { useContext } from 'react'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ColorLens from '@material-ui/icons/ColorLens'
import Person from '@material-ui/icons/Person'
import openNewWindow from '../fe-utils/windowUtil'
import { ThemeContext } from '../contexts/ThemeContext'
import basePathConfig from '../../server/configs/basePathConfig'

const basePath = basePathConfig || ''

const Header = ({ handleDrawerToggle, isAccountPage, title }) => {
  const { classes } = useContext(ThemeContext)
  return (
    <AppBar className={classes.appBar}>
      <Toolbar style={{ paddingLeft: '16px' }}>
        <IconButton
          color="default"
          aria-label="Open drawer"
          onClick={handleDrawerToggle}
          className={classes.navIconHide}
        >
          <img width="24px" height="24px" src={`${basePath}/img/favicon.png`} />
        </IconButton>
        <Typography variant="title" color="inherit" className={classes.title}>
          {title}
        </Typography>
        {!isAccountPage && (
          <IconButton onClick={() => openNewWindow(`${basePath}/u`)}>
            <Person color="primary" />
          </IconButton>
        )}
        {isAccountPage && (
          <IconButton onClick={() => openNewWindow(`${basePath}/u/configure`)}>
            <ColorLens color="primary" />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
