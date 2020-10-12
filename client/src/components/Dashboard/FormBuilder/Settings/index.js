import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCopy } from '@fortawesome/free-solid-svg-icons'

import { Sources } from './Sources'

export default ({
  settings: {
    validation = {},
    instruction = ''
  },
  onChangeSettings,
  onRemoveGroup
}) => {
  const { type, option, value, error } = validation
  const { validationTypes, validationOptions } = Sources

  const validationOptionsArr = Object.entries(validationOptions[type || 'text'])
  const [settings, changeSettings] = useState({
    validation: {
      type: type || 'text',
      option: option || validationOptionsArr[0][0],
      value: value,
      error: error || ''
    },
    instruction: instruction || ''
  })

  const handleChangeSettings = (data, key) => {
    let newSettings = { ...settings }
    if (key) {
      newSettings[key] = {
        ...newSettings[key],
        ...data
      }
    } else {
      newSettings = {
        ...newSettings,
        ...data
      }
    }
    changeSettings(newSettings)
    onChangeSettings(newSettings)
  }

  const { validation: validationSettings } = settings
  return (
    <div className='group-settings'>
      {/* Start For Validation */}
      <select
        value={validationSettings.type}
        onChange={({ target }) => {
          handleChangeSettings({ type: target.value }, 'validation')
        }}
      >
        {
          Object.entries(validationTypes).map(([key, label]) => (
            <option value={key}>{label}</option>
          ))
        }
      </select>
      <select
        value={validationSettings.option}
        onChange={({ target }) => {
          handleChangeSettings({ option: target.value }, 'validation')
        }}
      >
        {
          validationOptionsArr.map(([key, { label }]) => (
            <option value={key}>{label}</option>
          ))
        }
      </select>
      {
        (validationSettings.option !== 'emailAddress') &&
        <input
          value={validationSettings.value}
          type={validationSettings.type === 'length' ? 'number' : validationSettings.type}
          placeholder={validationSettings.type === 'text' ? 'Text' : 'Number'}
          onChange={({ target }) => {
            handleChangeSettings({ option: target.value }, 'validation')
          }}
        />
      }
      <input
        value={validationSettings.error}
        type='text'
        placeholder='Custom error text'
        onChange={({ target }) => {
          handleChangeSettings({ option: target.value }, 'validation')
        }}
      />
      {/* End for validation */}

      {/* Start for Instruction */}
      <div>
        <input
          value={settings.instruction}
          type='text'
          placeholder='Instruction for use'
          onChange={({ target }) => {
            handleChangeSettings({ instruction: target.value })
          }}
        />
      </div>
      {/* End for Instruction */}

      {/* Start Lower Control */}
      <div>
        <input type='checkbox' id='instruction' name='instruction' />
        <label for='instruction'> Instruction for Use</label>

        <input type='checkbox' id='validation' name='validation' />
        <label for='validation'> Validation</label>

        <input type='checkbox' id='logic' name='logic' />
        <label for='logic'> Logic</label>

        <input type='checkbox' id='required' name='required' />
        <label for='required'> Required</label>
        <FontAwesomeIcon
          className='info-icon'
          icon={faTrash}
          onClick={onRemoveGroup}
        />
        <FontAwesomeIcon
          className='info-icon'
          icon={faCopy}
        />
      </div>
      {/* End Lower control */}
    </div>
  )
}