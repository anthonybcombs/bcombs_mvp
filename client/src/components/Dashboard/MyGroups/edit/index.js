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
    width: 30%;
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
  @media screen and (max-width: 2560px) {
    .modal-content {
      margin: 1.5em auto;
      width: 30%;
      min-height: 70%;
    }
    .group-btn {
      display: flex;
      margin-top: -165px;
      justify-content: center;
    }
    button[type="submit"],.delete-group {
      width: 30%;
      margin-bottom: 20px;
    }
  }

  @media screen and (max-width: 1920px) {
    .modal-content {
      margin: 1.5em auto;
      width: 40%;
      min-height: 70%;
    }
    .group-btn {
      display: flex;
      margin-top: -165px;
      justify-content: center;
    }
    button[type="submit"],.delete-group {
      width: 30%;
      margin-bottom: 20px;
    }
  }
  @media screen and (max-width: 1024px) {
    .modal-content {
      margin: 1.5em auto;
      width: 60%;
      min-height: 70%;
    }
    .group-btn {
      display: flex;
      margin-top: -165px;
      justify-content: center;
    }
    button[type="submit"],.delete-group {
      width: 30%;
      margin-bottom: 20px;
    }
  }
  @media screen and (max-width: 768px) {
    .modal-content {
      margin: 1.5em auto;
      width: 82%;
      min-height: 70%;
    }
    .group-btn {
      display: flex;
      justify-content: center;
    }
    button[type="submit"],.delete-group {
      width: 30%;
      margin-bottom: 20px;
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
  console.log("contactsssssssssssssgroup", group);
  console.log("contactsssssssssssssgroup contacts", contacts);
  console.log("contactsssssssssssssgroup groupMembers", groupMembers);
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
          console.log("currentContact", currentContact);
          return {
            ...contact,
            phone_number: currentContact ? currentContact.phone_number : ""
          };
        })
        .filter(c => c.email);
      console.log("listsssss", list);
      console.log("listsssss groupMembers", groupMembers);
      console.log("listsssss group.contacts", group.contacts);
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
      if (id === "contacts") {
        let ids = value.map(contact => contact.id);

        setGroupDetails({
          ...groupDetails,
          contacts: [...(group.contacts || []), ...ids]
        });
      } else {
        let ids = value.map(contact => contact.id);
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
    console.log("PAYLOADDD", payload);
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

  console.log("contactSelections", contactSelections);
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
                handleDelete={handleDelete}
              />
            </div>

            <div>
              <GroupContacts
                contacts={currentContacts}
                handleRemoveMember={handleRemoveMember}
              />
            </div>
          </div>
        )}
      </div>
    </EditGroupModal>,
    document.getElementById("modal")
  );
}
