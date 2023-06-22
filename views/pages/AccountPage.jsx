import React, { Component } from 'react'
import 'whatwg-fetch'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import ButtonBase from '@material-ui/core/ButtonBase'
import Snackbar from '@material-ui/core/Snackbar'

import getAvatar from '../fe-utils/avatarUtil'
import getCounts from '../fe-utils/countUtil'
import { fetchSubjects } from '../fe-utils/fetchUtil'

import { apiRoutes } from '../routes/routes'

class AccountPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      _id: '',
      uid: '',
      display_name: '',
      title: '',
      department: '',
      company: '',
      mail: '',
      ldap: '',
      icon: '',
      totalStudies: 0,
      totalSubjects: 0,
      totalDays: 0,
      snackTime: false,
      mobileOpen: false,
    }
  }
  async componentDidMount() {
    try {
      const acl = await fetchSubjects()
      this.setState(getCounts({ acl }))
      this.fetchUserInfo(this.props.user.uid)
      this.setState({
        user: this.props.user,
      })
    } catch (err) {
      console.error(err.message)
    }
  }
  componentWillMount() {
    this.fetchUserInfo(this.props.user.uid)
  }
  handleDrawerToggle = () => {
    this.setState((state) => ({ mobileOpen: !state.mobileOpen }))
  }
  fetchUserInfo = (uid) => {
    return window
      .fetch(apiRoutes.users.user(uid), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      })
      .then((response) => {
        if (response.status !== 200) {
          return
        }
        return response.json()
      })
      .then(({ data }) => {
        this.setState({
          _id: data['_id'],
          uid: data['uid'],
          display_name: data['display_name'],
          title: data['title'],
          department: data['department'],
          company: data['company'],
          mail: data['mail'],
          ldap: data['ldap'],
          icon: data['icon'],
        })
      })
  }
  handleChange = (event, key) => {
    this.setState({
      [key]: event.target.value,
    })
  }
  editUserInfo = () => {
    const { uid } = this.state
    const user = {}
    user['uid'] = uid
    user['display_name'] = this.state.display_name
    user['title'] = this.state.title
    user['department'] = this.state.department
    user['company'] = this.state.company
    user['mail'] = this.state.mail
    user['icon'] = this.state.icon

    return window
      .fetch(apiRoutes.users.user(uid), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(user),
      })
      .then((response) => {
        return response
      })
      .then((data) => {
        this.setState({
          snackTime: true,
        })
        return data
      })
      .catch((error) => {
        return error
      })
  }
  scaleDownImage = () => {
    let image = this.refs.userSubmittedAvatar
    let canvas = this.refs.canvas
    let ctx = canvas.getContext('2d')

    canvas.height = 200
    canvas.width = 200

    let sx = 0
    let sy = (image.naturalHeight - image.naturalWidth) / 2
    let swidth = image.naturalWidth
    let sheight = image.naturalWidth

    if (image.naturalHeight < image.naturalWidth) {
      sy = 0
      sx = (image.naturalWidth - image.naturalHeight) / 2
      swidth = image.naturalHeight
      sheight = image.naturalHeight
    }

    let x = 0
    let y = 0

    ctx.drawImage(image, sx, sy, swidth, sheight, x, y, 200, 200)

    let dataURL = canvas.toDataURL('image/png')
    this.setState({ icon: dataURL }, () => {
      this.editUserInfo()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    })
  }
  handleChangeIcon = (event) => {
    let accepted_files = event.target.files
    if (accepted_files.length > 0) {
      let reader = new FileReader()
      reader.readAsDataURL(accepted_files[0])
      reader.onload = (e) => {
        this.setState({
          baseURL: e.target.result,
        })
      }
    }
  }
  handleCrumbs = () => {
    this.setState({
      snackTime: false,
    })
  }
  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <div
          className={classes.content}
          style={{
            height: '100%',
            padding: '12px',
            overflow: 'scroll',
          }}
        >
          <div
            style={{
              width: '100%',
              marginBottom: '12px',
            }}
          >
            <input
              accept="image/*"
              id="raised-button-file"
              multiple
              type="file"
              style={{ display: 'none' }}
              onChange={this.handleChangeIcon}
            />
            <label htmlFor="raised-button-file">
              <ButtonBase
                component="span"
                style={{
                  width: '100%',
                  margin: '0 auto',
                }}
                focusRipple
              >
                <Tooltip title="Edit Profile Photo">
                  {getAvatar({
                    user: {
                      icon: this.state.icon,
                      name: this.state.display_name,
                      uid: this.state.uid,
                    },
                  })}
                </Tooltip>
              </ButtonBase>
            </label>
          </div>
          <TextField
            style={{
              marginTop: '8px',
              marginBottom: '8px',
            }}
            label="Full Name"
            name="display_name"
            value={this.state.display_name}
            onChange={(e) => this.handleChange(e, 'display_name')}
            fullWidth={true}
          />
          <TextField
            style={{
              marginTop: '8px',
              marginBottom: '8px',
            }}
            label="Email"
            type="email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            name="email"
            value={this.state.mail}
            fullWidth={true}
            onChange={(e) => this.handleChange(e, 'mail')}
          />
          <TextField
            style={{
              marginTop: '8px',
              marginBottom: '8px',
            }}
            label="Title"
            name="title"
            value={this.state.title}
            fullWidth={true}
            onChange={(e) => this.handleChange(e, 'title')}
          />
          <TextField
            style={{
              marginTop: '8px',
              marginBottom: '8px',
            }}
            label="Department"
            name="department"
            value={this.state.department}
            fullWidth={true}
            onChange={(e) => this.handleChange(e, 'department')}
          />
          <TextField
            style={{
              marginTop: '8px',
              marginBottom: '8px',
            }}
            label="Company"
            name="company"
            value={this.state.company}
            fullWidth={true}
            onChange={(e) => this.handleChange(e, 'company')}
          />
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              variant="outlined"
              type="submit"
              onClick={this.editUserInfo}
              style={{
                borderColor: '#5790bd',
                paddingTop: '11px',
                color: '#ffffff',
                backgroundColor: '#5790bd',
                marginLeft: '12px',
              }}
            >
              Save
            </Button>
          </div>
        </div>
        <Snackbar
          open={this.state.snackTime}
          message="Your account has been updated."
          autoHideDuration={2000}
          onRequestClose={this.handleCrumbs}
        />
        <img
          style={{
            display: 'none',
          }}
          ref="userSubmittedAvatar"
          onLoad={this.scaleDownImage}
          src={this.state.baseURL}
        />
        <canvas ref="canvas" style={{ display: 'none' }}></canvas>
      </div>
    )
  }
}

export default AccountPage
