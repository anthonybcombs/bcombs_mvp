import React, { useState, useContext } from "react";
import randomColor from "randomcolor";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { ThemeContext } from "styled-components";
import CreateFamilyModal from "./Create/";
const CreateFamilyMemberStyled = styled.div`
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
  #save {
    margin: 0 auto;
    padding: 10px;
    width: 100%;
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
  .family-member button {
    background-color: transparent !important;
    box-shadow: none;
  }
  .family-member p span {
    display: block;
    color: grey;
  }
  .family-member p span:first-child {
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
    #family-members {
      margin: 0 auto;
      width: 55%;
    }
    h2 {
      font-weight: bold;
    }
    #skip,
    #save {
      width: ${({ theme }) => theme.button.width.primary};
      margin-top: 8em;
    }
  }
`;
export default function index({ setCurrentPage, setProfileDetails }) {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [createFamilyMemberModal, setCreateFamilyMemberModal] = useState(false);
  const theme = useContext(ThemeContext);
  const toggleCreateFamilyModal = () => {
    setCreateFamilyMemberModal(!createFamilyMemberModal);
  };
  const handleNavButton = () => {
    setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
    setProfileDetails(prevProfileDetails => {
      return { ...prevProfileDetails, familyMembers };
    });
  };
  const handleOAddFamilyMember = newFamilyMember => {
    setFamilyMembers([...familyMembers, newFamilyMember]);
  };
  return (
    <CreateFamilyMemberStyled
      data-testid="app-profile-family-member"
      theme={theme}
    >
      <CreateFamilyModal
        visible={createFamilyMemberModal}
        toggleCreateFamilyModal={toggleCreateFamilyModal}
        handleOAddFamilyMember={handleOAddFamilyMember}
      />
      <h2 data-testid="app-profile-family-member-header">Add Family Members</h2>
      <h3 data-testid="app-profile-family-member-sub-header">
        Add family members so you can view their schedules in your calendar
      </h3>
      <div id="family-members" className="grid">
        {familyMembers.map((family, index) => {
          return (
            <div key={index}>
              <div className="family-member button-holder">
                <button>
                  <FontAwesomeIcon
                    icon={faSmile}
                    size="7x"
                    color={randomColor()}
                  />
                </button>
                <p>
                  <span>
                    {family.firstname} {family.lastname}
                  </span>
                  <span>{family.type}</span>
                </p>
              </div>
            </div>
          );
        })}
        <div>
          <div className="button-holder">
            <FontAwesomeIcon
              data-testid="app-profile-family-member-add-family-button"
              onClick={toggleCreateFamilyModal}
              icon={faPlusCircle}
              size="7x"
              color={theme.button.backgroundColor.primary}
            />
            <p>Add family member</p>
          </div>
        </div>
      </div>
      {familyMembers.length > 0 ? (
        <button id="save" onClick={handleNavButton}>
          Continue
        </button>
      ) : (
        <button
          data-testid="app-profile-family-member-skip-button"
          id="skip"
          onClick={handleNavButton}
        >
          Skip
        </button>
      )}
    </CreateFamilyMemberStyled>
  );
}
