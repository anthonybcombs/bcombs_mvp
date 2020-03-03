import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapsible from "react-collapsible";
import {
  faUserTie,
  faHistory,
  faUserFriends,
  faUsers,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import Contact from "./contact";
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
  const handleSelectedLabel = value => {
    setSelectedLabel(value);
  };
  return (
    <MyContactsStyled>
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
          <div id="contact-list">
            <div id="contact-list-header">
              <h3>Contact List</h3>
              <button>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
          <div id="contact-list-details">
            <Contact
              isSelected={true}
              contactDetails={{
                name: "Bon Mercado",
                number: "92900912",
                email: "test@yahoo.com",
                relation: "Parent"
              }}
            />
            <Contact
              isSelected={false}
              contactDetails={{
                name: "Black hat",
                number: "0200202",
                email: "test2@yahoo.com",
                relation: "Sibling"
              }}
            />
          </div>
        </div>
      </div>
    </MyContactsStyled>
  );
}
