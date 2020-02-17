import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
const CreateProfileStyled = styled.form`
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  input,
  select {
    background: none;
    width: 100%;
    color: black;
    font-size: ${({ theme }) => theme.input.fontSize};
    display: block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    outline: 0;
    margin-top: 2.5em;
    margin-bottom: 2.5em;
  }
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    background-color: lightgrey;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
  }
  button[type="submit"] {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    display: block;
    margin: 10px auto;
    border: none;
    width: 200px !important;
    margin-top: 0.5em;
  }
  select {
    display: block;
    width: 100%;
    font-size: ${({ theme }) => theme.select.fontSize};
    border: none;
  }
  select option {
    font-weight: normal;
  }
  h3 {
    text-align: center;
  }
  @media (min-width: 600px) {
    #userTypes {
      grid-template-columns: 50% 50%;
      grid-gap: 0;
    }
  }
`;
export default function Form() {
  const theme = useContext(ThemeContext);
  return (
    <CreateProfileStyled method="POST" theme={theme}>
      <h3>Create my profile</h3>
      <input
        data-testid="app-profile-create-input-firstname"
        name="firstname"
        placeholder="First name"
      />
      <input
        data-testid="app-profile-create-input-lastname"
        name="lastname"
        placeholder="Last name"
      />
      <select
        data-testid="app-profile-create-select-gender"
        name="gender"
        defaultValue={""}
      >
        <option value="" disabled>
          Gender
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <select
        data-testid="app-profile-create-select-family-relationship"
        name="family-relationship"
        defaultValue={""}
      >
        <option value="" disabled>
          Family relationship
        </option>
        <option value="father">Father</option>
        <option value="mother">Mother</option>
        <option value="sibling">Sibling</option>
      </select>
      <input
        data-testid="app-profile-create-input-zip-code"
        name="zipcode"
        type="number"
        placeholder="Zip code"
      />
      <input
        data-testid="app-profile-create-input-date-of-birth"
        name="zipcode"
        type="date"
        placeholder="Date of Birth"
      />
      <button data-testid="app-profile-create-submit-button" type="submit">
        Save and Continue
      </button>
    </CreateProfileStyled>
  );
}
