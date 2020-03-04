import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Contact from "../contact";
const FrequentlyContactedStyled = styled.div`
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
export default function index() {
  return (
    <FrequentlyContactedStyled>
      <div id="contact-list">
        <div id="contact-list-header">
          <h3>Frequently Contacted</h3>
          <button onClick={() => setNewContactModalVisible(true)}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
      <div id="contact-list-details">
        <Contact
          isSelected={true}
          contactDetails={{
            name: "Bon Mercado",
            phoneNumber: "92900912",
            email: "test@yahoo.com",
            relation: "Parent"
          }}
        />
        <Contact
          isSelected={false}
          contactDetails={{
            name: "Black hat",
            phoneNumber: "0200202",
            email: "test2@yahoo.com",
            relation: "Sibling"
          }}
        />
      </div>
    </FrequentlyContactedStyled>
  );
}
