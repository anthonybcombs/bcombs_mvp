import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import QRCodePReviewModal from '../../Grades/TestInput/QRCodePReviewModal';

const ASSESSMENT_FORM_ID = '5657b60d-785f-11ee-adb5-824b66c683b0'

const getPageQrCode = async () => {
  const response = await fetch(`${process.env.API_HOST}/api/qr/assessmentform`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });
  return response.json();
}



export default ({ formId, hasLoginField }) => {

  const [qrCode, setQrCode] = useState('');
  const [qrTargetUrl, setQrTargetUrl] = useState('');
  const [isQRCodePreviewModalVisible, setIsQRCodePreviewModalVisible] = useState(false);

  useEffect(() => {
    const triggerGetQrCode = async () => {
      try {
        const response = await getPageQrCode();
        setQrCode(response?.qr_code || '');
        setQrTargetUrl(response?.target_url || '')
      } catch (err) {
        console.log('triggerGetQrCode err', err)
      }
    };

    triggerGetQrCode();
  }, []);

  return (
    <div className='thankyouPage'>
      <FontAwesomeIcon icon={faCheckCircle} />
      <div className='message'>Application succesfully submitted
        {
          hasLoginField ? (
            <div className='hasLogin'>
              <br />
              <span>
                Thank you for completing your application. The final step in the application process is to setup your account. Here is what you'll need to do:
                <br /><br />
                1. You will receive a verification email asking you to authenticate your email account.
                <br /><br />
                2. Login to your account and set your password and security questions.
                <br /><br />
                3. Once confirmed, you will have to access to your personalized BCombs account and have access to view and edit your application.
              </span>
            </div>
          ) : <span>Thank you for completing your application.</span>
        }
      </div>
      <button
        onClick={() => {
          window.location.reload()
        }}
      >
        Fill out form again
      </button>
      {`  `}
      {formId === ASSESSMENT_FORM_ID && <button
        onClick={() => {
          setIsQRCodePreviewModalVisible(true)
        }}
      >
        View QR Code
      </button>}



      {isQRCodePreviewModalVisible && (formId === ASSESSMENT_FORM_ID) && <QRCodePReviewModal
        isImagePreviewModalVisible={isQRCodePreviewModalVisible}
        setIsImagePreviewModalVisible={setIsQRCodePreviewModalVisible}
        qrCodeUrl={qrCode}
        targetUrl={qrTargetUrl}

      />}
    </div>
  )
}