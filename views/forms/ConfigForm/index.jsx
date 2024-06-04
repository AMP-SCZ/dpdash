import React from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Divider } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { colorList } from '../../fe-utils/colorList'
import { UserConfigModel } from '../../models'
import ConfigFormFields from '../ConfigFields'
import ConfigurationFormActions from '../ConfigFormActions'

import './ConfigForm.css'

const schema = yup.object({
  configName: yup.string().required(),
  configType: yup.string().required(),
  description: yup.string(),
  readers: yup.array().of(
    yup.object({
      value: yup.string(),
      label: yup.string(),
      isFixed: yup.boolean(),
    })
  ),
  public: yup.boolean(),
  owner: yup.string().required(),
  config: yup.array().of(
    yup.object({
      category: yup.string(),
      analysis: yup.string(),
      variable: yup.string(),
      label: yup.string(),
      color: yup.number(),
      min: yup.string(),
      max: yup.string(),
      text: yup.boolean(),
    })
  ),
  status: yup.number(),
})
const colors = colorList()

const ConfigForm = ({
  friendsList,
  initialValues,
  onSubmit,
  assessmentOptions,
  handleClearAssessments,
  handleAssessmentSearch,
}) => {
  const { handleSubmit, control, getValues, setValue, watch } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  })
  const handleClearUsers = () => setValue('readers', [])
  const handleSelectAllUsers = () => setValue('readers', friendsList)
  const addNewSection = () => {
    const currentColors = getValues('config')
    const unusedThemes = colors.filter(function ({ label }) {
      return !Object.keys(currentColors).some(function (key) {
        return label.join('-') === key
      })
    })

    setValue('config', {
      ...currentColors,
      [unusedThemes[0].label.join('-')]: [
        UserConfigModel.defaultConfigValues({ color: unusedThemes[0].value }),
      ],
    })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ConfigForm">
      <ConfigFormFields
        colors={colors}
        control={control}
        onRemove={{}}
        onCopy={{}}
        friendsList={friendsList}
        assessmentOptions={assessmentOptions}
        handleAssessmentSearch={handleAssessmentSearch}
        handleClearAssessments={handleClearAssessments}
        handleClearUsers={handleClearUsers}
        handleSelectAllUsers={handleSelectAllUsers}
        initialValues={watch('config')}
      />
      <Divider>
        <Button
          variant="text"
          sx={{ color: 'primary.dark', px: '30px' }}
          onClick={() => addNewSection()}
        >
          + Add new row section
        </Button>
      </Divider>
      <ConfigurationFormActions
        onSubmitDraft={() => console.log('submit draft')}
      />
    </form>
  )
}

export default ConfigForm
