import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faFileImage, faUser } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'

import UploadPhotoForm from "../../../MyProfile/forms/UploadPhotoForm";

export default (props) => {
  const {
    isReadOnly = false, allowTypes, limit, errorMessage, id: fieldId, onChangeFieldSettings,
    isBuilder, onChange, onCheckError, value, className
  } = props
  
  // console.log('Profile Image', props)
  const actualImage = value?.url ? 'https://bcombs.s3.amazonaws.com/' + value.url : ''

  const [imagePreview, setImagePreview] = useState('');
  const [isUploadPhotoVisible, setUploadPhotoVisible] = useState(false);
  const [imgObject, setImgObject] = useState('')
  const [auth, setAuth] = useState({ profile_img: actualImage })

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
    img = img || value.data || ''
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
    onChange({ target: { id: fieldId, value: { url: '', data: file?.src?.base64, filename: newFile.name, contentType: newFile.type, extension: `.${ext}` } } })
    // var reader = new FileReader()
    // reader.onloadend = function() {
      
    // }
    // reader.readAsDataURL(newFile)
  }

  const { data, filename = '' } = value || {}
  const [, ext] = filename.split('.')
  const imgSrc = imagePreview || actualImage || '/defaultprofile.7ccad8ff.png'

  return (
    <>
      <div
        className="profile-image-wrapper"
        onClick={(e) => (!isBuilder && !isReadOnly) && setUploadPhotoVisible(true)}
      >
        <img src={imgSrc} width="80" height="80" alt='' />
      </div>
      <UploadPhotoForm
        auth={auth}
        isVisible={isUploadPhotoVisible}
        toggleProfilePhotoVisible={setUploadPhotoVisible}
        getImgObject={(image) => {
          if (actualImage) {
            resetImgPreview(image.src.base64)
          }
          setImgObject(image)
        }}
        onSubmit={() => {
          setUploadPhotoVisible(false)
          encodeImageFileAsURL(imgObject)
        }}
      />
    </>
  )
}