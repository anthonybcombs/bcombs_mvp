import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons'

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
      {/* <select
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
      /> */}
      {/* End for validation */}

      {/* Start for Instruction */}
      <div className='settings-instruction'>
        {/* <input
          type='text'
          className='field-input'
          value={settings.instruction}
          placeholder='Instruction for use'
          onChange={({ target }) => {
            handleChangeSettings({ instruction: target.value })
          }}
        /> */}
        {/* <textarea name="message" rows="10" cols="30"></textarea> */}
        <textarea
          id='instructions'
          name='instructions'
          className='field-input'
          placeholder='Instructions'>
        </textarea>
      </div>
      {/* End for Instruction */}

      {/* Start Lower Control */}
      <div className='settings-control'>
        <div className='settings-checkbox'>
          <input type='checkbox' id='instruction' name='instruction' unchecked/>
          <span class='checkmark'/>
          <label for='instruction'> Instruction for Use</label>
        </div>

        <div className='settings-checkbox'>
          <input type='checkbox' id='validation' name='validation' />
          <span class='checkmark'/>
          <label for='validation'> Validation</label>
        </div>

        <div className='settings-checkbox'>
          <input type='checkbox' id='logic' name='logic' />
          <span class='checkmark'/>
          <label for='logic'> Logic</label>
        </div>

        <div className='settings-checkbox'>
          <input type='checkbox' id='required' name='required' />
          <span class='checkmark'/>
          <label for='required'> Required</label>
        </div>

        <div className='settings-iconActions'>
          <FontAwesomeIcon
            className='info-icon'
            icon={faCopy}
          />
          <FontAwesomeIcon
            className='info-icon'
            icon={faTrashAlt}
            onClick={onRemoveGroup}
          />
        </div>
      </div>
      {/* End Lower control */}
    </div>
  )
}