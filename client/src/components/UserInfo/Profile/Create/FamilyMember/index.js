import React, { useState, useContext } from "react";
import randomColor from "randomcolor";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { ThemeContext } from "styled-components";
import CreateFamilyModal from "./Create/";
const CreateFamilyMemberStyled = styled.div`
  display: block;
  margin: 0 auto;
  background-color: white;
  width: 70%;
  overflow: auto;
  height: auto;
  padding: 5px 30px 5px 30px;
  position: relative;
  top: 3vh;
  box-shadow: 0 0 25px #eae9e9;
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
  h2 {
    text-align: center;
    font-weight: normal;
  }
  #skip {
    padding: 10px;
    width: 100%;
    background-color: grey;
    margin: 0 auto;
  }
  .grid button {
    border-radius: 50% !important;
    padding: 10px;
  }
  .button-holder {
    text-align: center;
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
    .grid {
      grid-template-columns: repeat(12, minmax(200px, 1fr));
      grid-gap: 1%;
    }
    h2 {
      font-weight: bold;
    }
    #skip {
      width: 150px;
    }
  }
`;
export default function index() {
  const [familyMembers, setFamilyMembers] = useState([
    { name: "Molly Mom", type: "Family Manager" },
    { name: "Molly Father", type: "Family Manager" }
  ]);
  const [createFamilyMemberModal, setCreateFamilyMemberModal] = useState(false);
  const theme = useContext(ThemeContext);
  const toggleCreateFamilyModal = () => {
    setCreateFamilyMemberModal(!createFamilyMemberModal);
  };
  return (
    <CreateFamilyMemberStyled
      data-testid="app-profile-create-family-member"
      theme={theme}
    >
      <h2 data-testid="app-profile-create-family-member-header">
        Add Family Member
      </h2>
      <CreateFamilyModal
        visible={createFamilyMemberModal}
        toggleCreateFamilyModal={toggleCreateFamilyModal}
      />
      <p data-testid="app-profile-create-family-member-sub-header">
        Add family members so you can view their schedules in your calendar
      </p>
      <div className="grid">
        {familyMembers.map((family, index) => {
          return (
            <div key={index}>
              <div className="family-member button-holder">
                <button>
                  <FontAwesomeIcon
                    icon={faSmile}
                    size="10x"
                    color={randomColor()}
                  />
                </button>
                <p>
                  <span>{family.name}</span>
                  <span>{family.type}</span>
                </p>
              </div>
            </div>
          );
        })}
        <div>
          <div className="button-holder">
            <button
              data-testid="app-profile-create-family-member-add-family-button"
              id="add-famly-member-button"
              onClick={toggleCreateFamilyModal}
            >
              <FontAwesomeIcon icon={faPlus} size="10x" />
            </button>
            <p>Add family member</p>
          </div>
        </div>
      </div>
      <button
        data-testid="app-profile-create-family-member-skip-button"
        id="skip"
      >
        Skip
      </button>
    </CreateFamilyMemberStyled>
  );
}
