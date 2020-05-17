import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import Collapsible from "react-collapsible";
import {
  faUserTie,
  faHistory,
  faUserFriends,
  faUsers,
  faPlus
} from "@fortawesome/free-solid-svg-icons";

import ContactList from "./contactList";
import NewContactModal from "./create";
import EditContactModal from "./edit/contact";
import SendMessageModal from "./message";
import NewGroupModal from "../MyGroups/create";
import EditGroupModal from "../MyGroups/edit";
import JoinedGroupModal from "../MyGroups/view";

import ProfileModal from "./profile/";

// REDUX
import { getContact } from "../../../redux/actions/Contacts";
import {
  requestUserGroup,
  requestMembers
} from "../../../redux/actions/Groups";

const MyContactsStyled = styled.div`
  .selected {
    background-color: #cdcdcd;
  }
  padding: 1em;
  button {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
  #contacts {
    display: grid;
  }
  #labels,
  .groups {
    padding: 1em;
  }
  #labels > div {
    padding: 1em;
    font-size: 1.2em;
    cursor: pointer;
  }
  #labels > div.selected {
    background: #f26e21;
    color: white;
  }
  #labels > div > span {
    margin-left: 1em;
  }
  #contacts > div {
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }
  #contacts > div:nth-of-type(2) {
    margin-right: 0.5em;
  }
  .groups > button {
    display: block;
    margin-left: 1em;
  }
  .groups > button > span {
    padding: 1em;
    font-size: 1.2em !important;
  }
  .groups > div > div {
    font-size: 1.2em;
  }
  .groups > div > div > div > div {
    padding: 1em;
  }
  .groups > div > div > div > div > span {
    margin-left: 1em;
  }
  .groups > div {
    cursor: pointer;
  }
  .groups .selected {
    background: #f26e21 !important;
    color: white !important;
  }
  .Collapsible__trigger {
    cursor: pointer;
  }
  .is-closed h3:after {
    content: "↓";
    font-size: 1em;
    color: black;
    margin-left: 0.5em;
  }
  .is-open h3:after {
    content: "↑";
    font-size: 1em;
    color: black;
    margin-left: 0.5em;
  }
  @media (min-width: 600px) {
    #contacts {
      grid-template-columns: 25% 75%;
      grid-gap: 1%;
    }
  }
  @media (min-width: 1500px) {
    #contacts > div:nth-of-type(2) {
      margin-right: 1em;
    }
  }
`;
export default function index() {
  const [selectedLabel, setSelectedLabel] = useState("Contacts");
  const [currentContacts, setCurrentContacts] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [isNewContactModalVisible, setNewContactModalVisible] = useState(false);
  const [isEditGroupModalVisible, setEditGroupModalVisible] = useState(false);
  const [isNewGroupModalVisible, setIsNewGroupModalVisible] = useState(false);
  const [isJoinedGroupModalVisible, setJoinedGroupModalVisible] = useState(
    false
  );

  const { auth, groups, groupMembers, contacts, loading } = useSelector(
    ({ auth, groups, groupMembers, contacts, loading }) => {
      return { auth, groups, groupMembers, contacts, loading };
    }
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (auth.email) {
      dispatch(requestUserGroup(auth.email));
    }

    if (contacts) {
      setCurrentContacts(contacts);
    }
  }, [contacts]);
  useEffect(() => {
    dispatch(getContact(auth.email));
    setCurrentContacts(contacts);
  }, []);

  // const selectedGroup = groups.find(group => group.id === selectedGroupId);
  const filteredContacts = contacts.filter(contact => {
    if (selectedGroupId === 0) {
      return true;
    }
    return (
      selectedGroup &&
      selectedGroup.contacts &&
      selectedGroup.contacts.includes(contact.id)
    );
  });

  const handleSelectedLabel = value => {
    setSelectedLabel(value);

    if (value === "Duplicates") {
      setCurrentContacts(getDuplicateContacts());
    } else {
      setCurrentContacts(filteredContacts);
    }
  };

  const getDuplicateContacts = () => {
    return contacts && contacts.length > 0
      ? contacts.filter(item => {
          const currentItem = contacts.find(
            subItem =>
              subItem.phone_number === item.phone_number &&
              subItem.id !== item.id
          );
          if (currentItem) {
            return item;
          }
        })
      : [];
  };

  const handleSelectedGroup = group => {
    //setSelectedGroupId(group.id);
    setSelectedGroup(group);

    if (group) {
      dispatch(requestMembers(group.id));
      setTimeout(() => {
        setEditGroupModalVisible(true);
      }, 500);
    }
  };

  const handleJoinedGroupModal = group => {
    setSelectedGroup(group);
    setJoinedGroupModalVisible(true);
  };
  const editGroupSubmit = data => {};
  console.log("groupMembers", loading);
  return (
    <MyContactsStyled>
      <NewContactModal
        contacts={contacts}
        groups={(groups && groups.created_groups) || []}
        isVisible={isNewContactModalVisible}
        toggleCreateContactModal={setNewContactModalVisible}
        auth={auth}
      />
      <NewGroupModal
        isVisible={isNewGroupModalVisible}
        toggleCreateGroupModal={setIsNewGroupModalVisible}
        contacts={contacts}
        auth={auth}
      />

      <JoinedGroupModal
        auth={auth}
        group={selectedGroup}
        isVisible={isJoinedGroupModalVisible}
        toggleJoinGroupModalVisible={setJoinedGroupModalVisible}
      />

      <EditGroupModal
        auth={auth}
        contacts={contacts}
        groupMembers={groupMembers}
        group={selectedGroup}
        isVisible={isEditGroupModalVisible}
        isGroupMemberLoading={loading.groupMembers}
        onSubmit={editGroupSubmit}
        toggleEditGroupModal={setEditGroupModalVisible}
      />

      <h2>Contacts </h2>
      <div id="contacts">
        <div>
          <div id="labels">
            <h3>Labels</h3>
            <div
              className={`${selectedLabel === "Contacts" ? "selected" : ""}`}
              onClick={() => {
                handleSelectedGroup(null);
                handleSelectedLabel("Contacts");
              }}>
              <FontAwesomeIcon icon={faUserTie} />
              <span>Contacts({filteredContacts.length})</span>
            </div>
            <div
              className={`${
                selectedLabel === "Fequently Contacted" ? "selected" : ""
              }`}
              onClick={() => {
                handleSelectedGroup(null);
                handleSelectedLabel("Fequently Contacted");
              }}>
              <FontAwesomeIcon icon={faHistory} />
              <span>Frequently Contacted</span>
            </div>
            <div
              className={`${selectedLabel === "Duplicates" ? "selected" : ""}`}
              onClick={() => {
                handleSelectedGroup(null);
                handleSelectedLabel("Duplicates");
              }}>
              <FontAwesomeIcon icon={faUserFriends} />
              <span>Duplicates {getDuplicateContacts().length || 0}</span>
            </div>
          </div>
          <div className="groups">
            <Collapsible trigger={<h3>Groups</h3>} open lazyRender>
              <hr />
              {groups &&
                groups.created_groups &&
                groups.created_groups.map(group => (
                  <div
                    className={`${
                      group.id === selectedGroupId ? "selected" : ""
                    }`}
                    key={group.id}
                    onClick={() => {
                      handleSelectedGroup(group);
                    }}>
                    <FontAwesomeIcon icon={faUsers} />
                    <span>{group.name}</span>
                  </div>
                ))}
            </Collapsible>
            <hr />
            <button
              onClick={() => {
                setIsNewGroupModalVisible(true);
              }}>
              <FontAwesomeIcon icon={faPlus} />
              <span> ADD NEW GROUP</span>
            </button>
          </div>

          <div className="groups">
            {groups && groups.joined_groups && groups.joined_groups.length > 0 && (
              <>
                <Collapsible trigger={<h3>Joined Groups</h3>} open lazyRender>
                  <hr />
                  {groups &&
                    groups.joined_groups.map(group => (
                      <div
                        className={`${
                          group.id === selectedGroupId ? "selected" : ""
                        }`}
                        key={group.id}
                        onClick={() => {
                          handleJoinedGroupModal(group);
                        }}>
                        <FontAwesomeIcon icon={faUsers} />
                        <span>{group.name}</span>
                      </div>
                    ))}
                </Collapsible>
                <hr />
              </>
            )}
          </div>
        </div>
        <div>
          {loading.contacts ? (
            <h1>Loading...</h1>
          ) : (
            <ContactList
              auth={auth}
              headerText={selectedLabel}
              contacts={currentContacts}
              groups={(groups && groups.created_groups) || []}
              setNewContactModalVisible={setNewContactModalVisible}
              EditContactModal={EditContactModal}
              ProfileModal={ProfileModal}
              SendMessageModal={SendMessageModal}
            />
          )}
        </div>
      </div>
    </MyContactsStyled>
  );
}
