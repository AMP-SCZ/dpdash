import React, { useState, useEffect } from 'react'

import { Box, Typography } from '@mui/material'
import { useParams, useOutletContext } from 'react-router-dom'

import api from '../api'
import { colorList } from '../fe-utils/colorList'
import ConfigForm from '../forms/ConfigForm'
import { UserConfigModel, UsersModel } from '../models'

const colors = colorList()

const EditConfigPage = () => {
  const { user, setNotification, users } = useOutletContext()
  const [assessmentOptions, setAssessmentOptions] = useState([])
  const [initialValues, setInitialValues] = useState({})
  const [loading, setLoading] = useState(true)
  const { config_id } = useParams()
  const friendsList = UsersModel.createUserFriendList(users, user)
  const { uid } = user

  const handleSubmitPublish = async (formValues) => {
    try {
      const updatedConfiguration = UserConfigModel.publishConfig(
        formValues,
        colors,
        uid
      )
      await api.userConfigurations.update(uid, config_id, updatedConfiguration)

      setNotification({
        open: true,
        message: 'Configuration Added',
      })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const fetchCurrentConfig = async () => {
    try {
      const data = await api.userConfigurations.findOne(uid, config_id)

      return UserConfigModel.processConfigToFormFields(data, colors)
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
      })
    }
  }
  const handleAssessmentSearch = async (e) => {
    const assessments = await api.assessments.loadAll({
      search: e.target.value,
    })
    const assessmentMenuOptions = assessments.map(({ name }) => name)

    setAssessmentOptions(assessmentMenuOptions)
  }

  const handleClearAssessments = async () => setAssessmentOptions([])
  useEffect(() => {
    fetchCurrentConfig().then((values) => {
      setInitialValues(values)
      setLoading(false)
    })
  }, [])
  const handleSubmitDraft = async (formValues) => {
    const newConfigurationAttributes = UserConfigModel.saveAsDraft(
      formValues,
      colors,
      uid
    )
    await api.userConfigurations.update(
      uid,
      config_id,
      newConfigurationAttributes
    )

    setNotification({
      open: true,
      message: 'Draft saved',
    })
  }
  if (loading) return <div>Depending on the size, this may take a while...</div>

  return (
    <Box sx={{ p: '30px' }}>
      <Typography variant="h6">Edit Configuration</Typography>
      <ConfigForm
        assessmentOptions={assessmentOptions}
        colors={colors}
        friendsList={friendsList}
        onSubmit={handleSubmitPublish}
        initialValues={initialValues}
        handleClearAssessments={handleClearAssessments}
        handleAssessmentSearch={handleAssessmentSearch}
        handleSubmitDraft={handleSubmitDraft}
      />
    </Box>
  )
}

export default EditConfigPage
