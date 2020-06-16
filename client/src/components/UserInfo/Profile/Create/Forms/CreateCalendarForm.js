import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import UploadImage from "../../../../../helpers/UploadImage";
import ErrorMessage from "../../../../../helpers/ErrorMessage";
const CreateCalendarFormStyled = styled.form`
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  input {
    background: none;
    width: 100%;
    color: black;
    font-size: ${({ theme }) => theme.input.fontSize} !important;
    display: block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 2.5em;
    margin-bottom: 2.5em;
  }
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
  }
  input[type="radio"] {
    width: 15px;
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
  }
  #actions {
    margin: 0 auto;
    margin-top: 3em;
    input {
      display: inline-block !important;
    }
    button {
      display: inline-block !important;
      margin: 1em;
    }
    #skip {
      background-color: white;
      color: black;
      border: 1px solid grey;
      box-shadow: none;
    }
  }
  #calendar-privacy-setting {
    input {
      display: inline-block !important;
    }
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
    input {
      width: 50%;
      margin: 0 auto;
    }
  }
`;
export default function CreateCalendarForm({
  details,
  onSubmit,
  onSkip,
  handleInputChange
}) {
  const { register, handleSubmit, errors, setValue, unregister } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  React.useEffect(() => {
    register({ name: "name" }, { required: true });
    register({ name: "visibilityType" }, { required: true });
    register({ name: "image" }, { required: true });
  }, []);
  const theme = useContext(ThemeContext);
  const handleSkip = () => {
    setValue("name", null);
    setValue("visibilityType", null);
    setValue("image", null);
    unregister("name");
    unregister("visibilityType");
    unregister("image");

    handleSubmit(onSkip)();
  };

  return (
    <CreateCalendarFormStyled
      data-testid="app-profile-calendar-create-form"
      theme={theme}
      method="POST"
      onSubmit={handleSubmit(onSubmit)}>
      <input
        data-testid="app-profile-input-calendar-name"
        placeholder="Calendar name"
        name="name"
        onChange={({ target }) => {
          setValue("name", target.value);
          handleInputChange("name", target.value);
        }}
      />
      <ErrorMessage
        field={errors.name}
        errorType="required"
        message="Calendar name is required."
      />
      <p>Calendar Privacy Setting: </p>
      <div id="calendar-privacy-setting">
        <p>
          <input
            type="radio"
            name="visibilityType"
            value={"Private"}
            onChange={({ target }) => {
              setValue("visibilityType", target.value);
              handleInputChange("visibilityType", target.value);
            }}
          />
          Private - only for me
        </p>
        <p>
          <input
            type="radio"
            name="visibilityType"
            value={"Public"}
            onChange={({ target }) => {
              setValue("visibilityType", target.value);
              handleInputChange("visibilityType", target.value);
            }}
          />
          Public - show to all
        </p>
      </div>
      <ErrorMessage
        field={errors.visibilityType}
        errorType="required"
        message="Calendar Privacy setting is required."
      />
      <UploadImage
        handleImageChange={image => {
          setValue("image", image);
          handleInputChange("image", image);
          return false;
        }}
      />
      <ErrorMessage
        field={errors.image}
        errorType="required"
        message="Calendar image is required."
      />
      <div id="actions">
        <button data-testid="app-profile-save-button" type="submit">
          Save and Done!
        </button>
        <button
          data-testid="app-profile-calendar-skip-button"
          id="skip"
          onClick={handleSkip}>
          Skip
        </button>
      </div>
    </CreateCalendarFormStyled>
  );
}
