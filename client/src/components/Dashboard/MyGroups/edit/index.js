import React, { useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useDispatch } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";
// import { updateContact } from "../../../../../redux/actions/Contacts";
import {
  updateGroup,
  requestDeleteGroup
} from "../../../../redux/actions/Groups";

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
    height: auto;
  }
  .content {
    display: grid;
    background-color: white;
    padding: 4em;
  }
  .content > div {
  }
  .content > div:nth-child(2) {
    text-align: center !important;
    min-height: 300px;
  }
  .modal-content {
    margin: 1.5em auto;
    width: 70%;
    min-height: 70%;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;

    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
  }
  .group-delete {
    background-color: #e02500 !important;
  }
  .group-submit {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    margin: 10px auto;
    width: 100%;
    border: none;
    margin-top: 5em;
    bottom: 0px;
  }
  .group-name {
    background: none;
    width: 100%;
    color: black;
    font-size: 32px !important;
    display: block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 2.5em;
    margin-bottom: 2.5em;
  }
  @media (min-width: 600px) {
    .content {
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
  groupMembers,
  group,
  typeOfForm = "Edit Group"
}) {
  const [currentContacts, setCurrentContacts] = useState([]);
  const [currentGroupName, setCurrentGroupName] = useState("");
  const [contactSelections, setContactSelections] = useState([]);
  const [selectedContact, setSelectedContact] = useState([]);
  const hasSelectAll = false;

  const resetState = () => {
    setCurrentContacts([]);
    setCurrentGroupName("");
    setContactSelections([]);
    setSelectedContact([]);
  };

  //const [selectedFile, setSelectedFile] = useState([]);
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  console.log("11111 currentContacts", currentContacts);
  console.log("11111 groupMembers", groupMembers);
  console.log("11111 groupppppppppppppppp", group);
  useEffect(() => {
    if (contacts && isVisible && group && group.contacts) {
      const list = group.contacts.map(c => {
        let contact = groupMembers.find(con => con.user_id === c);
        return {
          ...contact
        };
      });
      let selections = [];

      if (groupMembers.length > 0) {
        selections = groupMembers
          .filter(c => !group.contacts.includes(c.user_id))
          .map(c => {
            return {
              id: c.user_id,
              name: `${c.first_name} ${c.last_name}`
            };
          });
      } else {
        selections = contacts.map(c => {
          return {
            id: c.user_id,
            name: `${c.first_name} ${c.last_name}`
          };
        });
      }

      setCurrentGroupName(group.name);
      setCurrentContacts(list);
      setContactSelections(selections);
    }
  }, [group, groupMembers, isVisible]);

  const handleContactSelectChange = value => {
    setSelectedContact(value);
  };
  // const handleFileChange = event => {
  //   setSelectedFile(event.target.files[0]);
  // };
  const handleSubmit = () => {
    if (currentGroupName !== "") {
      const contactIds = selectedContact.map(item => item.id);
      const payload = {
        id: group.id,
        name: currentGroupName,
        member_ids: contactIds,
        email: auth.email
      };

      dispatch(updateGroup(payload));
      toggleEditGroupModal(false);
      resetState();
    }
  };

  const handleDelete = () => {
    if (group && auth) {
      const payload = {
        id: group.id,
        email: auth.email
      };
      dispatch(requestDeleteGroup(payload));
      toggleEditGroupModal(false);
      resetState();
    }
  };

  const handleChangeName = e => {
    const { value } = e.target;
    setCurrentGroupName(value);
  };

  if (!isVisible) {
    return <></>;
  }

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
        <div className="content" id="applicationForm">
          <div className="grid">
            <div className="form-group">
              <div className="field">
                <input
                  name="firstname"
                  className="field-input"
                  placeholder="Group Name"
                  onChange={handleChangeName}
                  value={currentGroupName}
                />
                <label className="field-label">Group Name</label>
              </div>
              <br />
              <div className="field">
                <Multiselect
                  className="field-input"
                  options={contactSelections}
                  hasSelectAll={hasSelectAll}
                  onSelect={handleContactSelectChange}
                  placeholder="Select from existing contacts"
                  displayValue="name"
                  closeIcon="cancel"
                />
                <label className="field-label">
                  Assign to existing contact
                </label>
              </div>
            </div>

            {/* <div className="form-group"></div> */}

            {/* <input type="file" name="file" style={{ marginTop: 24 }} /> */}
            {/* {contactSelections.length > 0 && (
              <ContactSelections
                contacts={contactSelections}
                handleContactSelectChange={handleContactSelectChange}
              />
            )} */}
            {/* <ContactSelections
              contacts={contactSelections}
              handleContactSelectChange={handleContactSelectChange}
            /> */}
          </div>
          <div>
            <GroupContacts contacts={currentContacts} />
            <button
              className="group-submit"
              data-testid="app-dashboard-my-group-new-group-button-save"
              onClick={handleSubmit}
              type="submit">
              Save
            </button>
            <button
              className="group-delete"
              data-testid="app-dashboard-my-group-new-group-button-save"
              onClick={handleDelete}
              type="submit">
              Delete
            </button>
          </div>
        </div>
      </div>
    </EditGroupModal>,
    document.getElementById("modal")
  );
}
