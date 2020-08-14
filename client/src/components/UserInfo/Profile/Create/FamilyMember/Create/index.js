import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Form from "../../Forms/CreateProfileForm";
const CreateFamilyModalStyled = styled.div`
  h2 {
    text-align: center;
  }
`;
export default function index({
  visible = true,
  toggleCreateFamilyModal,
  handleOAddFamilyMember
}) {
  const [familyMemberDetails, setFamilyMemberDetails] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    familyrelationship: "",
    zipcode: "",
    dateofbirth: "",
    type: "Family Member",
    unrequiredFields: ["zipcode", "dateofbirth"]
  });
  const handleInputChange = (id, value) => {
    setFamilyMemberDetails({ ...familyMemberDetails, [id]: value });
  };
  const handleFormSubmit = values => {
    handleOAddFamilyMember(familyMemberDetails);
    toggleCreateFamilyModal(false);
  };
  if (!visible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <CreateFamilyModalStyled
      data-testid="app-profile-family-member-create-modal"
      className="modal"
    >
      <div className="modal-content">
        <span className="close" onClick={toggleCreateFamilyModal}>
          &times;
        </span>
        <h2 data-testid="app-profile-family-member-create-modal-header">
          Add a family member
        </h2>
        <Form
          data={familyMemberDetails}
          onSubmit={handleFormSubmit}
          handleInputChange={handleInputChange}
        />
      </div>
    </CreateFamilyModalStyled>,
    document.getElementById("modal")
  );
}
