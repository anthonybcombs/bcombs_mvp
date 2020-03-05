import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import SendMessageForm from "../forms/SendMessageForm";
const SendMessageModalStyled = styled.div`
  padding: 1em;
  h2 {
    text-align: center;
  }
  .modal-content {
    width: 30%;
    margin-top: 20vh;
  }
`;
export default function index({ isVisible, toggleSendMessageModal, contact }) {
  const [messageDetails, setMessageDetails] = useState({});
  useEffect(() => {
    setMessageDetails({
      contact,
      message: ""
    });
  }, [contact, isVisible]);
  const handleMessageDetailsChange = (id, value) => {
    setMessageDetails({ ...messageDetails, [id]: value });
  };
  const handleSubmit = value => {
    setMessageDetails({
      contact,
      message: ""
    });
    toggleSendMessageModal(false);
  };
  if (!isVisible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <SendMessageModalStyled className="modal">
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleSendMessageModal(false);
          }}
        >
          &times;
        </span>
        <h2>
          Send message to (
          {`${messageDetails.contact.firstName} ${messageDetails.contact.lastName}`}
          )
        </h2>
        <SendMessageForm
          messageDetails={messageDetails}
          onSubmit={handleSubmit}
          handleMessageDetailsChange={handleMessageDetailsChange}
        />
      </div>
    </SendMessageModalStyled>,
    document.getElementById("modal")
  );
}
