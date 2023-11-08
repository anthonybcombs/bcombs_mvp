import React from 'react';
import styled from "styled-components";

import { printImage } from '../../../../../helpers/images.js';


const ImagePreviewModalStyled = styled.div`
  .modal-content {
    max-width: 1000px;
    padding: 14px !important;
    text-align: center;
  }
`

const QRCodePReviewModal = ({
    isImagePreviewModalVisible,
    setIsImagePreviewModalVisible,
    qrCodeUrl
}) => {

    return <ImagePreviewModalStyled>
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <span onClick={() => {
                        setIsImagePreviewModalVisible(!isImagePreviewModalVisible);
                    }} className="close">
                        &times;
                    </span>
                </div>
                <div className="modal-container">
                    <img src={qrCodeUrl} style={{
                        width: '70%',
                        height: 'auto'
                    }} />

                    <div style={{ padding: 12 }}>
                        <a href={`${process.env.HOST}/user/grades`} target="_blank">View Page</a>
                    </div>
                    <div>
                        <button

                            onClick={() => {
                                printImage(qrCodeUrl)
                            }}
                            style={style.print}
                        >Print
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </ImagePreviewModalStyled>
}

const style = {
    print: {
        backgroundColor: '#f26e21',
        cursor: 'pointer',
        color: 'white',
        width: '100%'
    },
    preview: {
        cursor: 'pointer',
        color: 'blue',
        width: '100%'
    }
};

export default QRCodePReviewModal;