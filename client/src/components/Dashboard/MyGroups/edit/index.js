import React, { useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useDispatch } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";
// import { updateContact } from "../../../../../redux/actions/Contacts";
import {
  updateGroup,
  requestDeleteGroup
} from "../../../../redux/actions/Groups";

import GroupForm from "../forms/GroupForm";
//import ContactSelections from "./ContactSelections";
import GroupContacts from "./GroupContacts";
//import GroupPhoto from "./GroupPhoto";

import Loading from "../../../../helpers/Loading.js";

// REDUX
//import { updateGroup } from "../../../../../redux/actions/Groups";

const EditGroupModal = styled.div`
  h2 {
    text-align: center;
  }
  .modal-content {
    width: ${({ theme }) => theme.modalWidth};
    margin-top: ${({ theme }) => theme.modalMarginTop};
    height: auto;
  }
  .content {
    display: grid;
    background-color: white;
    padding: 4em;
  }
  .content > div {
  }
  .content > div:nth-child(2) {
    text-align: center !important;
    min-height: 300px;
  }
  .modal-content {
    margin: 1.5em auto;
    width: 45%;
    min-height: 70%;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;

    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
  }
  .group-delete {
    background-color: #e02500 !important;
  }
  .group-submit {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    margin: 10px auto;
    width: 100%;
    border: none;
    margin-top: 5em;
    bottom: 0px;
  }
  .group-name {
    background: none;
    width: 100%;
    color: black;
    font-size: 32px !important;
    display: block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 2.5em;
    margin-bottom: 2.5em;
  }
  @media (min-width: 600px) {
    .content {
      grid-gap: 1%;
    }
    button[type="submit"] {
      width: 30%;
    }
  }
`;

export default function index({
  auth,
  isVisible = true,
  toggleEditGroupModal,
  contacts,
  groupMembers,
  group,
  isGroupLoading,
  isGroupMemberLoading,
  typeOfForm = "Edit Group"
}) {
  const [groupDetails, setGroupDetails] = useState({});
  const [currentContacts, setCurrentContacts] = useState([]);
  const [removedContacts, setRemovedContacts] = useState([]);
  const [contactSelections, setContactSelections] = useState([]);

  const resetState = () => {
    setCurrentContacts([]);
    setContactSelections([]);
    //setSelectedContact([]);
    setRemovedContacts([]);
  };
  //const [selectedFile, setSelectedFile] = useState([]);
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (contacts && isVisible && group && group.contacts) {
      const list = group.contacts
        .map(c => {
          let contact = groupMembers.find(con => con.user_id === c);
          const currentContact = contacts.find(con => con.user_id === c);

          return {
            ...contact,
            phone_number: currentContact ? currentContact.phone_number : ""
          };
        })
        .filter(c => c.email);

      let selections = contacts
        .filter(c => {
          return !group.contacts.includes(c.user_id);
        })
        .map(c => {
          return {
            user_id: c.user_id,
            first_name: c.first_name,
            last_name: c.last_name,
            phone_number: c.phone_number
          };
        });

      setCurrentContacts(list);
      setContactSelections(selections);
      setGroupDetails(group);
    }
  }, [group, groupMembers, isVisible]);

  const handleGroupDetailsChange = (id, value) => {
    if (id === "contacts" || id === "other_ids") {
      console.log("VALUEEEEEEEEEEEEEEE", value);
      let ids = value.map(contact => contact.value);
      if (id === "contacts") {
        console.log(" [...(group.contacts || []), ...ids]", [
          ...(group.contacts || []),
          ...ids
        ]);
        setGroupDetails({
          ...groupDetails,
          contacts: [...(group.contacts || []), ...ids]
        });
      } else {
        setGroupDetails({
          ...groupDetails,
          other_ids: ids
        });
      }
    } else {
      setGroupDetails({
        ...groupDetails,
        [id]: value
      });
    }
  };

  const handleSubmit = value => {
    const payload = {
      ...groupDetails,
      email: auth.email,
      member_ids: [
        ...new Set([
          ...(groupDetails.contacts || []),
          ...(groupDetails.other_ids || [])
        ])
      ],
      removed_member_ids: removedContacts
    };

    dispatch(updateGroup(payload));
    toggleEditGroupModal(false);
    resetState();
  };

  const handleDelete = () => {
    if (group && auth) {
      const payload = {
        id: group.id,
        email: auth.email
      };
      dispatch(requestDeleteGroup(payload));
      toggleEditGroupModal(false);
      resetState();
    }
  };

  const handleRemoveMember = id => e => {
    const updatedContacts = currentContacts.filter(item => id !== item.user_id);
    if (!removedContacts.includes(id)) {
      setRemovedContacts([...removedContacts, id]);
    }
    setCurrentContacts(updatedContacts);
  };

  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <EditGroupModal
      theme={{
        modalWidth: typeOfForm === "Edit Contact" ? "60%" : "30%",
        modalMarginTop: typeOfForm === "Edit Contact" ? "initial" : "20vh",
        ...theme
      }}
      className="modal">
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleEditGroupModal(false);
          }}>
          &times;
        </span>
        {isGroupLoading || isGroupMemberLoading ? (
          <Loading />
        ) : (
          <div className="content" id="applicationForm">
            <div className="grid">
              <GroupForm
                contacts={contactSelections}
                groupDetails={groupDetails}
                onSubmit={handleSubmit}
                handleGroupDetailsChange={handleGroupDetailsChange}
              />
            </div>

            <div>
              <GroupContacts
                contacts={currentContacts}
                handleRemoveMember={handleRemoveMember}
              />
              <button
                className="group-delete"
                data-testid="app-dashboard-my-group-new-group-button-save"
                onClick={handleDelete}
                type="submit">
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </EditGroupModal>,
    document.getElementById("modal")
  );
}
