import React, { useContext } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const ConfirmationModal = styled.div`
  padding-top: 20%;
  .yes-btn {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    display: block;
    margin: 20px auto;
    width: 30%;
    color: white;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    height: fit-content;
    margin-right: 20%;
  }
  .cancel-btn {
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    background-color: lightgrey;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
  }
  .cancel-btn {
    padding: 10px;
    width: 30%;
    display: block;
    margin: 20px auto;
    border: none;
    color: white;
    margin-left: 15%;
  }
  .modal-content {
    width: 20%;
    border: none !important;
    height: auto;
  }
  .profile-confirmation {
    text-align: center;
    margin-top: 50px;
  }

  @media screen and (max-width: 1920px) {
    .modal-content {
      width: 25%;
      border: none !important;
      height: auto;
    }
  }
  @media screen and (max-width: 1024px) {
    .modal-content {
      width: 25%;
      border: none !important;
      height: auto;
    }
  }
  @media screen and (max-width: 768px) {
    .modal-content {
      width: 85%;
      border: none !important;
      height: auto;
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
  onSubmit,
}) {
  const theme = useContext(ThemeContext);

  const handleSubmit = () => {
    toggleConfirmationVisible(false);
    onSubmit();
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
      theme={theme}
      style={{ paddingTop: 0 }}
    >
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleConfirmationVisible(false);
          }}
        >
          &times;
        </span>

        <div className="profile-confirmation">
          {/* <center>
            <FontAwesomeIcon
              icon={faTimesCircle}
              size="6x"
              style={{ marginBottom: 20, color: "#F36F21" }}
            />
          </center> */}
          <h4>{headerMessage}</h4>
          <div>{message}</div>
        </div>
        <div style={{ display: "flex", marginTop: 20 }}>
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button className="yes-btn" id="Yes" onClick={handleSubmit}>
            Yes
          </button>
        </div>
      </div>
    </ConfirmationModal>,
    document.getElementById("modal")
  );
}
index.propTypes = {
  onSubmit: PropTypes.func,
};
