import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import classNames from 'classnames'
import Snackbar from '@material-ui/core/Snackbar';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import getCounts from './fe-utils/countUtil';
import { fetchSubjects } from './fe-utils/fetchUtil';


const StudyDetails = (props) => {
  console.log(props)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [sideBarState, setSideBarState] = useState({totalDays: 0, totalStudies: 0, totalSubjects: 0})
  const [snackBarState, setSnackBarState] = useState({ errorOpen: false, message: '', autoHideDuration: 4000, })
  const [windowState, setWindowState] = useState({ width: 0, height: 0 })
  const toggleDrawer = () => setOpenDrawer(!openDrawer)
  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarState(state => ({errorOpen: false, ...state }))
  }
  const { user } = props

  useEffect(() => {
    fetchSubjects().then(acl => {
      setSideBarState(getCounts({acl}))
    })
  }, [])
  return (
    <div className="section">
      <Header
        handleDrawerToggle={toggleDrawer}
        title={'Study Details'}
        isAccountPage={false}
      />
      <Sidebar
        avatar={""}
        handleDrawerToggle={toggleDrawer}
        mobileOpen={openDrawer}
        totalDays={sideBarState.totalDays}
        totalStudies={sideBarState.totalStudies}
        totalSubjects={sideBarState.totalSubjects}
        user={user}
      />
      <>
        <div className={classNames('section-content', 'section-content-padded')}>
        Hi
        </div>
        </>
        <Snackbar
          open={snackBarState.errorOpen}
          message={snackBarState.error}
          autoHideDuration={4000}
          onClose={handleCloseError}
        />
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(StudyDetails)
