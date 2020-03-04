import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapsible from "react-collapsible";
import {
  faUserTie,
  faHistory,
  faUserFriends,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import ContactList from "./contactList";
import DuplicatesList from "./duplicatesList";
import FrequentlyContactedList from "./frequentlyContactedList";
import NewContactModal from "./create";
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
    margin: 1em 0 1em 0;
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
  #groups > div > div {
    font-size: 1.2em;
  }
  #groups > div > div > div > div {
    padding: 1em;
  }
  #groups > div > div > div > div > span {
    margin-left: 1em;
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
`;
export default function index() {
  const [selectedLabel, setSelectedLabel] = useState("Contacts");
  const [isNewContactModalVisible, setNewContactModalVisible] = useState(false);
  const handleSelectedLabel = value => {
    setSelectedLabel(value);
  };
  return (
    <MyContactsStyled>
      <NewContactModal
        isVisible={isNewContactModalVisible}
        toggleCreateContactModal={setNewContactModalVisible}
      />
      <h2>Contacts</h2>
      <div id="contacts">
        <div>
          <div id="labels">
            <h3>Labels</h3>
            <div
              className={`${selectedLabel === "Contacts" ? "selected" : ""}`}
              onClick={() => {
                handleSelectedLabel("Contacts");
              }}
            >
              <FontAwesomeIcon icon={faUserTie} />
              <span>Contacts(510)</span>
            </div>
            <div
              className={`${
                selectedLabel === "Fequently Contacted" ? "selected" : ""
              }`}
              onClick={() => {
                handleSelectedLabel("Fequently Contacted");
              }}
            >
              <FontAwesomeIcon icon={faHistory} />
              <span>Frequently Contacted</span>
            </div>
            <div
              className={`${selectedLabel === "Duplicates" ? "selected" : ""}`}
              onClick={() => {
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
              <div>
                <FontAwesomeIcon icon={faUsers} />
                <span>Testing Group1</span>
              </div>
              <div>
                <FontAwesomeIcon icon={faUsers} />
                <span>Testing Group2</span>
              </div>
              <div>
                <FontAwesomeIcon icon={faUsers} />
                <span>Testing Group3</span>
              </div>
            </Collapsible>
          </div>
        </div>
        <div>
          {selectedLabel === "Contacts" && <ContactList />}
          {selectedLabel === "Fequently Contacted" && (
            <FrequentlyContactedList />
          )}
          {selectedLabel === "Duplicates" && <DuplicatesList />}
        </div>
      </div>
    </MyContactsStyled>
  );
}
