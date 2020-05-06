import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorMessage from "../../../../helpers/ErrorMessage";
const CreateCalendarFormStyled = styled.form`
  text-align: center;
  padding: 2em;
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  svg {
    padding-left: 0.5em;
  }
  input {
    background: none;
    width: 100%;
    color: black;
    font-size: ${({ theme }) => theme.input.fontSize} !important;
    display: inline-block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 2.5em;
    margin-bottom: 2.5em;
  }
  input[type="radio"],
  input[type="checkbox"] {
    width: 15px;
  }
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
  }
  button {
    display: block;
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    background-color: lightgrey;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    padding: 10px;
    margin: 10px auto;
    border: none;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
    width: 100%;
  }
  button[type="submit"] {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
  }
  #family-list,
  #family-list > div {
    display: grid;
  }
  #family-list > div > p {
    display: block;
    position: relative;
    margin: 0;
    padding: 0;
  }
  #buttons-control {
    margin-top: 10em;
  }
  @media (min-width: 600px) {
    button {
      width: 30%;
    }
    input {
      width: 50%;
      margin: 0 auto;
    }
    #family-list {
      grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    }
    #family-list div {
      grid-template-columns: 10% 90%;
      text-align: left;
      padding: 1em;
    }
    #family-list > div > p > span {
      position: absolute;
      display: inline-block;
      top: 6px;
    }
    #buttons-control button {
      display: inline-block;
      margin: 1em;
    }
  }
`;
export default function CreateCalendarForm({
  details,
  familyMembers,
  onSubmit,
  handleInputChange,
  handleCheckBoxChange,
  toggleCreateCalendarModal,
}) {
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const theme = useContext(ThemeContext);
  return (
    <CreateCalendarFormStyled
      data-testid="app-big-calendar-new-create-form"
      theme={theme}
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        data-testid="app-big-calendar-new-input-calendar-name"
        placeholder="Calendar name"
        name="name"
        value={details.name}
        onChange={({ target }) => {
          handleInputChange("name", target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.name}
        errorType="required"
        message="Calendar name is required."
      />
      <p>Calendar Privacy Setting</p>
      <div id="family-list">
        {familyMembers.map((familyMember) => (
          <div key={familyMember.id}>
            <input
              type="checkbox"
              name="family"
              checked={
                details.selectedFamilyMembers.get(
                  familyMember.id.toString()
                ) === true
              }
              value={familyMember.id}
              onChange={handleCheckBoxChange}
              ref={register({ required: true })}
            />
            <p>
              <FontAwesomeIcon
                icon={faSmile}
                size="2x"
                color={familyMember.color}
              />
              <span> {familyMember.name}</span>
            </p>
          </div>
        ))}
      </div>
      <div id="family-members-private">
        <p>
          <input
            type="radio"
            name="family"
            checked={details.visibilityType === "Private"}
            value={"Private"}
            onChange={handleCheckBoxChange}
            ref={register({ required: true })}
          />
          Private- only for me
        </p>
        <p>
          <input
            type="radio"
            name="family"
            checked={details.visibilityType === "Public"}
            value={"Public"}
            onChange={handleCheckBoxChange}
            ref={register({ required: true })}
          />
          Public- show to all
        </p>
      </div>
      <ErrorMessage
        field={errors.name}
        errorType="required"
        message="Calendar Privacy setting is required."
      />
      <div id="buttons-control">
        <button
          data-testid="app-big-calendar-new-cancel-button"
          type="button"
          onClick={() => {
            toggleCreateCalendarModal(false);
          }}
        >
          Cancel
        </button>
        <button data-testid="app-big-calendar-new-save-button" type="submit">
          Save
        </button>
      </div>
    </CreateCalendarFormStyled>
  );
}
