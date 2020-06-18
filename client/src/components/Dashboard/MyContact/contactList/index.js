import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Contact from "../contact";

const ContactListStyled = styled.div`
  #contact-list {
    padding: 2em;
  }
  #contact-list-details {
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
  auth,
  contacts,
  groups,
  setNewContactModalVisible,
  EditContactModal,
  ProfileModal,
  SendMessageModal,
  headerText,
}) {
  const [contactList, setContactList] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(0);
  const [isEditContactModalVisible, setisEditContactModalVisible] = useState(
    false
  );
  const [isProfleModalVisible, setIsProfleModalVisible] = useState(false);
  const [isSendMessageModalVisible, setSendMessageModalVisible] = useState(
    false
  );
  const [
    typeOfFormUsedInEditContact,
    setTypeOfFormUsedInEditContact,
  ] = useState("Edit Contact");
  const contact =
    contacts.find((contact) => contact.id === selectedContactId) || {};

  useEffect(() => {
    if (contacts) {
      // if (headerText === "Duplicates") {
      //   // contacts.map(item => item.phone_number );
      //   const duplicateContacts = contacts.filter(item => {
      //     const currentItem = contacts.find(
      //       subItem =>
      //         subItem.phone_number === item.phone_number &&
      //         subItem.id !== item.id
      //     );
      //     if (currentItem) {
      //       return item;
      //     }
      //   });

      //   setContactList(duplicateContacts);
      // } else {
      //   setContactList(contacts);
      // }
      setContactList(contacts);
    }
  }, [contacts, headerText]);
  console.log("CONTACTTTTTTTTTTT", contact);
  return (
    <ContactListStyled>
      <EditContactModal
        auth={auth}
        isVisible={isEditContactModalVisible}
        toggleEditContactModal={setisEditContactModalVisible}
        contact={contact || {}}
        groups={groups}
        typeOfForm={typeOfFormUsedInEditContact}
      />

      <ProfileModal
        isVisible={isProfleModalVisible}
        toggleProfileModal={setIsProfleModalVisible}
        contact={contact || {}}
        groups={groups}
      />
      {/* <SendMessageModal
        contact={contact || {}}
        isVisible={isSendMessageModalVisible}
        toggleSendMessageModal={setSendMessageModalVisible}
      /> */}
      <div id="contact-list">
        <div id="contact-list-header">
          <h3>{headerText}</h3>
          <button onClick={() => setNewContactModalVisible(true)}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
      <div id="contact-list-details">
        {contactList.length > 0 &&
          contactList.map((contact) => (
            <Contact
              isSelected={selectedContactId === contact.id}
              contactDetails={contact}
              setisEditContactModalVisible={setisEditContactModalVisible}
              setIsProfleModalVisible={setIsProfleModalVisible}
              setSelectedContactId={setSelectedContactId}
              setSendMessageModalVisible={setSendMessageModalVisible}
              setTypeOfFormUsedInEditContact={setTypeOfFormUsedInEditContact}
              key={contact ? contact.id : "1"}
            />
          ))}
      </div>
    </ContactListStyled>
  );
}
