import React, { useState, useContext } from "react";
import randomColor from "randomcolor";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { ThemeContext } from "styled-components";
import CreateMemberModal from "./Create/";
const CreateMemberStyled = styled.div`
  display: block;
  margin: 0 auto;
  background-color: white;
  width: 80%;
  overflow: auto;
  height: auto;
  padding: 5px 30px 5px 30px;
  position: relative;
  top: 3vh;
  box-shadow: 0 0 25px #eae9e9;
  text-align: center;
  button {
    display: block;
    color: ${({ theme }) => theme.button.textColor.primary};
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    padding-top: 1em;
    padding-bottom: 1em;
    border-radius: ${({ theme }) => theme.button.borderRadius};
  }
  h2,
  h3 {
    font-weight: normal;
  }
  #skip {
    padding: 10px;
    width: 100%;
    background-color: white;
    color: black;
    margin: 0 auto;
    border: 1px solid grey;
    border-radius: 40px;
    box-shadow: none;
  }
  .grid button {
    border-radius: 52% !important;
    padding: 10px;
  }
  .button-holder {
    margin-top: 3em;
  }
  .button-holder > .fa-plus-circle {
    cursor: pointer;
  }
  .button-holder button {
    margin: 0 auto;
  }
  .button-holder p {
    color: ${({ theme }) => theme.button.textColor.secondary};
    font-weight: bold;
  }
  .member button {
    background-color: transparent !important;
    box-shadow: none;
  }
  .member p span {
    display: block;
    color: grey;
  }
  .member p span:first-child {
    color: black;
  }
  @media (min-width: 600px) {
    .button-holder {
      float: left;
    }
    .grid {
      grid-template-columns: repeat(12, minmax(210px, 1fr));
      grid-gap: 1%;
    }
    #members {
      margin: 0 auto;
      width: 55%;
    }
    h2 {
      font-weight: bold;
    }
    #skip {
      width: ${({ theme }) => theme.button.width.primary};
      margin-top: 8em;
    }
  }
`;
export default function index({ setCurrentPage }) {
  const [members, setMembers] = useState([
    { name: "Molly Mom", type: "Family Manager" }
  ]);
  const [createMemberModal, setCreateMemberModal] = useState(false);
  const theme = useContext(ThemeContext);
  const toggleMemberModal = () => {
    setCreateMemberModal(!createMemberModal);
  };
  const handleOncliSkipButton = () => {
    setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
  };
  return (
    <CreateMemberStyled data-testid="app-profile-member" theme={theme}>
      <h2 data-testid="app-profile-member-header">Add Members</h2>
      <CreateMemberModal
        visible={createMemberModal}
        toggleMemberModal={toggleMemberModal}
      />
      <p data-testid="app-profile-member-sub-header">
        Add members so you can easily see calendars.
      </p>
      <div id="members" className="grid">
        {members.map((member, index) => {
          return (
            <div key={index}>
              <div className="member button-holder">
                <button>
                  <FontAwesomeIcon
                    icon={faSmile}
                    size="7x"
                    color={randomColor()}
                  />
                </button>
                <p>
                  <span>{member.name}</span>
                  <span>{member.type}</span>
                </p>
              </div>
            </div>
          );
        })}
        <div>
          <div className="button-holder">
            <FontAwesomeIcon
              data-testid="app-profile-member-add-button"
              onClick={toggleMemberModal}
              icon={faPlusCircle}
              size="7x"
              color={theme.button.backgroundColor.primary}
            />
            <p>Add a member</p>
          </div>
        </div>
      </div>
      <button
        data-testid="app-profile-member-skip-button"
        id="skip"
        onClick={handleOncliSkipButton}
      >
        Skip
      </button>
    </CreateMemberStyled>
  );
}
