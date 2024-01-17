import React from 'react'
import ConfigAssessmentFormFields from '../ConfigAssessmentFormFields'
import ConfigTypeFormFields from '../ConfigTypeFormFields'

const ConfigFormFields = ({
  control,
  colors,
  fields,
  friendsList,
  onCopy,
  onRemove,
}) => {
  return (
    <React.Fragment>
      <ConfigTypeFormFields control={control} friendsList={friendsList} />
      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexFlow: 'wrap',
        }}
      >
        {fields.map((field, index) => {
          const { id, ...rest } = field

          return (
            <ConfigAssessmentFormFields
              colors={colors}
              control={control}
              index={index}
              id={id}
              key={id}
              onCopy={onCopy}
              onRemove={onRemove}
              {...rest}
            />
          )
        })}
      </div>
    </React.Fragment>
  )
}

export default ConfigFormFields
