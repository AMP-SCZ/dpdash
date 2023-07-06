import React, { Component } from 'react'
import io from 'socket.io-client'
import FileSaver from 'file-saver'

import Button from '@material-ui/core/Button'
import * as _ from 'lodash'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import DrawerComponent from '../components/Drawer'
import Drawer from '@material-ui/core/Drawer'

import SaveIcon from '@material-ui/icons/Save'
import CircularProgress from '@material-ui/core/CircularProgress'
import CheckIcon from '@material-ui/icons/Check'
import RefreshIcon from '@material-ui/icons/Refresh'
import Tooltip from '@material-ui/core/Tooltip'
import classNames from 'classnames'

import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import Functions from '@material-ui/icons/Functions'

import SelectConfigurationForm from '../components/SelectConfigurationForm'

import getCounts from '../fe-utils/countUtil'
import { fetchSubjects, fetchConfigurations } from '../fe-utils/fetchUtil'
import { preparePreferences } from '../fe-utils/preferencesUtil'
import basePathConfig from '../../server/configs/basePathConfig'
import { apiRoutes } from '../routes/routes'
import { withRouter } from '../hoc/withRouter'
import Matrix from '../components/Matrix.d3'
import deepEqual from 'deep-equal'
import GraphPageTable from '../components/GraphPageTable'
import api from '../api'

const basePath = basePathConfig || ''
const cardSize = 50

const socketAddress = `https://${window.location.hostname}${basePath}/dashboard`
const socket = io(socketAddress, {
  requestTimeout: 1250,
  randomizationFactor: 0,
  reconnectionDelay: 0,
  autoConnect: false,
})

class Graph extends Component {
  constructor(props) {
    const { preferences } = props.user

    super(props)
    this.state = {
      graphRendered: 0,
      graph: {
        configurations: [],
        consentDate: '2022-03-05',
        matrixData: [],
      },
      startFromTheLastDay: false,
      graphWidth: window.innerWidth,
      graphHeight: window.innerHeight,
      startDay: 1,
      lastDay: null,
      maxDay: 1,
      socketIOSubjectRoom: null,
      socketIOUserRoom: null,
      taskId: '',
      mobileOpen: false,
      totalSubjects: 0,
      totalStudies: 0,
      totalDays: 0,
      loading: false,
      success: false,
      openStat: false,
      configurationsList: [],
      preferences,
    }
  }

  downloadPng = () => {
    let SID = this.props.params.subject
    this.canvas.toBlob((blob) => {
      FileSaver.saveAs(blob, SID + '.png')
    })
  }

  handleResize = () => {
    this.setState({
      graphWidth: window.innerWidth,
      graphHeight: window.innerHeight - 30,
    })
  }

