import React, { useContext,useEffect,useState } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import CustomMultiSelect from "../../../../helpers/CustomMultiSelect";
//import CustomCropper from "../../../../helpers/CustomCropper";
import UploadImage from "../../../../helpers/UploadImage";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorMessage from "../../../../helpers/ErrorMessage";
import ColorPicker from "../../../../helpers/ColorPicker";
//import Select from "react-select";
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
    margin-top: 2em;
  }
  div[class$="multiValue"] div {
    background-color: #f26e21;
    color: white;
  }
  @media screen and (max-width: 1920px) {
    #buttons-control button {
      width: 20%;
      display: inline-block;
      margin: 1em;
    }
  }
  @media screen and (max-width: 1024px) {
    #buttons-control button {
      width: 20%;
      display: inline-block;
      margin: 1em;
    }
  }
  @media screen and (max-width: 768px) {
    #buttons-control button {
      width: 20%;
      display: inline-block;
      margin: 1em;
    }
  }
  @media (min-width: 600px) {
    input {
      width: 100%;
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
  .form-group .form-control {
    font-size: 18px;
    border: 0;
    border-bottom: 2px solid #ccc;
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 0;
    padding: 10px;
  }

  .field {
    display: flex;
    flex-flow: column-reverse;
    margin-bottom: 1em;
  }

  .field-label,
  .field-input {
    transition: all 0.2s;
    touch-action: manipulation;
  }

  .field-input {
    font-size: 18px;
    border: 0;
    border-bottom: 2px solid #ccc;
    font-family: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 0;
    padding: 5px;
    cursor: text;
    line-height: 1.8;

    padding: 5px 0;
    width: 100%;
    display: block;
    text-indent: 5px;
    margin-top: 8px;
    margin-bottom: -5px;
  }

  .field-label {
    font-size: 12px;
    color: #4b525a;
    margin-right: 79%;
  }

  .field-input:placeholder-shown + .field-label {
    overflow: hidden;
    transform-origin: left bottom;
    transform: translate(0, 2.125rem) scale(1.4);
  }

  .field-input::placeholder {
    opacity: 0;
    transition: inherit;
    font-size: 12px;
  }

  .field-input:focus::placeholder {
    opacity: 1;
  }

  .field-input:focus + .field-label {
    transform: translate(0, 0) scale(1);
    cursor: pointer;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .required {
    color: red;
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
  handleAppGroupSelect,
  handleAppGroupRemove,
  vendors
}) {
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "onSubmit",
  });
  const [appGroups, setAppGroups] = useState([])
  useEffect(() => {
    register({ name: "image" }, { required: true });
    register(
      { name: "color" },
      {
        validate: {
          isColorExist: (value) =>
            !colors.includes(value) || details.color == value,
        },
      }
    );
    if (details && details.image && details.image.length > 0) {
      setValue("image", details.image);
    }
    if (details && details.color && details.color.length > 0) {
      setValue("color", details.color);
    }
  }, []);

  useEffect(() => {
    if(vendors && vendors[0]) {
  
      let appGroupList = vendors.map(v => {
        return v.app_groups.map(appGroup => {
          return  {
            ...appGroup,
            id:appGroup.app_grp_id
          }
        })
      }).flat();
      setAppGroups(appGroupList);
    }
  },[vendors])
  const options = [];
  Object.keys(groups).forEach((key) => {
    groups[key].forEach((data) => {
      options.push({ id: data.id, name: data.name });
    });
  });
  const theme = useContext(ThemeContext);

  const handleGroupSelectChange = (option) => {
    if (option !== null) {
      const groupIds = option.map((group) => group.id);
      handleInputChange("groups", groupIds);
      return;
    }
    handleInputChange("groups", []);
  };

  console.log("selectedCalendar details", details);
  return (
    <CreateCalendarFormStyled
      data-testid="app-big-calendar-new-create-form"
      theme={theme}
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="field-group">
        <div className="field">
          <input
            className="field-input"
            data-testid="app-big-calendar-new-input-calendar-name"
            placeholder="Calendar name"
            name="name"
            value={details.name}
            onChange={({ target }) => {
              handleInputChange("name", target.value);
            }}
            ref={register({ required: true })}
          />
          <label className="field-label">
            <span className="required">*</span> Calendar Name
          </label>
        </div>
        <ErrorMessage
          field={errors.name}
          errorType="required"
          message="Calendar name is required."
        />
      </div>

      <p style={{ marginTop: 30 }}>Calendar Privacy Setting</p>
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
        {/* <CustomMultiSelectOptions
          className="field-input"
          options={options}
          value={options.filter((group) => {
            return details.groups.includes(group.value);
          })}
          onChange={(option) => {
            if (option !== null) {
              const groupIds = option.map((group) => group.value);
              handleInputChange("groups", groupIds);
              return;
            }
            handleInputChange("groups", []);
          }}
          labelledBy={"Select"}
        /> */}

        <CustomMultiSelect
          className="field-input"
          options={options}
          onSelect={handleGroupSelectChange}
          onRemove={handleGroupSelectChange}
          selectedValues={options.filter((item) =>
            details.groups.includes(item.id)
          )}
          placeholder="Select Group"
          displayValue="name"
          closeIcon="cancel"
        />

        {/* <Select
          options={options}
          value={options.map(group => {
            if (details.groups.includes(group.value)) {
              return {
                label: group.label,
                value: group.value
              };
            }
          })}
          isMulti
          closeMenuOnSelect={false}
          onChange={option => {
            if (option !== null) {
              const groupIds = option.map(group => group.value);
              handleInputChange("groups", groupIds);
              return;
            }
            handleInputChange("groups", []);
          }}
          theme={theme => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "#f26e21",
              primary: "#f26e21"
            }
          })}
        /> */}
        {/* <ErrorMessage
          field={errors.groups}
          errorType="required"
          message="Groups is required."
        /> */}
      </div>

      <div className="form-group">
          <div className="field">
            <CustomMultiSelect
              className="field-input"
              options={appGroups}
              onSelect={handleAppGroupSelect}
              onRemove={handleAppGroupRemove}
              placeholder="Add Application Group"
              displayValue="name"
              closeIcon="cancel"
            />
          </div>
        </div>

      <div id="family-members-private">
        <p>
          <span style={{ color: "red", fontSize: 20 }}>*</span>
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
      {details && details.color && details.color.length > 0 && (
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
      <label style={{ float: "left", marginBottom: 20 }}>
        <span style={{ color: "red", fontSize: 20 }}>*</span>
      </label>
      <UploadImage
        displayImage={details.image}
        handleImageChange={(image) => {
          setValue("image", image);
          handleInputChange("image", image);
          return false;
        }}
      />
      {/* <CustomCropper
      
        cropend={cropend}
      /> */}
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
