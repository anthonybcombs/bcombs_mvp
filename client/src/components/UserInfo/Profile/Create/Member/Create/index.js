import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Form from "../../Forms/CreateProfileForm";
const CreateMemberModal = styled.div`
  h2 {
    text-align: center;
  }
`;
export default function index({
  setCurrentPage,
  visible = true,
  toggleMemberModal
}) {
  const [memberDetails, setMemberDetails] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    familyrelationship: "",
    zipcode: "",
    dateofbirth: ""
  });
  const handleInputChange = (id, value) => {
    setMemberDetails({ ...memberDetails, [id]: value });
  };
  const handleFormSubmit = values => {
    setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
  };
  if (!visible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <CreateMemberModal
      data-testid="app-profile-create-member-create-modal"
      className="modal"
    >
      <div className="modal-content">
        <span className="close" onClick={toggleMemberModal}>
          &times;
        </span>
        <h2 data-testid="app-profile-create-member-create-modal-header">
          Add a member
        </h2>
        <Form
          details={memberDetails}
          onSubmit={handleFormSubmit}
          handleInputChange={handleInputChange}
        />
      </div>
    </CreateMemberModal>,
    document.getElementById("modal")
  );
}
