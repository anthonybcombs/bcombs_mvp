import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'

export default ({ instruction, allowedTypes, limit, errorMessage, onChangeFieldSettings }) => {
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
    <div>
      <div>
        Instruction for respondent
        <br />
        <input
          value={instruction}
          placeholder='Type instruction for respondent'
          onChange={(e) => handleChangeValues(e, 'instruction')}
        />
      </div>
      <div>
        Allowable file types
        <br />
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
      <div>
        Validation Message
        <br />
        <span>When an invalid file type is uploaded, display this error message.</span>
        <br />
        <input
          placeholder='Error message when file type is not allowed'
          value={errorMessage}
          onChange={e => handleChangeValues(e, 'errorMessage')}
        />
      </div>
      <div>
        File size limit is {limit}MB
      </div>
    </div>
  )
}