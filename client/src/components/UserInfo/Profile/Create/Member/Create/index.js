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
  visible = true,
  toggleMemberModal,
  handleAddMember
}) {
  const [memberDetails, setMemberDetails] = useState({
    firstname: "",
    lastname: "",
    gender: "male",
    familyrelationship: "father",
    zipcode: "",
    dateofbirth: "",
    type: "Member"
  });
  const handleInputChange = (id, value) => {
    setMemberDetails({ ...memberDetails, [id]: value });
  };
  const handleFormSubmit = values => {
    handleAddMember(memberDetails);
    toggleMemberModal(false);
  };
  if (!visible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <CreateMemberModal
      data-testid="app-profile-member-create-modal"
      className="modal"
    >
      <div className="modal-content">
        <span className="close" onClick={toggleMemberModal}>
          &times;
        </span>
        <h2 data-testid="app-profile-member-create-modal-header">
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
