import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Form from './components/Form'

import BarChartFields from './forms/BarChartFields'

import getCounts from './fe-utils/countUtil'
import getAvatar from './fe-utils/avatarUtil'
import { fetchSubjects, createChart } from './fe-utils/fetchUtil'
import getDefaultStyles from './fe-utils/styleUtil'
import { chartStyles } from './styles/chart_styles'

const NewChart = ({ user, classes }) => {
  const [formValues, setFormValues] = useState({})
  const [fieldLabelValueMap, setFieldLabelValueMap] = useState([])
  const [openDrawer, setOpenDrawer] = useState(false)
  const [sideBarState, setSideBarState] = useState({ totalDays: 0, totalStudies: 0, totalSubjects: 0 })
  const [avatar, setAvatar] = useState('')

  const toggleDrawer = () => setOpenDrawer(!openDrawer)
  const updateFormValues = (e,) => setFormValues({...formValues, [e.target.name]: e.target.value})
  const addValueAndLabelField = () => setFieldLabelValueMap(prevState => [{ value: '', label: '' }, ...prevState ])
  const removeValueAndLabelField = (id) => setFieldLabelValueMap(prevState => [...prevState.filter((_, index) => index !== id)])
  const handleValueAndLabelFieldUpdate = (e, id) => setFieldLabelValueMap(prevState => 
    [...prevState
      .map((field, idx) => 
        id === idx
        ? 
          ({ ...field, [e.target.name]: e.target.value }) 
        : 
          ({...field})
        )
      ])
  const handleSubmit = async (e) => {
    e.preventDefault()
    const values = { ...formValues, fieldLabelValueMap: fieldLabelValueMap }
    await createChart(values)
  }

  useEffect(() => {
    fetchSubjects().then(acl => {
      setSideBarState(getCounts({ acl }))
    })
    setAvatar(getAvatar({ user: user }))
  }, [])

  return (
    <div className={ classes.root }>
      <Header
        handleDrawerToggle={toggleDrawer}
        title='Create a New Chart'
        isAccountPage={false}
      />
      <Sidebar
        avatar={avatar}
        handleDrawerToggle={toggleDrawer}
        mobileOpen={openDrawer}
        totalDays={sideBarState.totalDays}
        totalStudies={sideBarState.totalStudies}
        totalSubjects={sideBarState.totalSubjects}
        user={user}
      />
      <>
        <div className={`${ classes.content } ${ classes.contentPadded }`}>
          <Form handleSubmit={handleSubmit}>
            <BarChartFields 
              classes={classes} 
              updateFormValues={updateFormValues} 
              formValues={formValues}
              fieldLabelValueMap={fieldLabelValueMap}
              addValueAndLabelField={addValueAndLabelField}
              removeField={removeValueAndLabelField}
              updateFieldValues={handleValueAndLabelFieldUpdate}
            />
            <div className={classes.submitButtonContainer}>
              <Button
                type='submit'
                variant='raised'
                className={classes.textButton}
                onClick={handleSubmit}
              >
                Submit Form
              </Button>
            </div>
          </Form>
        </div>
      </>
    </div>
  )
}

const styles = theme => ({
  ...getDefaultStyles(theme),
  ...chartStyles(theme)
})

const mapStateToProps = (state) => ({
  user: state.user
})

export default compose(withStyles(styles, { withTheme:true }), connect(mapStateToProps))(NewChart)
