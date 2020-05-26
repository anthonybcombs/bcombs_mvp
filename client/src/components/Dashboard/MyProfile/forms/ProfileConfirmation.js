import React, { useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
// import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";

const ProfileConfirmationModal = styled.div`
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
    width: 30%;
    border: none !important;
    height: auto;
  }
  .profile-confirmation {
    text-align: center;
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
const OPTION_VERIFICATION = [
  { name: "Waiting for Verification", value: "waiting_for_verification" },
  { name: "Verified", value: "verified" },
  { name: "Rejected", value: "rejected" }
];

export default function index({
  isVisible = true,
  applications = { child: [], parent: [] },
  toggleConfirmationVisible,
  onSubmit
}) {
  const [selectedVendor, setSelectedVendor] = React.useState([]);
  const [selectedChild, setSelectedChild] = useState([]);
  const [selectedParent, setSelectedParent] = useState([]);
  const theme = useContext(ThemeContext);

  const handleUpdateSelectedParent = e => {
    const { value } = e.target;
    if (selectedParent.includes(value)) {
      setSelectedParent(selectedParent.filter(id => id != value));
    } else {
      setSelectedParent([...selectedParent, value]); // or push
    }
  };

  const handleUpdateSelectedChild = e => {
    const { value } = e.target;
    if (selectedChild.includes(value)) {
      setSelectedChild(selectedChild.filter(id => id != value));
    } else {
      setSelectedChild([...selectedChild, value]); // or push
    }
  };
  //useEffect(() => {}, [applications]);

  const handleSubmit = () => {
    const payload = {
      child_ids: selectedChild,
      parent_ids: selectedParent
    };
    onSubmit(payload);
  };

  if (!isVisible) {
    return <></>;
  }

  console.log("selectedParent", selectedParent);
  return ReactDOM.createPortal(
    <ProfileConfirmationModal
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
          <h3>Update Profile Confirmation</h3>
          {applications &&
          (applications.child.length > 0 || applications.parent.length > 0) ? (
            <>
              <p>
                Would you like to reflect these changes to your application
                details? Please select the list of vendor you wanted to update
                the information.
              </p>
              <div className="vendor-list">
                {applications.child.map(item => {
                  const currentStatus = OPTION_VERIFICATION.find(
                    opt => opt.value === item.verification
                  );
                  return (
                    <div className="vendor-details">
                      <input
                        type="checkbox"
                        name="child_application"
                        onChange={handleUpdateSelectedChild}
                        value={item.child_id}
                      />{" "}
                      {item.name}{" "}
                      {currentStatus ? `(${currentStatus.name})` : ""}
                    </div>
                  );
                })}
                {applications.parent.map(item => {
                  const currentStatus = OPTION_VERIFICATION.find(
                    opt => opt.value === item.verification
                  );
                  console.log("currentStatus", currentStatus);
                  return (
                    <div>
                      {" "}
                      <input
                        type="checkbox"
                        name="parent_application"
                        onChange={handleUpdateSelectedParent}
                        value={item.parent_id}
                      />{" "}
                      {item.name}{" "}
                      {currentStatus ? `(${currentStatus.name})` : ""}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p>Are you sure you want to save this update?</p>
          )}

          <button
            data-testid="app-profile-submit-button"
            onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </ProfileConfirmationModal>,
    document.getElementById("modal")
  );
}
