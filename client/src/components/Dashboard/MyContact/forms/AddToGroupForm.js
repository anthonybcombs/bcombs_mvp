import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
const AddToGroupFormStyled = styled.form`
  text-align: center;
  label {
    display: inline-block;
    word-wrap: break-word;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    background-color: lightgrey;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
  }
  button[type="submit"] {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    display: block;
    margin: 10px auto;
    width: 100%;
    border: none;
    margin-top: 5em;
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
    margin: 0 auto;
  }
`;
export default function AddToGroupForm({
  contactDetails,
  groups,
  onSubmit,
  handleContactDetailsChange
}) {
  const { handleSubmit } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const theme = useContext(ThemeContext);
  return (
    <AddToGroupFormStyled
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      theme={theme}
    >
      {groups.map(group => (
        <label htmlFor="group" key={group.id}>
          <input
            type="checkbox"
            name="group"
            checked={contactDetails.selectedGroups.includes(group.id)}
            value={group.id}
            onChange={({ target }) => {
              handleContactDetailsChange("selectedGroups", target.value);
            }}
          />
          {group.name}
        </label>
      ))}
      <button type="submit">Save</button>
    </AddToGroupFormStyled>
  );
}
