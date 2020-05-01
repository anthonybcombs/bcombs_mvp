import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import GroupForm from "../forms/GroupForm";
import { uuid } from "uuidv4";
import { addGroup } from "../../../../redux/actions/Groups";
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
  toggleCreateGroupModal,
  contacts,
  auth
}) {
  const [groupDetails, setGroupDetails] = useState({
    id: uuid(),
    name: "",
    userIds: [auth.id],
    contacts: [],
    visibility: 0
  });
  const dispatch = useDispatch();
  const handleGroupDetailsChange = (id, value) => {
    let newContacts = groupDetails.contacts;
    if (id === "contacts") {
      let selectedContactId = value;
      if (newContacts.includes(selectedContactId)) {
        newContacts = newContacts.filter(
          contactId => contactId !== selectedContactId
        );
      } else {
        newContacts.push(selectedContactId);
      }
    }
    setGroupDetails({
      ...groupDetails,
      [id]: id == "contacts" ? newContacts : value
    });
  };
  const handleSubmit = value => {
    toggleCreateGroupModal(false);
    const payload = {
      ...groupDetails,
      email: auth.email
    };
    dispatch(addGroup(payload));
    setGroupDetails({
      id: uuid(),
      name: "",
      visibility: 0,
      userIds: [auth.id],
      contacts: []
    });
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
            toggleCreateGroupModal(false);
          }}>
          &times;
        </span>
        <div>
          <h2>Create a Group</h2>
          <GroupForm
            contacts={contacts}
            groupDetails={groupDetails}
            onSubmit={handleSubmit}
            handleGroupDetailsChange={handleGroupDetailsChange}
          />
        </div>
      </div>
    </NewContactModal>,
    document.getElementById("modal")
  );
}
