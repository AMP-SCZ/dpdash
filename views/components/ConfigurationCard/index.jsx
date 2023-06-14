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
import { UserModel } from '../../models'
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
  const { _id } = config
  const ownsConfig = user.uid === config['owner']
  const showTime = config.modified || config.created
  const localTime = moment.utc(showTime).local().format()
  const updated = moment(localTime).calendar()
  const copyConfig = async (configuration) => {
    const { _id, ...configAttributes } = configuration
    const newConfig = {
      ...configAttributes,
      owner: uid,
      readers: [uid],
      created: new Date().toUTCString(),
    }

    const res = await UserConfigurationsModel.create(uid, newConfig)
    if (res.status == 200) loadAllConfigurations(user.uid)
  }

  const removeConfig = async (configs, index, configID) => {
    const res = await UserConfigurationsModel.destroy(uid, configID)
    if (res.status === 200) {
      setState((prevState) => {
        return {
          ...prevState,
          configurations: update(configs, {
            $splice: [[index, 1]],
          }),
          snackTime: true,
        }
      })
      if (index === state.preferences['config']) {
        updateUserPreferences(0, 'index')
      }
    }
  }

  const updateConfiguration = async (configID, configAttributes) => {
    const res = UserConfigurationsModel.update(uid, configID, configAttributes)
    if (res.status === 200) loadAllConfigurations(user.uid)
  }

  const updateUserPreferences = async ({ _id }) => {
    const userAttributes = {
      preferences: {
        ...state.preferences,
        config: state.preferences.config === _id ? '' : _id,
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
  const changeDefaultConfig = (config) => updateUserPreferences(config)

  return (
    <Card style={{ margin: '3px' }}>
      <CardHeader
        title={config['owner']}
        subheader={updated}
        avatar={<ConfigCardAvatar config={config} currentUser={user} />}
        action={
          <IconButton
            onClick={() => {
              if (ownsConfig) {
                removeConfig(configs, item, _id)
              } else {
                const configAttributes = {
                  readers: config.readers.filter(
                    (reader) => reader !== user.uid
                  ),
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
          {config['name']}
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
                onClick={() =>
                  openSearch(config['_id'], config['readers'], config['owner'])
                }
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
                checked={config._id === preferences.config}
                onChange={() => changeDefaultConfig(config)}
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
