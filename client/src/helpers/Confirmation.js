import React, { useContext } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";

const ConfirmationModal = styled.div`
  padding-top: 20%;
  button {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    display: block;
    margin: 10px auto;
    width: 100%;
    color: white;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
  }
  .modal-content {
    width: 20%;
    border: none !important;
    height: auto;
  }
  .profile-confirmation {
    text-align: left;
  }
  @media (min-width: 600px) {
    button {
      width: ${({ theme }) => theme.button.width.primary};
    }
  }

  .vendor-list div {
    margin: 12px;
  }
`;

export default function index({
  isVisible = true,
  headerMessage = "Confirmation",
  message = "",
  toggleConfirmationVisible,
  onSubmit
}) {
  const theme = useContext(ThemeContext);

  const handleSubmit = () => {
    onSubmit();
    toggleConfirmationVisible(false);
  };
  const handleClose = () => {
    toggleConfirmationVisible(false);
  };

  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <ConfirmationModal
      data-testid="app-dashboard-profile-confirmation"
      className="modal"
      theme={theme}>
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleConfirmationVisible(false);
          }}>
          &times;
        </span>

        <div className="profile-confirmation">
          <h4>{headerMessage}</h4>
          <div>{message}</div>
          <button id="Yes" onClick={handleSubmit}>
            Yes
          </button>
        </div>
        <button onClick={handleClose}>No</button>
      </div>
    </ConfirmationModal>,
    document.getElementById("modal")
  );
}
