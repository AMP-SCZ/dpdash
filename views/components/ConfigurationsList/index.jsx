import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import 'whatwg-fetch'
import Select from 'react-select'

import AttachFile from '@material-ui/icons/AttachFile'
import Button from '@material-ui/core/Button'
import CancelIcon from '@material-ui/icons/Cancel'
import Chip from '@material-ui/core/Chip'
import ContentAdd from '@material-ui/icons/Add'
import Tooltip from '@material-ui/core/Tooltip'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import GridList from '@material-ui/core/GridList'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { fetchUsernames } from '../../fe-utils/fetchUtil'
import { routes } from '../../routes/routes'
import { UserConfigurationsModel, UserModel } from '../../models'
import ConfigurationCard from '../ConfigurationCard'

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  )
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  )
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  )
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  )
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  )
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      <MenuList>{props.children}</MenuList>
    </Paper>
  )
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
}
const ConfigurationsList = ({ user, classes, theme }) => {
  const { uid } = user
  const userMessageLength = user.message.length
  const [configurations, setConfigurations] = useState([])
  const [snackBars, setSnackBars] = useState({
    snackTime: false,
    uploadSnack: false,
  })
  const [sharedWithState, setSharedWith] = useState({
    selectedConfig: {},
    configOwner: '',
    shared: [],
    searchUsers: false,
    friends: [],
  })
  const [grid, setGrid] = useState({
    gridCols: null,
    gridWidth: 350,
    cellWidth: null,
  })
  const [preferences, setPreferences] = useState({})
  const minimumInnerWidth = 768
  const gridColumnsDivisor = 350

  useEffect(() => {
    loadUserNames()
    handleResize()
    loadAllConfigurations(uid)
    fetchPreferences(uid)

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (userMessageLength > 0) {
      setSnackBars((prevState) => {
        return {
          ...prevState,
          uploadSnack: true,
        }
      })
    }
  }, [userMessageLength])

  const loadUserNames = async () => {
    const usernames = await fetchUsernames()
    setSharedWith((prevstate) => {
      return {
        ...prevstate,
        friends: usernames.map((username) => ({
          value: username,
          label: username,
        })),
      }
    })
  }

  const handleResize = () => {
    if (window.innerWidth >= minimumInnerWidth) {
      const gridCols = Math.floor(window.innerWidth / gridColumnsDivisor)
      const cellWidth = window.innerWidth / gridCols

      setGrid((prevState) => {
        return {
          ...prevState,
          gridCols: gridCols,
          cellWidth,
        }
      })
    } else if (gridCols !== 1) {
      const cellWidth = window.innerWidth / 1

      setGrid((prevState) => {
        return {
          ...prevState,
          gridCols: 1,
          cellWidth,
        }
      })
    }
  }
  const fetchPreferences = async (userId) => {
    const { data } = await UserModel.findOne(userId)
    setPreferences(data.preferences)
  }

  const loadAllConfigurations = async (userId) => {
    const { data } = await UserConfigurationsModel.all(userId)

    setConfigurations(data)
  }

  const handleCrumbs = () => {
    setState((prevState) => {
      return {
        ...prevState,
        snackTime: false,
        uploadSnack: false,
      }
    })
  }

  const openSearchUsers = (config) => {
    const { _id, readers, owner } = config
    setSharedWith((prevState) => {
      return {
        ...prevState,
        searchUsers: true,
        selectedConfig: {
          _id,
        },
        shared: readers.map((friend) => ({
          label: friend,
          value: friend,
        })),
        configOwner: owner,
      }
    })
  }
  const closeSearchUsers = () => {
    setSharedWith((prevState) => {
      return {
        ...prevState,
        searchUsers: false,
        selectedConfig: {
          _id: '',
        },
        shared: [],
        configOwner: '',
      }
    })
  }

  const shareWithUsers = async () => {
    const { _id } = sharedWithState.selectedConfig
    const configAttributes = {
      readers: sharedWithState.shared.map((sharedWith) => sharedWith.value),
    }
    const response = await UserConfigurationsModel.update(
      uid,
      _id,
      configAttributes
    )
    if (response.status === 200) loadAllConfigurations(uid)

    closeSearchUsers()
  }

  const handleChange = (name) => (value) => {
    const names = value.map((o) => o.value)

    if (names.indexOf(uid) === -1) throw new Error('Unable to delete owner.')

    setSharedWith((prevState) => {
      return { ...prevState, [name]: value }
    })
  }

  const handleChangeFile = async (e) => {
    e.preventDefault()
    const file = e.target.files ? e.target.files[0] : ''
    const json = await new Response(file).json()
    const userAttributes = {
      owner: uid,
      readers: [uid],
      ...json,
    }
    const { status } = await UserConfigurationsModel.create(uid, userAttributes)

    if (status === 200) loadAllConfigurations(uid)
    else if (status === 400) window.location = routes.invalidConfiguration
    else window.location = routes.configurationError
  }

  const actions = [
    <Button
      onClick={closeSearchUsers}
      style={{
        color: '#5790bd',
      }}
      key="cancel"
    >
      Cancel
    </Button>,
    <Button
      variant="outlined"
      style={{
        borderColor: '#5790bd',
        paddingTop: '11px',
        color: '#ffffff',
        backgroundColor: '#5790bd',
        marginLeft: '12px',
      }}
      keyboardFocused={true}
      onClick={shareWithUsers}
      key="submit"
    >
      Submit
    </Button>,
  ]
  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  }

  const copyConfiguration = async (configuration) => {
    const { _id, ...configAttributes } = configuration
    const newConfig = {
      ...configAttributes,
      owner: uid,
      readers: [uid],
      created: new Date().toUTCString(),
    }
    const res = await UserConfigurationsModel.create(uid, newConfig)

    if (res.data) loadAllConfigurations(uid)
  }

  const removeConfiguration = async (configId) => {
    const res = await UserConfigurationsModel.destroy(uid, configId)
    if (res.status === 200) {
      loadAllConfigurations(uid)

      if (preferences.config === configId) updateUserPreferences(configId)
    }
  }

  const updateConfiguration = async (configId, configAttributes) => {
    const res = await UserConfigurationsModel.update(
      uid,
      configId,
      configAttributes
    )
    if (preferences.config === configId) updateUserPreferences(configId)
    if (res.data) loadAllConfigurations(uid)
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

  if (configurations?.length <= 0) return <div>Loading...</div>

  return (
    <div>
      <GridList
        className={classes.gridList}
        cols={grid.gridCols}
        cellHeight="auto"
      >
        {configurations.map((config) => {
          return (
            <ConfigurationCard
              classes={classes}
              config={config}
              openSearch={openSearchUsers}
              onUpdateConfig={updateConfiguration}
              onCopyConfig={copyConfiguration}
              onRemoveConfig={removeConfiguration}
              onUpdatePreferences={updateUserPreferences}
              preferences={preferences}
              user={user}
              width={grid.cellWidth}
            />
          )
        })}
      </GridList>
      <div className={classes.uploadActions}>
        <form>
          <input
            accept=".json"
            name="file"
            id="raised-button-file"
            multiple
            type="file"
            className={classes.hiddenInput}
            onChange={handleChangeFile}
          />
          <label htmlFor="raised-button-file">
            <Button
              component="span"
              variant="fab"
              focusRipple
              style={{
                marginBottom: '8px',
              }}
            >
              <Tooltip title="Upload configuration file">
                <AttachFile />
              </Tooltip>
            </Button>
          </label>
        </form>
        <Button
          variant="fab"
          color="secondary"
          href={routes.createConfiguration}
          focusRipple
        >
          <Tooltip title="Add a configuration manually">
            <ContentAdd />
          </Tooltip>
        </Button>
      </div>
      <Dialog
        open={sharedWithState.searchUsers}
        onClose={closeSearchUsers}
        fullScreen={true}
      >
        <DialogTitle
          id="alert-dialog-title"
          disableTypography={true}
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}
        >
          <Typography variant="title" className={classes.dialogText}>
            Share your configuration
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Select
            classes={classes}
            styles={selectStyles}
            textFieldProps={{
              label: 'Shared with',
              InputLabelProps: {
                shrink: true,
              },
            }}
            options={sharedWithState.friends}
            components={components}
            value={sharedWithState.shared}
            onChange={handleChange('shared')}
            placeholder="Shared with"
            isMulti
          />
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
      <Snackbar
        open={snackBars.snackTime}
        message="Your configuration has been updated."
        autoHideDuration={2000}
        onRequestClose={handleCrumbs}
      />
      <Snackbar
        open={snackBars.uploadSnack}
        message={user.message}
        autoHideDuration={2000}
        onRequestClose={handleCrumbs}
      />
    </div>
  )
}

export default ConfigurationsList
