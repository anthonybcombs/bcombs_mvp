import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { updateContact } from "../../../../../redux/actions/Contacts";
import { updateGroup } from "../../../../../redux/actions/Groups";
import EditContactForm from "../../forms/EditContactForm";
import AddToGroupForm from "../../forms/AddToGroupForm";
const EditContactModal = styled.div`
  h2 {
    text-align: center;
  }
  .modal-content {
    width: 40%;
    margin-top: ${({ theme }) => theme.modalMarginTop};
  }

  @media (min-width: 600px) {
    #content {
      grid-template-columns: 50% 50%;
      grid-gap: 1%;
    }
    button[type="submit"] {
      width: 30%;
    }
`;
// width: ${({ theme }) => theme.modalWidth};
export default function index({
  isVisible = true,
  toggleEditContactModal,
  groups,
  contact,
  typeOfForm = "Edit Contact"
}) {
  const [contactDetails, setContactDetails] = useState({});
  const dispatch = useDispatch();
  console.log("groupzzzs", groups);
  useEffect(() => {
    if (contact.user_id) {
      setContactDetails({
        ...contact,
        selectedGroups: groups
          .filter(group => group.contacts.includes(contact.user_id))
          .map(group => group.id),
        removedGroups: []
      });
    }
  }, [contact, isVisible]);

  const handleContactDetailsChange = (id, value) => {
    if (id === "selectedGroups") {
      let selectedGroupIds = value.map(item => item.id);
      // if (newSelectedGroups.includes(selectedGroupId)) {
      //   newSelectedGroups = newSelectedGroups.filter(
      //     groupId => groupId !== selectedGroupId
      //   );
      // } else {
      //   newSelectedGroups.push(selectedGroupId);
      // }
      let updatedRemovedGroups = contactDetails.removedGroups.filter(
        item => !removeGroupIds.includes(item)
      );
      setContactDetails({
        ...contactDetails,
        selectedGroups: selectedGroupIds,
        removedGroups: updatedRemovedGroups
      });
    } else if (id === "removedGroups") {
      let removeGroupIds = value.map(item => item.id);
      let updatedSelectedGroups = contactDetails.selectedGroups.filter(
        item => !removeGroupIds.includes(item)
      );
      setContactDetails({
        ...contactDetails,
        removedGroups: removeGroupIds,
        selectedGroups: updatedSelectedGroups
      });
    } else {
      setContactDetails({
        ...contactDetails,
        [id]: value
      });
    }
  };
  const handleSubmit = value => {
    // groups.forEach(group => {
    //   if (contactDetails.selectedGroups.includes(group.id)) {
    //     if (!group.contacts.includes(contactDetails.id)) {
    //       group.contacts.push(contactDetails.id);
    //     }
    //   } else {
    //     group.contacts = group.contacts.filter(
    //       contactId => contactId !== contactDetails.id
    //     );
    //   }
    //   console.log("GROUPPPPPPPPPPPP", group);
    //   //dispatch(updateGroup(group));
    // });

    dispatch(updateContact(contactDetails));
    toggleEditContactModal(false);
  };
  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <EditContactModal
      className="modal"
      theme={{
        modalWidth: typeOfForm === "Edit Contact" ? "60%" : "30%",
        modalMarginTop: typeOfForm === "Edit Contact" ? "initial" : "20vh"
      }}>
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleEditContactModal(false);
          }}>
          &times;
        </span>
        <div>
          <h2>
            {typeOfForm === "Edit Contact" ? "Edit Contact" : "Add to group"}
          </h2>
          {typeOfForm === "Edit Contact" ? (
            <EditContactForm
              contact={contact}
              groups={groups}
              contactDetails={contactDetails}
              onSubmit={handleSubmit}
              handleContactDetailsChange={handleContactDetailsChange}
            />
          ) : (
            <AddToGroupForm
              groups={groups}
              contactDetails={contactDetails}
              onSubmit={handleSubmit}
              handleContactDetailsChange={handleContactDetailsChange}
            />
          )}
        </div>
      </div>
    </EditContactModal>,
    document.getElementById("modal")
  );
}
