import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faFileImage, faFilePdf, faFileWord } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'

const getExtensionIcon = (ext) => {
  switch (ext.toLowerCase()) {
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return faFileImage
    case 'pdf':
      return faFilePdf
    case 'doc':
    case 'docx':
      return faFileWord
    default:
      null
  }
}

const rootPath = 'https://bcombs.s3.amazonaws.com/';

export default ({
  isReadOnly = false, allowTypes, limit, errorMessage, id: fieldId, onChangeFieldSettings,
  isBuilder, onChange, onCheckError, value, className, fieldError
}) => {
  const handleChangeValues = ({ target: { value: fileValue } }, type) => {
    onChangeFieldSettings({ [type]: fileValue })
  }

  const handleChangeTypes = ({ target: { checked } }, index) => {
    let newTypes = cloneDeep(allowTypes)
    newTypes[index].selected = checked

    if (newTypes.filter(e => e.selected).length === 0) {
      return
    }

    const getErrorMsg = (arr) => `Only ${arr.filter(e => e.selected).map(e => e.label).join(', ')} files are supported.`
    let newErrorMessage = getErrorMsg(allowTypes)
    if (errorMessage !== newErrorMessage) {
      newErrorMessage = errorMessage
    } else {
      newErrorMessage = getErrorMsg(newTypes)
    }
    onChangeFieldSettings({ allowTypes: newTypes, errorMessage: newErrorMessage })
  }

  const encodeImageFileAsURL = (file) => {
    console.log('witwerwe', file)
    if (!file) {
      return
    }
    if (file.size / 1048576 > 15) {
      onCheckError(fieldId, ['Maximum size for file upload is 15MB.'])
      return
    }
    const [, ext] = file.name.split('.')

    const allowedExt = allowTypes.filter(e => e.selected).reduce((acc, curr) => [...acc, ...curr.ext], [])
    if (!allowedExt.includes(`.${ext.toLowerCase()}`)) {
      onCheckError(fieldId, [errorMessage])
      return
    }

    var reader = new FileReader()
    reader.onloadend = function () {
      onChange({ target: { id: fieldId, value: { url: '', data: reader.result, filename: file.name, contentType: file.type, extension: `.${ext}` } } })
    }
    reader.readAsDataURL(file)
  }

  const { data, filename = '', url = '' } = value || {}
  const [, ext] = filename.split('.')


  return (
    <>
      {
        isBuilder ? (
          <div className='fileUpload-container'>
            <div className='fileTypes'>
              <p>Allowable file types</p>
              <div className='options'>
                {
                  allowTypes.map(({ label, selected }, index) => {
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
                <label htmlFor='error-msg'>When an invalid file type is uploaded, display this error message.</label>
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
          filename ? (
            <div className={`uploadForm-value ${className}`}>
              <FontAwesomeIcon
                className='file-icon'
                icon={getExtensionIcon(ext)}
              />
              <span>{filename}</span>
              {
                !isReadOnly && (
                  <FontAwesomeIcon
                    icon={faTimes}
                    className='close-icon'
                    onClick={() => !isReadOnly ? onChange({ target: { id: fieldId, value: '' } }) : {}}
                  />
                )
              }


            </div>
          ) : (
            <div
              className='uploadForm'
              onClick={() => {
                if (!isReadOnly) {
                  document.getElementById(`file${fieldId}`).click()
                }
              }}
            >
              <input
                type='file'
                id={`file${fieldId}`}
                name='file'
                disabled={isReadOnly}
                onClick={e => e.stopPropagation()}
                onChange={(e) => !isReadOnly ? encodeImageFileAsURL(e.target.files[0],) : {}}
              />
            </div>
          )
        )
      }

      {isReadOnly &&
        <div style={{ display: 'block', marginTop: 4 }} >
          {/* <a href={`${rootPath}${url}`} download={true} target="_blank" >Click here to view the file </a> */}
          <a href={data} download={true} target="_blank" >Click here to download the file </a>
        </div>}
    </>
  )
}