  resync = () => {
    window
      .fetch(this.state.socketIOSubjectRoom, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      })
      .then((response) => {
        if (response.status !== 201) {
          return
        }
        return response.json()
      })
      .then((response) => {
        this.setState({
          taskId: response.correlationId,
          loading: true,
          success: false,
        })
      })
  }
  closeStat = () => {
    this.setState({
      openStat: false,
    })
  }
  openStat = () => {
    this.setState({
      openStat: true,
    })
  }

  fetchGraph = () =>
    api.dashboard.load(this.props.params.study, this.props.params.subject)

  componentDidUpdate(_prevProps, prevState) {
    if (!deepEqual(prevState.graph.matrixData, this.state.graph.matrixData)) {
      this.renderMatrix()
    }

    if (prevState.graphRendered < this.state.graphRendered) {
      if (!this.el) {
        console.log('error')
        return
      }

      let updatedSvgElement = this.el.lastChild
      let svgString = new XMLSerializer().serializeToString(updatedSvgElement)
      let svgUrl =
        'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgString)

      let canvas = this.canvas
      canvas.width = updatedSvgElement.getBBox().width
      canvas.height = updatedSvgElement.getBBox().height

      // png conversion
      let img = new Image()
      let ctx = canvas.getContext('2d')

      img.onload = () => {
        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height,
          0,
          0,
          canvas.width,
          canvas.height
        )
      }
      img.src = svgUrl
    }
  }

  // eslint-disable-next-line react/no-deprecated
  async componentDidMount() {
    try {
      const [graphData, acl, configurations] = await Promise.all([
        this.fetchGraph(),
        fetchSubjects(),
        fetchConfigurations(this.props.user.uid),
      ])

      const maxObj = graphData.graph.matrixData.map((matrixData) =>
        _.maxBy(matrixData.data, ({ day }) => day)
      )

      this.setState({
        ...getCounts({ acl }),
        configurationsList: configurations.data,
        graph: graphData.graph,
        maxDay: maxObj.day || 1,
        socketIOSubjectRoom: `${basePath}/resync/${this.props.params.study}/${this.props.params.subject}`,
        socketIOUserRoom: this.props.user.uid,
      })
      this.renderMatrix()
      if (!HTMLCanvasElement.prototype.toBlob) {
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
          value: function (callback, type, quality) {
            var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
              len = binStr.length,
              arr = new Uint8Array(len)

            for (var i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i)
            }
            callback(new Blob([arr], { type: type || 'image/png' }))
          },
        })
      }
      socket.open()
    } catch (err) {
      console.error(err.message)
    }
  }
  renderMatrix = () => {
    if (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild)
    }
    if (
      !this.state.graph.matrixData ||
      Object.keys(this.state.graph.matrixData).length == 0
    ) {
      return
    }
    const matrixProps = {
      id: 'matrix',
      type: 'matrix',
      width: this.state.graphWidth,
      height: this.state.graphHeight,
      data: this.state.graph.matrixData,
      cardSize,
      study: this.props.params.study,
      subject: this.props.params.subject,
      consentDate: this.state.graph.consentDate,
      configuration: this.state.graph.configurations,
      startFromTheLastDay: this.state.startFromTheLastDay,
      startDay: this.state.startDay,
      lastDay: this.state.lastDay,
      maxDay: this.state.maxDay,
      user: this.props.user.uid,
    }
    this.graph = new Matrix(this.el, matrixProps)
    this.graph.create(this.state.graph.matrixData)
    this.setState({ graphRendered: this.state.graphRendered + 1 })
  }

  componentWillUnmount() {
    socket.disconnect()
    socket.close()
    window.removeEventListener('resize', this.handleResize)
  }

  handleDrawerToggle = () => {
    this.setState((state) => ({ mobileOpen: !state.mobileOpen }))
  }

  updateUserPreferences = async (configurationId) => {
    const { uid } = this.props.user
    const selectedUserPreference = preparePreferences(
      configurationId,
      this.state.preferences
    )

    return window
      .fetch(apiRoutes.preferences(uid), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          preferences: selectedUserPreference,
        }),
      })
      .then(() => this.fetchGraph())
      .then((graphData) => {
        this.setState({
          graph: graphData.graph,
          preferences: { ...this.state.preferences, config: configurationId },
        })
      })
  }
  render() {
    const { loading, success } = this.state
    const { classes, theme } = this.props
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
    })

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar
            variant="dense"
            style={{
              paddingLeft: '16px',
            }}
          >
            <IconButton
              color="default"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
            >
              <img
                width="24px"
                height="24px"
                src={`${basePath}/img/favicon.png`}
              />
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              style={{
                color: 'default',
                fontSize: '18px',
                letterSpacing: '1.25px',
                flexGrow: 1,
              }}
            >
              {this.props.params.subject + ' - ' + this.props.params.study}
            </Typography>
            <div className={classes.configDropDownContainer}>
              <Typography className={classes.dropDownText}>
                Configuration
              </Typography>
              <SelectConfigurationForm
                configurations={this.state.configurationsList}
                onChange={this.updateUserPreferences}
                currentPreference={this.state.preferences}
                classes={classes}
              />
            </div>
            <IconButton
              color="default"
              aria-label="Open Stat"
              onClick={this.openStat}
            >
              <Functions />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={this.state.mobileOpen}
          onClose={this.handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <DrawerComponent
            classes={this.props.classes}
            totalStudies={this.state.totalStudies}
            totalSubjects={this.state.totalSubjects}
            totalDays={this.state.totalDays}
            user={this.props.user}
          />
        </Drawer>
        <div
          className={classes.content}
          style={{
            padding: '12px',
            marginTop: '48px',
            overflowY: 'scroll',
          }}
        >
          <div className="Matrix">
            <div className="graph" ref={(el) => (this.el = el)} />
          </div>
          <div
            style={{
              right: 10,
              bottom: 10,
              position: 'fixed',
            }}
          >
            <Button
              variant="fab"
              onClick={this.downloadPng}
              id="downloadPng"
              ref="downloadPng"
              focusRipple={true}
              style={{
                marginBottom: '6px',
              }}
            >
              <Tooltip title="Download as PNG">
                <SaveIcon />
              </Tooltip>
            </Button>
            <div>
              <Button
                variant="fab"
                color="secondary"
                className={buttonClassname}
                onClick={this.resync}
              >
                <Tooltip title="Resync with the File System">
                  {success ? <CheckIcon /> : <RefreshIcon />}
                </Tooltip>
              </Button>
              {loading && (
                <CircularProgress size={68} className={classes.fabProgress} />
              )}
            </div>
          </div>
        </div>
        <Dialog
          modal={false}
          open={this.state.openStat}
          onClose={this.closeStat}
        >
          <DialogContent
            style={{
              padding: '0',
            }}
          >
            <GraphPageTable
              matrixData={this.state.graph.matrixData}
              maxDay={this.state.maxDay}
              theme={this.props.theme}
            />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.closeStat}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <canvas
          ref={(elem) => (this.canvas = elem)}
          style={{ display: 'none' }}
        ></canvas>
      </div>
    )
  }
}

export default withRouter(Graph)
