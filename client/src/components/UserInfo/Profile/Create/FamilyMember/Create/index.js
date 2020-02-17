import React, { useState } from "react";
import Form from "../../Forms/CreateProfileForm";
export default function index({ setCurrentPage, visible = true }) {
  const [familyMemberDetails, setFamilyMemberDetails] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    familyrelationship: "",
    zipcode: "",
    dateofbirth: ""
  });
  const handleInputChange = (id, value) => {
    setFamilyMemberDetails({ ...familyMemberDetails, [id]: value });
  };
  const handleFormSubmit = values => {
    setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
  };
  if (!visible) {
    return <></>;
  }
  return (
    <div data-testid="app-profile-create-family-member-create-modal">
      <h2 data-testid="app-profile-create-family-member-create-modal-header">
        Add a family member
      </h2>
      <Form
        details={familyMemberDetails}
        onSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}
