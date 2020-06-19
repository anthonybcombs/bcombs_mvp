import React, { useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import graphqlClient from "../../../../graphql";
import { GET_GROUP_MEMBERS_QUERY } from "../../../../graphql/groupQuery";

// import { updateContact } from "../../../../../redux/actions/Contacts";

// REDUX
//import { updateGroup } from "../../../../../redux/actions/Groups";

import Loading from "../../../../helpers/Loading.js";

const JoinedGroupModal = styled.div`
  h2 {
    text-align: center;
  }
  .modal-content {
    width: ${({ theme }) => theme.modalWidth};
    margin-top: ${({ theme }) => theme.modalMarginTop};
    height: auto;
  }
  .content {
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
    width: 40%;
    min-height: 70%;
  }

  @media (min-width: 600px) {
    button[type="submit"] {
      width: 30%;
    }
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
  .no-member {
    text-align: center !important;
    min-height: 100px !important;
  }
  .member-name {
    margin-top: 16px !important;
  }
`;

export default function index({
  auth,
  isVisible = true,
  toggleJoinGroupModalVisible,
  group,
  typeOfForm = "View Group"
}) {
  const [currentMembers, setCurrentMembers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (group && group.id && isVisible) {
      const triggerGetMembers = async () => {
        try {
          setLoading(true);
          const { data } = await graphqlClient.query({
            query: GET_GROUP_MEMBERS_QUERY,
            variables: { id: group.id }
          });

          setCurrentMembers(data.getGroupMembers);
          setLoading(false);
        } catch (err) {
          console.log("Error", err);
          setCurrentMembers([]);
          setLoading(false);
        }
      };
      triggerGetMembers();
    }
  }, [group, isVisible]);
  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <JoinedGroupModal
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
            toggleJoinGroupModalVisible(false);
          }}>
          &times;
        </span>
        <div className="content">
          <div>
            <h2>{group.name} Members</h2>
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <div id="contact-list-details">
              {currentMembers.length > 0 &&
                currentMembers.map(member => (
                  <ContactStyled key={member.id}>
                    <div>
                      <img src={member.profile_img} />
                      <p className="member-name">
                        <span>
                          {member.first_name} {member.last_name}
                        </span>
                        <br />
                      </p>
                    </div>
                    <div>
                      <p>{member.email}</p>
                    </div>
                  </ContactStyled>
                ))}
            </div>
          )}
        </div>
      </div>
    </JoinedGroupModal>,
    document.getElementById("modal")
  );
}
