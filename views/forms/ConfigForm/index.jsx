import React from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Divider } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import useArrayFormFields from '../../hooks/useArrayFormFields'
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

const ConfigForm = ({
  friendsList,
  initialValues,
  onSubmit,
  assessmentOptions,
  handleClearAssessments,
  handleAssessmentSearch,
  handleSubmitDraft,
}) => {
  const defaultFieldValue = UserConfigModel.defaultConfigValues

  const { handleSubmit, control, getValues, setValue } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  })
  const { fields, addNewField, removeField } = useArrayFormFields({
    control,
    name: 'config',
    defaultFieldValue,
  })
  const onCopy = (configCategoryIndex) =>
    addNewField(getValues(`config[${configCategoryIndex}]`))
  const handleClearUsers = () => setValue('readers', [])
  const handleSelectAllUsers = () => setValue('readers', friendsList)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ConfigForm">
      <ConfigFormFields
        control={control}
        fields={fields}
        onRemove={removeField}
        onCopy={onCopy}
        friendsList={friendsList}
        assessmentOptions={assessmentOptions}
        handleAssessmentSearch={handleAssessmentSearch}
        handleClearAssessments={handleClearAssessments}
        handleClearUsers={handleClearUsers}
        handleSelectAllUsers={handleSelectAllUsers}
      />
      <Divider>
        <Button
          variant="text"
          sx={{ color: 'primary.dark', px: '30px' }}
          onClick={() => addNewField()}
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
