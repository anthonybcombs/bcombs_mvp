import React, { useState } from "react";
import styled from "styled-components";

import Contact from "../../MyContact/contact";

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

const ContactStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1%;
  height: 4em;
  padding: 0.1em;
  margin: 0.5em 0 0.5em 0;
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
`;

const GroupContacts = ({ contacts }) => {
  const [selectedContacts, setSelectedContacts] = useState([]);

  return (
    <ContactListStyled>
      <div id="contact-list-details">
        {contacts.length > 0 &&
          contacts.map(contact => (
            <ContactStyled key={contact.id}>
              <div >
                <img src="https://i.picsum.photos/id/1043/200/300.jpg" />
                <p>
                  <span>
                    {contact.first_name} {contact.last_name}
                  </span>
                </p>
              </div>
              <div>
                <p>{contact.email}</p>
              </div>
              <div>
                <p>{contact.phone_number}</p>
              </div>
            </ContactStyled>
          ))}
      </div>
    </ContactListStyled>
  );
};

export default GroupContacts;
