import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'

export default ({ instruction, allowedTypes, limit, errorMessage, onChangeFieldSettings, isBuilder }) => {
  const handleChangeValues = ({ target: { value } }, type) => {
    onChangeFieldSettings({ [type]: value })
  }
  
  const handleChangeTypes = ({ target: { checked } }, index) => {
    let newTypes = cloneDeep(allowedTypes)
    newTypes[index].selected = checked

    const getErrorMsg = (arr) => `Only ${arr.filter(e => e.selected).map(e => e.label).join(', ')} files are supported.`
    let newErrorMessage = getErrorMsg(allowedTypes)
    if (errorMessage !== newErrorMessage) {
      newErrorMessage = errorMessage
    } else {
      newErrorMessage = getErrorMsg(newTypes)
    }
    onChangeFieldSettings({ allowedTypes: newTypes, errorMessage: newErrorMessage })
  }

  return (
    <>
      {
        isBuilder ? (
          <div className='fileUpload-container'>
            <div className='fileTypes'>
              <p>Allowable file types</p>
              <div className='options'>
                {
                  allowedTypes.map(({ label, selected }, index) => {
                    return (
                      <label key={`allowedType-${index}`} className='checkboxContainer'>
                        <input
                          type='checkbox'
                          checked={selected}
                          onChange={(e) => handleChangeTypes(e, index)}
                        />
                        <span className='checkmark' />
                        <span className='labelName'> {label}</span>
                      </label>
                    )
                  })
                }
              </div>
            </div>
            <div className='validation'>
              <p>Validation Message</p>
              <div className='input-wrapper'>
                <label for='error-msg'>When an invalid file type is uploaded, display this error message.</label>
                <input
                  id='error-msg'
                  className='field-input'
                  placeholder='Error message when file type is not allowed'
                  value={errorMessage}
                  onChange={e => handleChangeValues(e, 'errorMessage')}
                />
              </div>
              <span className='limit-size'>File size limit is {limit}MB</span>
            </div>
          </div>
        ) : (
          <div>
            <input
              type='file'
              id='file'
              name='file'
              onChange={(e) => {
                console.log('e', e.target.files[0])
              }}
            />
          </div>
        )
      }
    </>
  )
}