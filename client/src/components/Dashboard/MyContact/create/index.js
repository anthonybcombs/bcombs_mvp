import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { uuid } from "uuidv4";
import { useDispatch } from "react-redux";
import { addContact } from "../../../../redux/actions/Contacts";
import { updateGroup } from "../../../../redux/actions/Groups";
import ContactForm from "../forms/ContactForm";

import graphqlClient from "../../../../graphql";
import { CHECK_USER_EMAIL_QUERY } from "../../../../graphql/query";

const NewContactModal = styled.div`
  h2 {
    text-align: center;
  }
  .modal-content {
    width: 40%;
  }
  @media (min-width: 600px) {
  }
`;
export default function index({
  isVisible = true,
  toggleCreateContactModal,
  contacts,
  groups,
  auth
}) {
  const [isLoading, setLoading] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    id: uuid(),
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    selectedGroups: [],
    userIds: [auth.sub],
    relation: ""
  });

  const dispatch = useDispatch();

  const resetState = () => {
    setContactDetails({
      id: uuid(),
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      selectedGroups: [],
      user_id: "",
      relation: ""
    });
  };
  const handleContactDetailsChange = (id, value) => {
    if (id === "selectedGroups") {
      let selectedGroupIds = value.map(item => item.id);

      setContactDetails({
        ...contactDetails,
        selectedGroups: selectedGroupIds
      });
    } else {
      setContactDetails({
        ...contactDetails,
        [id]: value
      });
    }
  };
  const handleSubmit = async value => {
    setLoading(true);
    if (contactDetails) {
      const isEmailExist = contacts.findIndex(
        item => item.email === contactDetails.email
      );

      if (isEmailExist === -1) {
        const response = await checkUserEmail(contactDetails.email);

        if (response.is_exist) {
          const payload = {
            ...contactDetails,
            authEmail: auth.email
          };
          if (contactDetails.email !== auth.email) {
            dispatch(addContact(payload));
            toggleCreateContactModal(false);
            resetState();
          } else {
            alert(`Email should not match your current email.`);
          }
          setLoading(false);
        } else {
          alert(`Email is not registered!`);
          setLoading(false);
        }
      } else {
        alert(`Email already exist!`);
        setLoading(false);
      }
    }
  };

  const checkUserEmail = async email => {
    try {
      const { data } = await graphqlClient.query({
        query: CHECK_USER_EMAIL_QUERY,
        variables: { email }
      });
      return data.getUserByEmail;
    } catch (err) {
      console.log("CheckUserEmail Error", err);
    }
  };

  if (!isVisible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <NewContactModal className="modal">
      <div id="applicationForm" className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleCreateContactModal(false);
          }}>
          &times;
        </span>
        <div>
          <h2>Create a Contact</h2>
          <ContactForm
            isLoading={isLoading}
            groups={groups}
            contactDetails={contactDetails}
            onSubmit={handleSubmit}
            handleContactDetailsChange={handleContactDetailsChange}
          />
        </div>
      </div>
    </NewContactModal>,
    document.getElementById("modal")
  );
}
