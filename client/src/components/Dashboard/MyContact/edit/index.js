import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { updateContact } from "../../../../redux/actions/Contacts";
import { updateGroup } from "../../../../redux/actions/Groups";
import EditContactForm from "../forms/EditContactForm";
const EditContactModal = styled.div`
  h2 {
    text-align: center;
  }
  .modal-content {
    width: 60%;
  }
  @media (min-width: 600px) {
  }
`;
export default function index({
  isVisible = true,
  toggleEditContactModal,
  groups,
  contact
}) {
  const [contactDetails, setContactDetails] = useState({});
  useEffect(() => {
    setContactDetails({
      ...contact,
      selectedGroups: groups
        .filter(group => group.contacts.includes(contact.id))
        .map(group => group.id)
    });
  }, [contact, isVisible]);
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
    groups.forEach(group => {
      if (contactDetails.selectedGroups.includes(group.id)) {
        if (!group.contacts.includes(contactDetails.id)) {
          group.contacts.push(contactDetails.id);
        }
      } else {
        group.contacts = group.contacts.filter(
          contactId => contactId !== contactDetails.id
        );
      }
      dispatch(updateGroup(group));
    });
    dispatch(updateContact(contactDetails));
    toggleEditContactModal(false);
  };
  if (!isVisible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <EditContactModal className="modal">
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleEditContactModal(false);
          }}
        >
          &times;
        </span>
        <div>
          <h2>Edit Contact</h2>
          <EditContactForm
            groups={groups}
            contactDetails={contactDetails}
            onSubmit={handleSubmit}
            handleContactDetailsChange={handleContactDetailsChange}
          />
        </div>
      </div>
    </EditContactModal>,
    document.getElementById("modal")
  );
}
