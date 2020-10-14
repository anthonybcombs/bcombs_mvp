import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons'

import { Sources } from './Sources'

export default ({
  settings: {
    validation = {},
    instruction,
    logic,
    required = false
  },
  onChangeSettings,
  onRemoveGroup,
  onDuplicateGroup
}) => {
  const { type, option, value, error, include } = validation
  const { validationTypes, validationOptions } = Sources

  const validationOptionsArr = Object.entries(validationOptions[type || 'text'])
  const [settings, changeSettings] = useState({
    validation: {
      include: !!include,
      type: type || 'text',
      option: option || validationOptionsArr[0][0],
      value: value,
      error: error || ''
    },
    instruction: instruction || { include: false, value: '' },
    logic: logic || { include: false, value: ''},
    required,
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

  const { validation: validationSettings, instruction: instructionSettings, logic: logicSettings, required: requiredSetting } = settings

  return (
    <div className='group-settings'>
      {/* Start For Validation */}
      {
        validationSettings.include && (
          <div className='settings-validation'>
            <div className='field select-field-wrapper'>
              <select
                className='field-input'
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
            </div>
            <div className='field select-field-wrapper'>
              <select
                className='field-input'
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
            </div>
            {
              (validationSettings.option !== 'emailAddress') &&
              <input
                className='field-input'
                value={validationSettings.value}
                type={validationSettings.type === 'length' ? 'number' : validationSettings.type}
                placeholder={validationSettings.type === 'text' ? 'Text' : 'Number'}
                onChange={({ target }) => {
                  handleChangeSettings({ option: target.value }, 'validation')
                }}
              />
            }
            <input
              type='text'
              className='field-input'
              placeholder='Custom error text'
              value={validationSettings.error}
              onChange={({ target }) => {
                handleChangeSettings({ option: target.value }, 'validation')
              }}
            />
          </div>
        )
      }
      {/* End for validation */}

      {/* Start for Instruction */}
      {
        instructionSettings.include && (
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
            <textarea
              id='instructions'
              name='instructions'
              className='field-input'
              placeholder='Instructions'
              value={instructionSettings.value}
              onChange={({ target }) => {
                handleChangeSettings({ value: target.value }, 'instruction')
              }}
            />
          </div>
        )
      }
      {/* End for Instruction */}

      {/* Start Lower Control */}
      <div className='settings-control'>
        <div className='settings-checkbox'>
          <input
            type='checkbox'
            id='instruction'
            name='instruction'
            checked={!!instructionSettings.include}
            onChange={e => {
              e.stopPropagation()
              handleChangeSettings({ include: e.target.checked }, 'instruction')
            }}
          />
          <span class='checkmark' />
          <label for='instruction'> Instruction for Use</label>
        </div>

        <div className='settings-checkbox'>
          <input
            type='checkbox'
            id='validation'
            name='validation'
            checked={!!validationSettings.include}
            onChange={e => {
              e.stopPropagation()
              handleChangeSettings({ include: e.target.checked }, 'validation')
            }}
          />
          <span class='checkmark'/>
          <label for='validation'> Validation</label>
        </div>

        <div className='settings-checkbox'>
          <input
            type='checkbox'
            id='logic'
            name='logic'
            checked={!!logicSettings.include}
            onChange={e => {
              e.stopPropagation()
              handleChangeSettings({ include: e.target.checked }, 'logic')
            }}
          />
          <span class='checkmark'/>
          <label for='logic'> Logic</label>
        </div>

        <div className='settings-checkbox'>
          <input
            type='checkbox'
            id='required'
            name='required'
            checked={requiredSetting}
            onChange={e => {
              e.stopPropagation()
              handleChangeSettings({ required: e.target.checked })
            }}
          />
          <span class='checkmark'/>
          <label for='required'> Required</label>
        </div>

        <div className='settings-iconActions'>
          <div className='tooltip-wrapper copy-icon'>
            <FontAwesomeIcon
              icon={faCopy}
              onClick={e => {
                e.stopPropagation()
                onDuplicateGroup()
              }}
            />
            <span className='tooltip'>Copy</span>
          </div>
          <div className='tooltip-wrapper delete-icon'>
            <FontAwesomeIcon
              icon={faTrashAlt}
              onClick={e => {
                e.stopPropagation()
                onRemoveGroup()
              }}
            />
            <span className='tooltip'>Delete</span>
          </div>
        </div>
      </div>
      {/* End Lower control */}
    </div>
  )
}