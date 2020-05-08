import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Select from "react-select";

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

const ContactSelections = ({ contacts, handleContactSelectChange }) => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contactOptions, setContactOptions] = useState([]);
  const [contactDisplay, setContactDisplay] = useState([]);
  useEffect(() => {
    const options = contacts.map(item => {
      return {
        label: `${item.first_name} ${item.last_name}`,
        value: item.id
      };
    });
    setContactOptions(options);
    setContactDisplay(contacts);
  }, [contacts]);

  const handleSelect = value => {
    if (Array.isArray(value)) {
      const ids = value.map(item => item.value);
      const updatedContactDisplay = contacts.filter(
        item => !ids.includes(item.id)
      );
      setContactDisplay(updatedContactDisplay);
      handleContactSelectChange(ids);
    } else if (!value) {
      const options = contacts.map(item => {
        return {
          label: `${item.first_name} ${item.last_name}`,
          value: item.id
        };
      });

      setContactDisplay(contacts);
    }
  };

  return (
    <ContactListStyled>
      <div id="contact-list-details">
        <Select
          isMulti
          options={contactOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={handleSelect}
        />
        {contactDisplay.length > 0 &&
          contactDisplay.map(contact => (
            <ContactStyled>
              <div onClick={handleSelect(contact)}>
                <img src="https://i.picsum.photos/id/1043/200/300.jpg" />
                <p>
                  <div>
                    {contact.first_name} {contact.last_name}
                  </div>
                  <div>{contact.email}</div>
                </p>
              </div>
            </ContactStyled>
          ))}
      </div>
    </ContactListStyled>
  );
};

export default ContactSelections;
