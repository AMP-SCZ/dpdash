import React, { useState, useEffect } from 'react'
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import getCounts from './fe-utils/countUtil';
import { fetchSubjects, fetchStudyDetails, deleteDetails } from './fe-utils/fetchUtil';
import getDefaultStyles from './fe-utils/styleUtil';
import { studyDetailStyles } from './styles/study_details';
import { routes } from './routes/routes'


const StudyDetails = (props) => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [sideBarState, setSideBarState] = useState({totalDays: 0, totalStudies: 0, totalSubjects: 0})
  const [snackBarState, setSnackBarState] = useState({ errorOpen: false, message: '', autoHideDuration: 4000, })
  const [ studyDetailsList, setStudyDetailsList ] = useState([]);
  const toggleDrawer = () => setOpenDrawer(!openDrawer)
  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarState(state => ({errorOpen: false, ...state }))
  }
  const { user, classes } = props

  useEffect(() => {
    fetchSubjects().then(acl => {
      setSideBarState(getCounts({acl}))
      setLoading(false)
    })
    fetchStudyDetails().then(({ studyDetails }) => {
      setStudyDetailsList(studyDetails)
    })
  }, [])
  const handleChangeFile = async (e) => {
    const file = e.target.files ? e.target.files[0] : '';
    try {
      const upload = await new Response(file).json()
      const result = await window.fetch(`${routes.basePath}/api/v1/study-details/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({...upload, owner: user.uid })
      })
      console.log(result )
      if (result.status === 200) {
        console.log("THIS ONE")
        await fetchStudyDetails().then(({ studyDetails }) => {
          console.log('this is the ting')
          setStudyDetailsList(studyDetails)
        })
      }
      return result 
    } catch (error) {
      console.error(error);
      return error
    }
  }
  const removeDetails = async (id) => {
    try {
      const deleted = await deleteDetails(id)
      console.log(deleted )
      if (deleted.deletedCount > 0) {
        await fetchStudyDetails().then(({ studyDetails }) => {
          console.log('this is the ting')
          setStudyDetailsList(studyDetails)
        })
      }
    } catch (error) {
      console.log(error, "*****")
    }
  }
  return (
    <div className={classes.root}>
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
      {isLoading && (
        <div  className={`${classes.content} ${classes.contentPadded}`}>
          <Typography
            color="textSecondary"
            variant="body2"
            component="p"
          >
            Loading...
          </Typography>
        </div>
      )} 
      {!isLoading && (
        <>
          <div className={`${classes.content} ${classes.contentPadded}`}>
          
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Study</TableCell>
                  <TableCell align="center">Target Enrollment</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
             </TableHead>
             <TableBody>
               {studyDetailsList.length &&
                 studyDetailsList.map(({study, targetEnrollment, _id}) => (
                  <TableRow key={_id}>
                    <TableCell align="center">
                      {study}
                    </TableCell>
                    <TableCell align="center">
                      {targetEnrollment}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        type="button"
                        variant="text"
                        onClick={() => removeDetails(_id)}
                      >
                        <Delete />
                      </Button>
                    </TableCell>
                  </TableRow>
                 ))
               }
             </TableBody>
          </Table>
          </div>
          <div className={classes.uploadButtonContainer}>
            <input
                accept='.json'
                name='file'
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
                  marginBottom: '8px'
                }}
              >
            <Tooltip title="Upload Details">
                <Add />
            </Tooltip>
              </Button>
            </label>
          </div>
        </>
      )}     
      <Snackbar
        open={snackBarState.errorOpen}
        message={snackBarState.error}
        autoHideDuration={4000}
        onClose={handleCloseError}
      />
    </div>
  )
}

const styles = theme => ({
  ...getDefaultStyles(theme),
  ...studyDetailStyles(theme)
})

const mapStateToProps = (state) => ({
  user: state.user
})

export default compose(withStyles(styles, { withTheme:true }), connect(mapStateToProps))(StudyDetails)
