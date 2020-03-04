import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import ContactForm from "../forms/ContactForm";
const NewContactModal = styled.div`
  h2 {
    text-align: center;
  }
  .modal-content {
    width: 40%;
  }
  @media (min-width: 600px) {
  }
`;
export default function index({ isVisible = true, toggleCreateContactModal }) {
  const [contactDetails, setContactDetails] = useState({
    firstName: "",
    lastName: "",
    phonNumber: "",
    email: "",
    selectedGroups: []
  });
  const groups = useSelector(({ groups }) => groups);
  const handleContactDetailsChange = (id, value) => {
    let newSelectedGroups = contactDetails.selectedGroups;
    if (id === "selectedGroups") {
      let selectedGroupId = parseInt(value);
      if (newSelectedGroups.includes(selectedGroupId)) {
        newSelectedGroups = newSelectedGroups.filter(
          groupId => groupId !== selectedGroupId
        );
      } else {
        newSelectedGroups.push(selectedGroupId);
      }
    }
    setContactDetails({
      ...contactDetails,
      [id]: id == "selectedGroups" ? newSelectedGroups : value
    });
  };
  const handleSubmit = value => {
    toggleCreateContactModal(false);
  };
  if (!isVisible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <NewContactModal className="modal">
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleCreateContactModal(false);
          }}
        >
          &times;
        </span>
        <div>
          <h2>Create a Contact</h2>
          <ContactForm
            groups={groups}
            contactDetails={contactDetails}
            onSubmit={handleSubmit}
            handleContactDetailsChange={handleContactDetailsChange}
          />
        </div>
      </div>
    </NewContactModal>,
    document.getElementById("modal")
  );
}
