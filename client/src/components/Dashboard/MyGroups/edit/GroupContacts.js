import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";

import Contact from "../../MyContact/contact";

//  grid-template-columns: repeat(3, 1fr);
const ContactListStyled = styled.div`
  #contact-list {
    padding: 1em;
    height: 150px;
  }
  #contact-list-header {
    position: relative;
  }
  #contact-list-details {
    min-height: 300px;
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

const ContactStyled = styled.div`
  display: grid;
  grid-template-columns: 45% 45% 10%;
  grid-gap: 1%;
  height: 4em;
  padding: 0.5em;
  margin: 1em 0 1em 0;
  border-bottom: 2px solid lightgrey !important;
  div:nth-of-type(1) {
    display: flex;
  }
  div:nth-of-type(1) > img {
    border-radius: 50%;
    width: 4em;
    height: 4em;
  }
  div:nth-of-type(1) > p {
    margin-top: 0.8em;
    margin-left: 5px;
  }
  div:nth-of-type(1) > p > span:nth-of-type(2) {
    color: grey;
  }
  div:nth-of-type(2) p,
  div:nth-of-type(3) p {
    text-align: center;
    color: grey;
  }
  div:nth-of-type(4) {
    display: flex;
    justify-content: flex-end;
  }
  div:nth-of-type(4) button {
    display: block;
    margin-top: -1em;
  }
  .no-member {
    text-align: center !important;
    min-height: 100px !important;
  }
  .group-list-details {
    display: inline-block;
    margin-left: 20px;
  }
  .member-action {
    margin-top: 5px;
  }
  .member-email {
    text-align: left !important;
  }
`;

const GroupContacts = ({ contacts, handleRemoveMember }) => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  console.log("Contactsssssss", contacts);

  return (
    <ContactListStyled>
      <div id="contact-list-details">
        <h4>Members</h4>
        {contacts.length > 0 ? (
          contacts.map(contact => (
            <ContactStyled key={contact.id}>
              <div>
                <img src="https://i.picsum.photos/id/1043/200/300.jpg" />
                <p>
                  {contact.first_name} {contact.last_name}
                  <br />
                  {contact.phone_number}
                </p>
              </div>
              <div>
                <span className="group-list-details member-email">
                  <p>{contact.email}</p>
                  {/* <p>{contact.phone_number}</p> */}
                </span>
              </div>
              <div className="member-action">
                <span
                  className="group-list-details"
                  onClick={handleRemoveMember(contact.user_id)}>
                  <FontAwesomeIcon icon={faMinusCircle} />
                </span>
              </div>
            </ContactStyled>
          ))
        ) : (
          <div className="no-member" style={{ textAlign: "center" }}>
            <h3>No member yet</h3>
          </div>
        )}
      </div>
    </ContactListStyled>
  );
};

export default GroupContacts;
