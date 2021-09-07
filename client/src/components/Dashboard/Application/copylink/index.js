import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";



const CopyApplicationLinkModal = styled.div`
  #copyApplication .modal-body div.row {
    display: flex;
    align-items: center;
    margin: 1rem 0;
    background: #dcdcdc24;
    border: 1px solid gainsboro;
  }
  #copyApplication .modal-body div.row input {
    width: 100%;
    padding: 0 1rem;
    border: none !important;
    height: unset !important; 
    background: transparent !important;
  }
  #copyApplication .modal-body div.row #copyButton {
    border: none;
    width: 38px;
    color: #fff;
    background: #3788d8;
  }
`;

export default function index({
  isVisible = true,
  toggleCopyApplicationLinkModal,
  currentCopyLink
}) {
  const [isCopyURL, setCopyURL] = useState('');
  const inputElRef = useRef(null);


  // setTimeout(() => {
  //   const url = window.location.href;
  //   setCopyURL(url);
  // }, 500)
  useEffect(() => {
    let updatedPath = window.location.hostname === 'localhost' ? `http://${window.location.hostname}:1234` :   `https://${window.location.hostname}`
    setCopyURL(`${updatedPath}${currentCopyLink ? currentCopyLink : null}`)
  }, [currentCopyLink])


  console.log('currentCopyLink', currentCopyLink)
  const handleCopyLink = () => {
    const url = currentCopyLink//window.location.href;
    const val = inputElRef.current.select()
    document.execCommand('copy');
    console.log('val: ', val);
  }




  if (!isVisible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <CopyApplicationLinkModal className="modal">
      <div id="copyApplication" className="modal-content">
        <div class="modal-header">
          <h2>Copy Application Link</h2>
          <span
            className="close"
            onClick={() => {
              toggleCopyApplicationLinkModal(false);
            }}
          >
            &times;
          </span>
        </div>
        <div class="modal-body">
          <div className="row">
            <input ref={inputElRef} value={isCopyURL}></input>
            <button id="copyButton" onClick={handleCopyLink} >
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>
        </div>
      </div>
    </CopyApplicationLinkModal>,
    document.getElementById("modal")
  );
}
