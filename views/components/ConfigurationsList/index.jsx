import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import 'whatwg-fetch'
import Select from 'react-select'
import update from 'immutability-helper'

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
import { apiRoutes, routes } from '../../routes/routes'
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
  const [state, setState] = useState({
    user: {},
    preferences: {},
    configurations: [],
    searchUsers: false,
    friends: [],
    shared: [],
    snackTime: false,
    uploadSnack: false,
    selectedConfig: {},
    configOwner: '',
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
    if (user.message.length > 0) {
      setState((prevState) => {
        return {
          ...prevState,
          uploadSnack: true,
        }
      })
    }
  }, [userMessageLength])

  const loadUserNames = async () => {
    try {
      const usernames = await fetchUsernames()
      setState((prevstate) => {
        return {
          ...prevstate,
          friends: usernames.map((username) => ({
            value: username,
            label: username,
          })),
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  const handleResize = () => {
    if (window.innerWidth >= minimumInnerWidth) {
      const gridCols = Math.floor(window.innerWidth / gridColumnsDivisor)
      const cellWidth = window.innerWidth / gridCols
      console.log(cellWidth)
      setGrid((prevState) => {
        return {
          ...prevState,
          gridCols: gridCols,
          cellWidth,
        }
      })
    } else if (gridCols !== 1) {
      const cellWidth = window.innerWidth / 1
      console.log(cellWidth)

      setGrid((prevState) => {
        return {
          ...prevState,
          gridCols: 1,
          cellWidth,
        }
      })
    }
  }
  const fetchPreferences = async (uid) => {
    const { data } = await UserModel.show(uid)
    setPreferences(data.preferences)
  }

  const loadAllConfigurations = async (uid) => {
    const { data } = await UserConfigurationsModel.all(uid)
    setState((prevState) => {
      return {
        ...prevState,
        configurations: data,
      }
    })
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

  const openSearchUsers = (configID, shared, owner) => {
    setState((prevState) => {
      return {
        ...prevState,
        searchUsers: true,
        selectedConfig: {
          _id: configID,
        },
        shared: shared.map((friend) => ({
          label: friend,
          value: friend,
        })),
        configOwner: owner,
      }
    })
  }
  const closeSearchUsers = () => {
    setState((prevState) => {
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
  const shareWithUsers = () => {
    const { _id } = state.selectedConfig
    const configAttributes = {
      readers: state.shared.map((sharedWith) => sharedWith.value),
    }

    return window
      .fetch(apiRoutes.configurations.userConfiguration(user.uid, _id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(configAttributes),
      })
      .then((response) => {
        if (response.status === 200) {
          setState((prevState) => {
            return {
              ...prevState,
              configurations: update(state.configurations, {
                [state.selectedConfig['index']]: {
                  ['readers']: {
                    $set: state.shared.map((o) => {
                      return o.value
                    }),
                  },
                },
              }),
            }
          })
        }
        closeSearchUsers()
      })
  }
  const handleChange = (name) => (value) => {
    let uid = user.uid
    let names = value.map((o) => {
      return o.value
    })
    if (names.indexOf(uid) === -1) {
      throw new Error('Unable to delete owner.')
    }
    setState((prevState) => {
      return { ...prevState, [name]: value }
    })
  }
  const handleChangeFile = (e) => {
    e.preventDefault()
    const file = e.target.files ? e.target.files[0] : ''
    new Response(file)
      .json()
      .then(async (json) => {
        const res = await window.fetch(
          apiRoutes.configurations.configurationFileUpload(user.uid),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify(json),
          }
        )
        if (res.status === 200) {
          window.location = routes.configurationSuccess
        } else if (res.status === 400) {
          window.location = routes.invalidConfiguration
        } else {
          window.location = routes.configurationError
        }
      })
      .catch((err) => {
        throw new Error(err)
      })
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

  if (state?.configurations?.length <= 0) return <div>Loading...</div>

  return (
    <div>
      <GridList
        style={{
          padding: '2px',
          overflowY: 'auto',
          marginBottom: '128px',
        }}
        cols={state.gridCols}
        cellHeight="auto"
      >
        {state.configurations.map((config) => {
          return (
            <ConfigurationCard
              width={grid.cellWidth}
              config={config}
              user={user}
              setState={setState}
              loadAllConfigurations={loadAllConfigurations}
              openSearch={openSearchUsers}
              preferences={preferences}
              state={state}
            />
          )
        })}
      </GridList>
      <div
        style={{
          right: 4,
          bottom: 4,
          position: 'fixed',
        }}
      >
        <form>
          <input
            accept=".json"
            name="file"
            id="raised-button-file"
            multiple
            type="file"
            style={{ display: 'none' }}
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
        open={state.searchUsers}
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
          <Typography
            variant="title"
            style={{
              color: '#ffffff',
            }}
          >
            Share your configuration
          </Typography>
        </DialogTitle>
        <DialogContent
          style={{
            padding: '24px',
            overflowY: 'visible',
          }}
        >
          <Select
            classes={classes}
            styles={selectStyles}
            textFieldProps={{
              label: 'Shared with',
              InputLabelProps: {
                shrink: true,
              },
            }}
            options={state.friends}
            components={components}
            value={state.shared}
            onChange={handleChange('shared')}
            placeholder="Shared with"
            isMulti
          />
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
      <Snackbar
        open={state.snackTime}
        message="Your configuration has been updated."
        autoHideDuration={2000}
        onRequestClose={handleCrumbs}
      />
      <Snackbar
        open={state.uploadSnack}
        message={user.message}
        autoHideDuration={2000}
        onRequestClose={handleCrumbs}
      />
    </div>
  )
}

export default ConfigurationsList
