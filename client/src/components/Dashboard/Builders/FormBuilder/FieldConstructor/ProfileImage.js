import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faFileImage, faUser } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'

import UploadPhotoForm from "../../../MyProfile/forms/UploadPhotoForm";

export default ({
  isReadOnly = false, allowTypes, limit, errorMessage, id: fieldId, onChangeFieldSettings,
  isBuilder, onChange, onCheckError, value, className
}) => {
  console.log('Profile Image', value)
  const [imagePreview, setImagePreview] = useState(value?.url || '/defaultprofile.7ccad8ff.png');
  const [isUploadPhotoVisible, setUploadPhotoVisible] = useState(false);
  const [imgObject, setImgObject] = useState('')

  const handleChangeValues = ({ target: { value: fileValue } }, type) => {
    const isTypeLimit = type === 'limit'
    if (isTypeLimit && (fileValue < 1) ) {
      return
    }
    onChangeFieldSettings({ [type]: isTypeLimit ? (fileValue * 1) : fileValue })
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

  const resetImgPreview = (img) => {
    img = img || value.data || '/defaultprofile.7ccad8ff.png'
    setImagePreview(img)
  }

  const encodeImageFileAsURL = (file) => {
    if (!file) {
      resetImgPreview()
      return
    }

    const newFile = cloneDeep(file).src.file

    // if (newFile.size / 1048576 > (limit * 1)) {
    //   onCheckError(fieldId, [`Maximum size for file upload is ${limit}MB.`])
    //   resetImgPreview()
    //   return
    // }

    const [, ext] = newFile.name.split('.')

    // const allowedExt = allowTypes.filter(e => e.selected).reduce((acc, curr) => [...acc, ...curr.ext], [])
    // if (!allowedExt.includes(`.${ext.toLowerCase()}`)) {
    //   onCheckError(fieldId, [errorMessage])
    //   resetImgPreview()
    //   return
    // }

    resetImgPreview(file?.src?.base64 || '')
    var reader = new FileReader()
    reader.onloadend = function() {
      onChange({ target: { id: fieldId, value: { url: '', data: reader.result, filename: newFile.name, contentType: newFile.type, extension: `.${ext}` } } })
    }
    reader.readAsDataURL(newFile)
  }

  const { data, filename = '' } = value || {}
  const [, ext] = filename.split('.')

  return (
    <>
      <div
        className="profile-image-wrapper"
        onClick={(e) => (!isBuilder && !isReadOnly) && setUploadPhotoVisible(true)}
      >
        <img src={imagePreview} width="80" height="80" alt='' />
      </div>
      <UploadPhotoForm
        isVisible={isUploadPhotoVisible}
        toggleProfilePhotoVisible={setUploadPhotoVisible}
        getImgObject={setImgObject}
        onSubmit={(image) => {
          setUploadPhotoVisible(false)
          encodeImageFileAsURL(imgObject)
          // setImagePreview(image)
          // if (!isReadOnly) {
            // encodeImageFileAsURL(e.target.files[0],)
          // }
        }}
      />
    </>
  )
}