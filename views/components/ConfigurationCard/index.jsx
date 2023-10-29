import React from 'react'
import moment from 'moment'
import {
  Card,
  CardHeader,
  Divider,
  Typography,
  CardActions,
  Switch,
  IconButton,
  FormControlLabel,
  Tooltip,
} from '@mui/material'
import { Edit, Clear, Share } from '@mui/icons-material'
import FullView from '@mui/icons-material/AspectRatio'
import Copy from '@mui/icons-material/FileCopy'
import ConfigCardAvatar from '../ConfigurationCardAvatar'

const ConfigurationCard = ({
  config,
  onCopyConfig,
  onOpen,
  onEditConfig,
  onRemoveOrUpdateConfig,
  onUpdatePreferences,
  onViewConfig,
  user,
  width,
}) => {
  const { uid, preferences } = user
  const { _id, name, owner, type } = config
  const ownsConfig = uid === owner
  const showTime = config.modified || config.created
  const localTime = moment.utc(showTime).local().format()
  const updated = moment(localTime).calendar()
  const checked = config._id === preferences.config
  return (
    <Card style={{ margin: '3px', width: `${width}px` }}>
      <CardHeader
        title={owner}
        subheader={updated}
        avatar={<ConfigCardAvatar config={config} currentUser={user} />}
        action={
          <IconButton onClick={() => onRemoveOrUpdateConfig(ownsConfig, _id)}>
            <Clear />
          </IconButton>
        }
      />
      <Divider />
      <div>
        <Typography variant="headline" component="h3" noWrap>
          {name}
        </Typography>
        <Typography component="p">{type}</Typography>
      </div>
      <CardActions>
        <FormControlLabel
          control={
            <Switch
              checked={checked}
              onChange={() => onUpdatePreferences(_id)}
            />
          }
          label="Default"
        />
        <div>
          {ownsConfig ? (
            <>
              <Tooltip title="Edit" placement="top">
                <IconButton onClick={() => onEditConfig(_id)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share" placement="top">
                <IconButton onClick={() => onOpen(config)}>
                  <Share />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              {' '}
              <Tooltip title="View" placement="top">
                <IconButton onClick={() => onViewConfig(_id)}>
                  <FullView />
                </IconButton>
              </Tooltip>
              <Tooltip title="Duplicate" placement="top">
                <IconButton onClick={() => onCopyConfig(config)}>
                  <Copy />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
      </CardActions>
    </Card>
  )
}
export default ConfigurationCard
