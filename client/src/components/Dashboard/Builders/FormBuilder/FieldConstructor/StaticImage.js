import React, { useEffect, useState } from 'react'

function convertFileToBase64(file, callback) {
  const reader = new FileReader();
  
  reader.onload = function (event) {
    callback(event.target.result);
  };
  
  reader.readAsDataURL(file);
}

export default (props) => {
  const {
    id: fieldId,
    isBuilder, 
    // onChange,
    onChangeFieldSettings,
    // file,
    imageString,
    // value = '',
    // placeholder,
    value
  } = props


  const actualImage = value ? `https://bcombs.s3.amazonaws.com/${value}?date=${new Date()}` : ''

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if(value) {
      setImagePreview(actualImage)
    }

  },[value])

  console.log('value',value)
  
  console.log('imageString imageString',imageString)


  // const { data, filename = '' } = value || {}
//   const [, ext] = filename.split('.')
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      convertFileToBase64(selectedFile, function (base64String) {
        onChangeFieldSettings({ imageString: base64String })
        setImagePreview(base64String)
      });

     
    }
  };

  console.log('imagePreview',imagePreview)
  return (
    <>
      <div
      //  className="profile-image-wrapper"
     
      >
        <div style={{ width: '100%', textAlign: 'center' }}>
        <img src={imagePreview} width="60%" height="auto" alt='' style={{ margin: '0 auto' }} />

        </div>
        {
        isBuilder ? (
          <input
            type="file"
            // value={placeholder}
            className='field-input'
            id="value"
            name="value"
            placeholder='Image URL Here'
            // onChange={onChange}
            onChange={handleFileChange} 
          />
        ) : (
        ''
        )
      }
      </div>
     
    </>
  )
}
