import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import UploadImage from "../../../../helpers/UploadImage";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorMessage from "../../../../helpers/ErrorMessage";
import ColorPicker from "../../../../helpers/ColorPicker";
import Select from "react-select";
const CreateCalendarFormStyled = styled.form`
  text-align: center;
  padding: 2em;
  > * {
    font-size: 13px !important;
  }
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
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 2.5em;
    margin-bottom: 2.5em;
  }
  input[type="radio"],
  input[type="checkbox"] {
    width: 15px;
  }
  input[type="text"]:focus {
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
  colors = [],
  details,
  familyMembers,
  groups,
  onSubmit,
  handleInputChange,
  handleCheckBoxChange,
  onCancel,
}) {
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "onSubmit",
  });
  React.useEffect(() => {
    register({ name: "image" }, { required: true });
    // register({ name: "groups" }, { required: true });
    register(
      { name: "color" },
      {
        validate: {
          isColorExist: (value) =>
            !colors.includes(value) || details.color == value,
        },
      }
    );
    if (details.image.length > 0) {
      setValue("image", details.image);
    }
    if (details.color.length > 0) {
      setValue("color", details.color);
    }
  }, []);
  const options = [];
  Object.keys(groups).forEach((key) => {
    groups[key].forEach((data) => {
      options.push({ value: data.id, label: data.name });
    });
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
              <span style={{ marginLeft: "2px" }}>
                {familyMember.firstname} {familyMember.lastname}
              </span>
            </p>
          </div>
        ))}
      </div>
      <div>
        <p>Groups</p>
        <Select
          options={options}
          value={options.map((group) => {
            if (details.groups.includes(group.value)) {
              return {
                label: group.label,
                value: group.value,
              };
            }
          })}
          isMulti
          ref={register({ required: true })}
          onChange={(option) => {
            const groupIds = option.map((group) => group.value);
            handleInputChange("groups", groupIds);
            setValue("groups", groupIds);
          }}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "#f26e21",
              primary: "#f26e21",
            },
          })}
        />
        {/* <ErrorMessage
          field={errors.groups}
          errorType="required"
          message="Groups is required."
        /> */}
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
          Private - only for me
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
          Public - show to all
        </p>
      </div>
      <ErrorMessage
        field={errors.name}
        errorType="required"
        message="Calendar Privacy setting is required."
      />
      {details.color.length > 0 && (
        <>
          <ColorPicker
            color={details.color}
            setColor={(color) => {
              setValue("color", color);
              handleInputChange("color", color);
            }}
          />
          <ErrorMessage
            field={errors.color}
            errorType="required"
            message="Color is required"
          />
          <ErrorMessage
            field={errors.color}
            errorType="isColorExist"
            message="Color is already used in other calendar."
          />
        </>
      )}
      <UploadImage
        displayImage={details.image}
        handleImageChange={(image) => {
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
      <div id="buttons-control">
        <button
          data-testid="app-big-calendar-new-cancel-button"
          type="button"
          onClick={() => onCancel()}
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
