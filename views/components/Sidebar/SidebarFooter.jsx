import React from 'react'
import {
  Typography,
  Card,
  Avatar,
  CardHeader,
  CardContent,
  CardActions,
  Button,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { routes } from '../../routes/routes'
import { FontSize14InRem } from '../../../constants'
import './SidebarFooter.css'

const SidebarFooter = ({ user, onLogout }) => {
  return (
    <Card sx={{ border: 0, boxShadow: 0, color: 'text.primary' }}>
      <CardHeader
        avatar={<Avatar alt={user.display_name[0]} src={user.icon} />}
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography sx={{ fontWeight: 600 }} variant="h5">
          {user.display_name}
        </Typography>
        <Typography
          sx={{ fontSize: FontSize14InRem, color: 'grey.A200' }}
          variant="subtitle1"
        >
          Title {user.title}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ fontSize: FontSize14InRem }}
        className="SidebarFooter_actions"
      >
        <Button
          variant="outlined"
          component={Link}
          to={routes.userAccount}
          sx={{ borderColor: 'text.primary', color: 'text.primary' }}
        >
          Edit Profile
        </Button>
        <Button
          variant="text"
          sx={{ color: 'text.primary' }}
          onClick={() => onLogout()}
        >
          Log Out
        </Button>
      </CardActions>
      <div className="SidebarFooter_version">
        <Typography variant="caption" sx={{ color: 'grey.A100' }}>
          DpDash v{process.env.DPDASH_VERSION}
        </Typography>
      </div>
    </Card>
  )
}

export default SidebarFooter
