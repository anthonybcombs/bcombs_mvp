import React, { useCallback, useEffect, useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import ErrorMessage from "../../../../helpers/ErrorMessage";
import CustomMultiSelect from "../../../../helpers/CustomMultiSelect";
import CustomMultiSelectOptions from "../../../../helpers/CustomMultiSelectOptions";

const ContactFormStyled = styled.form`
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  input[type="checkbox"] {
    display: inline-block;
    width: initial;
    vertical-align: middle;
    margin: 0 10px 0 0 !important;
  }

  label {
    display: block;
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
  button[type="submit"],
  .delete-group {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    display: block;
    width: 100%;
    border: none;
    margin-top: 15em;
  }

  #multiselectContainerReact .optionContainer li:hover,
  #multiselectContainerReact .optionContainer li.highlight {
    background: #f26e21;
  }

  #multiselectContainerReact div:first-child {
    border: 0;
    border-bottom: 2px solid #ccc;
    border-radius: 0;
  }

  #multiselectContainerReact .searchBox {
    font-size: 18px;
    padding: 5px 0;
    margin: 0;
    margin-top: 2px;
  }

  #multiselectContainerReact .searchBox::placeholder {
    font-size: 12px;
  }

  #multiselectContainerReact .chip {
    background: #f26e21;
  }

  input {
    background: none;
    width: 100%;
    color: black;

    display: block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 30px;
    margin-bottom: 30px;
    outline: 0;
  }

  .user-tag {
    padding: 4px 10px;
    background: #f26e21;
    margin-right: 5px;
    margin-bottom: 5px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    font-size: 13px;
    color: #fff;
    white-space: nowrap;
  }

  .group-btn {
    display: flex;
    margin-top: -32%;
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
/*

 input,
    p.error {
      width: 50%;
      margin: 2.5em auto 2.5em auto;
    }
    div {
      width: 50%;
      margin: 2.5em auto 2.5em auto;
    }*/

export default function AppGroupForm({
  groupDetails,
  onSubmit,
  handleDelete,
  handleGroupDetailsChange,
  action,
  vendorError,
  formattedVendors = [],
  currentAppGroup = {},
  selectedForms = [],
  isEditMode = { isEditMode }
}) {
  const [vendorOptions, setVendorOptions] = useState([]);
  const [otherUserSelected, setOtherUserSelected] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [autoCompleteValue, setAutoCompleteValue] = useState("");
  const [isFetching, setFetching] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [sForms, setForms] = useState();

  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const hasSelectAll = false;

  const theme = useContext(ThemeContext);

  const handleSelectChange = value => {
    console.log("handleSelectChange value", value);
    console.log('handleSelectChange options', formattedVendors)
    console.log("sample 123456")
    handleGroupDetailsChange("vendors", value);
  };

  useEffect(() => {
    // if(selectedForms.length > 0) {
    //   currentAppGroup = {...currentAppGroup, ["vendors"]: selectedForms};
    // }
    console.log("Im here 12345");
    console.log("currentAppGroup3", currentAppGroup);
    console.log("selectedForms selectedForms", selectedForms);
    handleGroupDetailsChange("vendors", selectedForms);
  }, [formattedVendors, selectedForms])

  console.log("groupDetails", groupDetails);
  console.log(';selectedForms',selectedForms)
  return (
    <ContactFormStyled
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      theme={theme}>
      <div className="grid">
        <div className="form-group">
          <div className="field">
            <input
              name="appGroupName"
              className="field-input"
              placeholder="Group Name"
              onChange={({ target }) => {
                handleGroupDetailsChange("name", target.value);
              }}
              ref={register({ required: true })}
              defaultValue={groupDetails.name}
            />
            <label className="field-label">
              <span className="required">*</span> Group Name
            </label>
          </div>
          <ErrorMessage
            field={errors.appGroupName}
            errorType="required"
            message="Group Name is required."
          />
        </div>

        <div className="form-group">
          <div className="field">
            <input
              name="appGroupSize"
              className="field-input"
              placeholder="Total No. of Seats"
              onChange={({ target }) => {
                if (target.value.match(/^-{0,1}\d+$/)) {
                  handleGroupDetailsChange("size", target.value);
                } else {
                  target.value = target.value.slice(0, -1);
                }
              }}
              ref={register({ required: true })}
              defaultValue={groupDetails.size}
            />
            <label className="field-label">
              <span className="required">*</span> Total No. of Seats
            </label>
          </div>
          <ErrorMessage
            field={errors.appGroupSize}
            errorType="required"
            message="Total No. of Seats is required."
          />
        </div>
        {
          formattedVendors.length > 0 ? (
            <div className="form-group">
              <div className="field">
                <CustomMultiSelect
                  className="field-input"
                  options={formattedVendors}
                  hasSelectAll={hasSelectAll}
                  // selectedValues={vendorOptions.filter(
                  //   item => item.id === groupDetails.vendor
                  // )}
                  selectedValues={selectedForms}
                  onSelect={handleSelectChange}
                  onRemove={handleSelectChange}
                  placeholder="Choose Form"
                  displayValue="name"
                  closeIcon="cancel"
                />
              </div>
              <input
                type="checkbox"
                name="form_select_all"
                onChange={e => {
                  console.log('e.target.checked', e.target.checked)
                  if (e.target.checked) {
                    console.log('formattedVendors', formattedVendors)
                    handleGroupDetailsChange("vendors", formattedVendors);
                  }
                  else {
                    handleGroupDetailsChange("vendors", []);
                  }
                }}

              /> Select All
              {vendorError !== "" && (
                <span style={{ color: "red" }}>{vendorError}</span>
              )}
            </div>
          ) : ""
        }

      </div>
      <div className="group-btn">
        <button type="submit" disabled={!formattedVendors.length > 0}>Save</button>
        {action !== "create" && (
          <button
            type="button"
            className="delete-group"
            style={{ backgroundColor: "#e02500", marginLeft: 20 }}
            data-testid="app-dashboard-my-group-new-group-button-save"
            onClick={handleDelete}>
            Delete Group
          </button>
        )}
      </div>
    </ContactFormStyled>
  );
}
