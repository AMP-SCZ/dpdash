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
} from '@material-ui/core'
import { Edit, Clear, Share } from '@material-ui/icons'
import FullView from '@material-ui/icons/AspectRatio'
import Copy from '@material-ui/icons/FileCopy'
import ConfigCardAvatar from '../ConfigurationCardAvatar'
import openNewWindow from '../../fe-utils/windowUtil'
import { UserModel, UserConfigurationsModel } from '../../models'
import { routes } from '../../routes/routes'
import { colors } from '../../../constants'

const ConfigurationCard = ({
  classes,
  openSearch,
  loadAllConfigurations,
  user,
  config,
  preferences,
  setPreferences,
  setConfigurations,
  width,
}) => {
  const { uid } = user
  const { _id, name, owner, readers, type } = config
  const ownsConfig = uid === owner
  const showTime = config.modified || config.created
  const localTime = moment.utc(showTime).local().format()
  const updated = moment(localTime).calendar()
  const checked = config._id === preferences.config

  const copyConfig = async (configuration) => {
    const { _id, ...configAttributes } = configuration
    const newConfig = {
      ...configAttributes,
      owner: uid,
      readers: [uid],
      created: new Date().toUTCString(),
    }
    const { status } = await UserConfigurationsModel.create(uid, newConfig)

    if (status === 200) loadAllConfigurations(uid)
  }

  const removeConfig = async (configId) => {
    const res = await UserConfigurationsModel.destroy(uid, configId)
    if (res.status === 200) {
      setConfigurations((configurations) =>
        configurations.filter(({ _id }) => _id !== configId)
      )

      if (checked) updateUserPreferences(configId)
    }
  }

  const updateConfiguration = async (configId, configAttributes) => {
    const { status } = await UserConfigurationsModel.update(
      uid,
      configId,
      configAttributes
    )

    switch (true) {
      case status === 200: {
        loadAllConfigurations(uid)
        break
      }
      case checked: {
        updateUserPreferences(configId)
        break
      }
      default:
        break
    }
  }

  const updateUserPreferences = async (configId) => {
    const userAttributes = {
      preferences: {
        ...preferences,
        config: preferences.config === configId ? '' : configId,
      },
    }

    await UserModel.update(uid, userAttributes)

    setPreferences(userAttributes.preferences)
  }

  return (
    <Card style={{ margin: '3px', width: `${width}px` }}>
      <CardHeader
        title={owner}
        subheader={updated}
        avatar={<ConfigCardAvatar config={config} currentUser={user} />}
        action={
          <IconButton
            onClick={() => {
              if (ownsConfig) {
                removeConfig(_id)
              } else {
                const configAttributes = {
                  readers: readers.filter((reader) => reader !== uid),
                }
                updateConfiguration(_id, configAttributes)
              }
            }}
          >
            <Clear color={colors.gray} />
          </IconButton>
        }
      />
      <Divider />
      <div className={classes.actionsDivider}>
        <Typography variant="headline" component="h3" noWrap>
          {name}
        </Typography>
        <Typography className={classes.textAndIcon} component="p">
          {type}
        </Typography>
      </div>
      <CardActions className={classes.actionsContainer}>
        <FormControlLabel
          control={
            <Switch
              labelStyle={classes.textAndIcon}
              checked={checked}
              onChange={() => updateUserPreferences(_id)}
            />
          }
          label="Default"
        />
        <div>
          {ownsConfig ? (
            <IconButton
              onClick={() => openNewWindow(routes.editConfiguration(_id))}
              iconStyle={classes.textAndIcon}
              tooltipPosition="top-center"
              tooltip="Edit"
            >
              <Edit />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => openNewWindow(routes.viewConfiguration(_id))}
              iconStyle={classes.textAndIcon}
              tooltipPosition="top-center"
              tooltip="View"
            >
              <FullView />
            </IconButton>
          )}
          {ownsConfig ? (
            <IconButton
              iconStyle={classes.textAndIcon}
              tooltipPosition="top-center"
              tooltip="Share"
              onClick={() => openSearch(config)}
            >
              <Share />
            </IconButton>
          ) : (
            <IconButton
              iconStyle={classes.textAndIcon}
              tooltipPosition="top-center"
              tooltip="Duplicate"
              onClick={() => copyConfig(config)}
            >
              <Copy />
            </IconButton>
          )}
        </div>
      </CardActions>
    </Card>
  )
}

export default ConfigurationCard
