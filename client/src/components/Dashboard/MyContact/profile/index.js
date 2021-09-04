import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
const ProfileModal = styled.div`
  .modal-content {
    max-width: 420px;
    text-align: center;
  }
  .profile-image > img {
    height: 100px;
    width: 100px;
    border-radius: 100px;
    object-fit: cover;
    box-shadow: 0 3px 6px #ddd;
    border: 1px solid #ec6e33;
  }
  h3, p {
    padding: 0;
    margin: .5rem;
  }
  .profile-details {
    text-align: left;
  }
  .profile-details h3 {
    color: #ec6e33;
    text-align: center;
    margin-bottom: 1.3rem;
  }
  .profile-details label {
    color: grey;
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
        <div className="modal-header">
          <h2>My Profile</h2>
          <span
            className="close"
            onClick={() => {
              toggleProfileModal(false);
            }}>
            &times;
          </span>
        </div>
        
        <div className="modal-body">
          <div className="profile-image">
            <img src={contactDetails.profile_img} />
          </div>
          <div className="profile-details">
            <h3>
              {contactDetails.first_name} {contactDetails.last_name}
            </h3>
            <p><label>Email:</label> {contactDetails.email}</p>
            <p><label>Phone Number:</label> {contactDetails.phone_number}</p>
            <p><label>Relation:</label> {contactDetails.relation}</p>
          </div>
        </div>
      </div>
    </ProfileModal>,
    document.getElementById("modal")
  );
}
