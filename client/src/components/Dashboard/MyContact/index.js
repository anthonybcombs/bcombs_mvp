import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
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
import ProfileModal from "./profile/";
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
  #groups {
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
  #groups > button {
    display: block;
    margin-left: 1em;
  }
  #groups > button > span {
    padding: 1em;
    font-size: 1.2em !important;
  }
  #groups > div > div {
    font-size: 1.2em;
  }
  #groups > div > div > div > div {
    padding: 1em;
  }
  #groups > div > div > div > div > span {
    margin-left: 1em;
  }
  #groups > div {
    cursor: pointer;
  }
  #groups .selected {
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
  const [selectedGroupId, setSelectedGroupId] = useState(0);
  const [isNewContactModalVisible, setNewContactModalVisible] = useState(false);
  const [iseNewGroupModalVisible, setIsNewGroupModalVisible] = useState(false);
  const { auth, groups, contacts } = useSelector(
    ({ auth, groups, contacts }) => {
      return { auth, groups, contacts };
    }
  );
  const selectedGroup = groups.find(group => group.id === selectedGroupId);
  const filteredContacts = contacts.filter(contact => {
    if (selectedGroupId === 0) {
      return true;
    }
    return selectedGroup.contacts.includes(contact.id);
  });
  const handleSelectedLabel = value => {
    setSelectedLabel(value);
  };
  const handleSelectedGroupid = value => {
    setSelectedGroupId(value);
  };
  return (
    <MyContactsStyled>
      <NewContactModal
        isVisible={isNewContactModalVisible}
        toggleCreateContactModal={setNewContactModalVisible}
        groups={groups}
        auth={auth}
      />
      <NewGroupModal
        isVisible={iseNewGroupModalVisible}
        toggleCreateGroupModal={setIsNewGroupModalVisible}
        contacts={contacts}
        auth={auth}
      />
      <h2>Contacts</h2>
      <div id="contacts">
        <div>
          <div id="labels">
            <h3>Labels</h3>
            <div
              className={`${selectedLabel === "Contacts" ? "selected" : ""}`}
              onClick={() => {
                handleSelectedGroupid(0);
                handleSelectedLabel("Contacts");
              }}
            >
              <FontAwesomeIcon icon={faUserTie} />
              <span>Contacts({filteredContacts.length})</span>
            </div>
            <div
              className={`${
                selectedLabel === "Fequently Contacted" ? "selected" : ""
              }`}
              onClick={() => {
                handleSelectedGroupid(0);
                handleSelectedLabel("Fequently Contacted");
              }}
            >
              <FontAwesomeIcon icon={faHistory} />
              <span>Frequently Contacted</span>
            </div>
            <div
              className={`${selectedLabel === "Duplicates" ? "selected" : ""}`}
              onClick={() => {
                handleSelectedGroupid(0);
                handleSelectedLabel("Duplicates");
              }}
            >
              <FontAwesomeIcon icon={faUserFriends} />
              <span>Duplicates</span>
            </div>
          </div>
          <div id="groups">
            <Collapsible trigger={<h3>Groups</h3>} open lazyRender>
              <hr />
              {groups.map(group => (
                <div
                  className={`${
                    group.id === selectedGroupId ? "selected" : ""
                  }`}
                  key={group.id}
                  onClick={() => {
                    handleSelectedGroupid(group.id);
                  }}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  <span>{group.name}</span>
                </div>
              ))}
            </Collapsible>
            <hr />
            <button
              onClick={() => {
                setIsNewGroupModalVisible(true);
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span> ADD NEW GROUP</span>
            </button>
          </div>
        </div>
        <div>
          <ContactList
            headerText={selectedLabel}
            contacts={filteredContacts}
            groups={groups}
            EditContactModal={EditContactModal}
            setNewContactModalVisible={setNewContactModalVisible}
            ProfileModal={ProfileModal}
            SendMessageModal={SendMessageModal}
          />
        </div>
      </div>
    </MyContactsStyled>
  );
}
