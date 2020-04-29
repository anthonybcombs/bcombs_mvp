import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { uuid } from "uuidv4";
import { useDispatch } from "react-redux";
import { addContact } from "../../../../redux/actions/Contacts";
import { updateGroup } from "../../../../redux/actions/Groups";
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
export default function index({
  isVisible = true,
  toggleCreateContactModal,
  groups,
  auth
}) {
  const [contactDetails, setContactDetails] = useState({
    id: uuid(),
    firstName: "",
    lastName: "",
    phonNumber: "",
    email: "",
    selectedGroups: [],
    userIds: [auth.sub],
    relation: ""
  });

  const dispatch = useDispatch();
  const handleContactDetailsChange = (id, value) => {
    let newSelectedGroups = contactDetails.selectedGroups;
    if (id === "selectedGroups") {
      let selectedGroupId = value;
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
    // contactDetails.selectedGroups.forEach(selectedGroupId => {
    //   const selectedGroup = groups.find(group => group.id === selectedGroupId);
    //   selectedGroup.contacts.push(contactDetails.id);
    //   dispatch(updateGroup(selectedGroup));
    // });
    const payload = {
      ...contactDetails
    };

    dispatch(addContact(payload));
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
          }}>
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
