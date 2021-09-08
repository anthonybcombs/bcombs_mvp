import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";



const CopyLinkModal = styled.div`
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
  toggleCopyLinkModal
}) {
  const [isCopyURL, setCopyURL] = useState('');
  const inputElRef = useRef(null);


  setTimeout(() => {
    const url = window.location.href;
    setCopyURL(url);
  }, 100)

  const handleCopyLink = () => {
    const url = window.location.href;
    const val = inputElRef.current.select()
    document.execCommand('copy');
    console.log('val: ', val);
  }

  


  if (!isVisible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <CopyLinkModal className="modal">
      <div id="copyApplication" className="modal-content">
        <div class="modal-header">
          <h2>Copy Form Link</h2>
          <span
            className="close"
            onClick={() => {
              toggleCopyLinkModal(false);
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
    </CopyLinkModal>,
    document.getElementById("modal")
  );
}
