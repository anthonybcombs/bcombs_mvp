import React, { useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import CreateFamilyModal from "./Create/";
const CreateFamilyMemberStyled = styled.div`
  display: block;
  margin: 0 auto;
  background-color: white;
  width: 50%;
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
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
  }
  h2 {
    text-align: center;
    font-weight: normal;
  }
  #skip {
    padding: 10px;
    margin: 0 auto;
  }
  @media (min-width: 600px) {
    h2 {
      font-weight: bold;
    }
  }
`;
export default function index() {
  const [createFamilyMemberModal, setcreateFamilyMemberModal] = useState(false);
  const theme = useContext(ThemeContext);
  const handleAddFamilyButtonClick = () => {
    setcreateFamilyMemberModal(!createFamilyMemberModal);
  };
  return (
    <CreateFamilyMemberStyled
      data-testid="app-profile-create-family-member"
      theme={theme}
    >
      <h2 data-testid="app-profile-create-family-member-header">
        Add Family Member
      </h2>
      <CreateFamilyModal visible={createFamilyMemberModal} />
      <p data-testid="app-profile-create-family-member-sub-header">
        Add family members so you can view their schedules in your calendar
      </p>
      <div id="family-members">
        <div>
          <button></button>
        </div>
        <div>
          <button
            data-testid="app-profile-create-family-member-add-family-button"
            onClick={handleAddFamilyButtonClick}
          >
            Add family member
          </button>
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
