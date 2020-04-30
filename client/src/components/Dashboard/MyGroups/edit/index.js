import React, { useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useDispatch } from "react-redux";
// import { updateContact } from "../../../../../redux/actions/Contacts";
import { updateGroup } from "../../../../redux/actions/Groups";
// import EditContactForm from "../../forms/EditContactForm";
// import AddToGroupForm from "../../forms/AddToGroupForm";

import ContactSelections from "./ContactSelections";
import GroupContacts from "./GroupContacts";
import GroupPhoto from "./GroupPhoto";

// REDUX
//import { updateGroup } from "../../../../../redux/actions/Groups";

const EditGroupModal = styled.div`
  h2 {
    text-align: center;
  }
  .modal-content {
    width: ${({ theme }) => theme.modalWidth};
    margin-top: ${({ theme }) => theme.modalMarginTop};
  }
  #content {
    display: grid;
    background-color: white;
    padding: 4em;
  }
  #content > div:first-child {
  }
  .modal-content {
    margin: 1.5em auto;
    width: 80%;
    min-height: 80%;
  }
  button[type="submit"] {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    width: 100%;
    display: block;
    margin: 20px auto;
    border: none;
    color: white;
  }
  @media (min-width: 600px) {
    #content {
      grid-template-columns: 50% 50%;
      grid-gap: 1%;
    }
    button[type="submit"] {
      width: 30%;
    }
  }
`;

export default function index({
  auth,
  isVisible = true,
  toggleEditGroupModal,
  contacts,
  group,
  typeOfForm = "Edit Group"
}) {
  const [currentContacts, setCurrentContacts] = useState([]);
  const [contactSelections, setContactSelections] = useState([]);
  const [selectedContact, setSelectedContact] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  useEffect(() => {
    if (contacts && group && group.contacts && isVisible) {
      const list = group.contacts.map(c => {
        let contact = contacts.find(con => con.id === c);
        return {
          ...contact
        };
      });

      const selections = contacts.filter(c => !group.contacts.includes(c.id));
      setCurrentContacts(list);
      setContactSelections(selections);
    }
  }, [contacts, group, isVisible]);

  const handleContactSelectChange = value => {
    setSelectedContact(value);
  };
  const handleFileChange = event => {
    setSelectedFile(event.target.files[0]);
  };
  const handleSubmit = () => {
    let data = new FormData();
    if (selectedFile) {
      data.append("file", selectedFile);
    }
    data.append("email", auth.email);
    data.append("selected_contacts", selectedContact);

    // const payload = {
    //   id: group.id,
    //   member_ids: selectedContact,
    //   file: selectedFile
    // };

    dispatch(updateGroup(data));
  };

  /*

    id: String,
        member_ids: [String]
        file: File
        */
  if (!isVisible) {
    return <></>;
  }

  console.log("selectedContact", selectedContact);

  return ReactDOM.createPortal(
    <EditGroupModal
      theme={{
        modalWidth: typeOfForm === "Edit Contact" ? "60%" : "30%",
        modalMarginTop: typeOfForm === "Edit Contact" ? "initial" : "20vh",
        ...theme
      }}
      className="modal">
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleEditGroupModal(false);
          }}>
          &times;
        </span>
        <div id="content">
          <div>
            <GroupPhoto />
            <input type="file" name="file" />
            <br />
            <ContactSelections
              contacts={contactSelections}
              handleContactSelectChange={handleContactSelectChange}
            />
          </div>
          <div>
            <GroupContacts contacts={currentContacts} />
            <button
              data-testid="app-dashboard-my-group-new-group-button-save"
              onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </div>
    </EditGroupModal>,
    document.getElementById("modal")
  );
}
