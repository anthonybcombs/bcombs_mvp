import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { updateContact } from "../../../../../redux/actions/Contacts";
import { updateGroup } from "../../../../../redux/actions/Groups";
import EditContactForm from "../../forms/EditContactForm";
import AddToGroupForm from "../../forms/AddToGroupForm";
const EditContactModal = styled.div`
`;
// width: ${({ theme }) => theme.modalWidth};
export default function index({
  isVisible = true,
  toggleEditContactModal,
  auth,
  groups,
  contact,
  typeOfForm = "Edit Contact"
}) {
  const [contactDetails, setContactDetails] = useState({});
  const dispatch = useDispatch();

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
  }, [contact, groups, isVisible]);

  const handleContactDetailsChange = (id, value) => {
    if (id === "selectedGroups") {
      let selectedGroupIds = value.map(item => item.id);

      let removeGroupIds = contactDetails.selectedGroups.filter(
        item => !selectedGroupIds.includes(item)
      );

      setContactDetails({
        ...contactDetails,
        selectedGroups: selectedGroupIds,
        removedGroups: [
          ...new Set([
            ...(contactDetails.removedGroups || []),
            ...(removeGroupIds || [])
          ])
        ]
      });
    } else if (id === "removedGroups") {
      console.log("removeGroupIds value", value);
      let removeGroupIds = value.map(item => item.id);
      console.log("removeGroupIds", removeGroupIds);
      let updatedSelectedGroups = contactDetails.selectedGroups.filter(
        item => !removeGroupIds.includes(item)
      );
      console.log("updatedSelectedGroups", updatedSelectedGroups);
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
    //
    //   //dispatch(updateGroup(group));
    // });

    if (contactDetails) {
      if (contactDetails.email !== auth.email) {
        console.log("contactDetails", contactDetails);
        dispatch(
          updateContact({
            ...contactDetails,
            auth_email: auth.email
          })
        );
        toggleEditContactModal(false);
      } else {
        alert(`Email should not match your current email.`);
      }
    }
  };
  if (!isVisible) {
    return <></>;
  }
  console.log("contactDetailszzz", contactDetails);
  return ReactDOM.createPortal(
    <EditContactModal
      className="modal"
      theme={{
        modalWidth: typeOfForm === "Edit Contact" ? "60%" : "30%",
        modalMarginTop: typeOfForm === "Edit Contact" ? "initial" : "20vh"
      }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {typeOfForm === "Edit Contact" ? "Edit Contact" : "Add to group"}
          </h2>
          <span
            className="close"
            onClick={() => {
              toggleEditContactModal(false);
            }}>
            &times;
          </span>
        </div>
        
        <div className="modal-body">
          <div>
            {typeOfForm === "Edit Contact" ? (
              <EditContactForm
                contact={contact}
                groups={groups}
                isVisible={isVisible}
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
      </div>
    </EditContactModal>,
    document.getElementById("modal")
  );
}
