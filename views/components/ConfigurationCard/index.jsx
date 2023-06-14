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

const ConfigurationCard = ({
  openSearch,
  loadAllConfigurations,
  user,
  setState,
  config,
  preferences,
  state,
}) => {
  const { uid } = user
  const { _id, name, owner, readers } = config
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
      setState((prevState) => {
        return {
          ...prevState,
          configurations: prevState.configurations.filter(
            ({ _id }) => _id !== configId
          ),
          snackTime: true,
        }
      })

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
        ...state.preferences,
        config: state.preferences.config === configId ? '' : configId,
      },
    }

    await UserModel.update(uid, userAttributes)

    setState((prevState) => {
      return {
        ...prevState,
        preferences: userAttributes.preferences,
        snackTime: true,
      }
    })
  }

  return (
    <Card style={{ margin: '3px' }}>
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
                  readers: config.readers.filter((reader) => reader !== uid),
                }
                updateConfiguration(_id, configAttributes)
              }
            }}
          >
            <Clear color="rgba(0, 0, 0, 0.54)" />
          </IconButton>
        }
      />
      <Divider />
      <div style={{ padding: '16px 24px' }}>
        <Typography variant="headline" component="h3">
          {name}
        </Typography>
        <Typography
          style={{
            color: 'rgba(0, 0, 0, 0.54)',
          }}
          component="p"
        >
          {config['type']}
        </Typography>
      </div>
      <CardActions>
        <div
          style={{
            padding: '0px',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          <div style={{ float: 'right' }}>
            {ownsConfig ? (
              <IconButton
                onClick={() => openNewWindow(routes.editConfiguration(_id))}
                iconStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                tooltipPosition="top-center"
                tooltip="Edit"
              >
                <Edit />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => openNewWindow(routes.viewConfiguration(_id))}
                iconStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                tooltipPosition="top-center"
                tooltip="View"
              >
                <FullView />
              </IconButton>
            )}
            {ownsConfig ? (
              <IconButton
                iconStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                tooltipPosition="top-center"
                tooltip="Share"
                onClick={() => openSearch(_id, readers, owner)}
              >
                <Share />
              </IconButton>
            ) : (
              <IconButton
                iconStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                tooltipPosition="top-center"
                tooltip="Duplicate"
                onClick={() => copyConfig(config)}
              >
                <Copy />
              </IconButton>
            )}
          </div>
          <FormControlLabel
            control={
              <Switch
                style={{
                  width: 'auto',
                }}
                labelStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                checked={checked}
                onChange={() => updateUserPreferences(_id)}
              />
            }
            label="Default"
          />
        </div>
      </CardActions>
    </Card>
  )
}

export default ConfigurationCard

/**
 *
 * Remove Config
 * Update Config to one selected by user
 * Disable config when config is not from owner
 * Update preferences
 */
