import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
const ProfileModal = styled.div`
  text-align: center;
  .modal-content {
    width: 30%;
    margin-top: 20vh;
  }
  img {
    border-radius: 50%;
    height: 100px;
    width: 100px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  p,
  h3 {
    padding: 0;
    margin: 0.3em;
  }
  @media (min-width: 600px) {
  }
`;
export default function index({
  isVisible = true,
  toggleProfileModal,
  groups,
  contact
}) {
  const [contactDetails, setContactDetails] = useState({});
  useEffect(() => {
    setContactDetails({
      ...contact,
      selectedGroups: groups
        .filter(group => group.contacts.includes(contact.id))
        .map(group => group.id)
    });
  }, [contact, isVisible]);
  if (!isVisible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <ProfileModal className="modal">
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleProfileModal(false);
          }}>
          &times;
        </span>
        <h2>My Profile</h2>
        <div>
          <img src="https://i.picsum.photos/id/1043/200/300.jpg" />
        </div>
        <div>
          <h3>
            {contactDetails.first_name} {contactDetails.last_name}
          </h3>
          <p>Email: {contactDetails.email}</p>
          <p>Phone Number: {contactDetails.phone_number}</p>
          <p>Relation: {contactDetails.relation}</p>
        </div>
      </div>
    </ProfileModal>,
    document.getElementById("modal")
  );
}
