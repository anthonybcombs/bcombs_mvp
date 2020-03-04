import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Contact from "../contact";
const ContactListStyled = styled.div`
  #contact-list {
    padding: 1em;
  }
  #contact-list-header {
    position: relative;
  }
  #contact-list-header button {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 50%;
    background-color: #f26e21;
    color: white;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
  }
`;
export default function index({
  contacts,
  groups,
  setNewContactModalVisible,
  EditContactModal
}) {
  const [selectedContactId, setSelectedContactId] = useState(0);
  const [isEditContactModalVisible, setisEditContactModalVisible] = useState(
    false
  );
  const contact = contacts.find(contact => contact.id === selectedContactId);
  return (
    <ContactListStyled>
      <EditContactModal
        isVisible={isEditContactModalVisible}
        toggleEditContactModal={setisEditContactModalVisible}
        contact={contact || {}}
        groups={groups}
      />
      <div id="contact-list">
        <div id="contact-list-header">
          <h3>Contact List</h3>
          <button onClick={() => setNewContactModalVisible(true)}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
      <div id="contact-list-details">
        {contacts.map(contact => (
          <Contact
            isSelected={selectedContactId === contact.id}
            contactDetails={contact}
            setisEditContactModalVisible={setisEditContactModalVisible}
            setSelectedContactId={setSelectedContactId}
            key={contact.id}
          />
        ))}
      </div>
    </ContactListStyled>
  );
}
