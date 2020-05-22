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
    width: 50%;
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
    contacts: [],
    visibility: 0,
    other_ids: []
  });
  const dispatch = useDispatch();
  const handleGroupDetailsChange = (id, value) => {
    if (id === "contacts" || id === "other_ids") {
      let ids = value.map(contact => contact.id);
      setGroupDetails({
        ...groupDetails,
        [id]: ids
      });
    } else {
      setGroupDetails({
        ...groupDetails,
        [id]: value
      });
    }
  };
  const handleSubmit = value => {
    toggleCreateGroupModal(false);
    const payload = {
      ...groupDetails,
      email: auth.email,
      contacts: [
        ...new Set([
          ...(groupDetails.contacts || []),
          ...(groupDetails.other_ids || [])
        ])
      ]
    };

    dispatch(addGroup(payload));
    setGroupDetails({
      id: uuid(),
      name: "",
      visibility: 0,
      userIds: [auth.id],
      contacts: [],
      other_ids: []
    });
  };
  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <NewContactModal className="modal">
      <div id="applicationForm" className="modal-content">
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
