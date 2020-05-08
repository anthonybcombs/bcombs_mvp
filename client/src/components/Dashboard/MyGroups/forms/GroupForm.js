import React, { useEffect, useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";

import { Multiselect } from "multiselect-react-dropdown";
import CreatableSelect from "react-select/creatable";

import ErrorMessage from "../../../../helpers/ErrorMessage";
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
  button[type="submit"] {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    display: block;
    margin: 10px auto;
    width: 100%;
    border: none;
    margin-top: 15em;
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
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

const VISIBILITY_OPTIONS = [
  { value: "public", name: "Public" },
  { value: "private", name: "Private" }
];
export default function GroupForm({
  groupDetails,
  contacts,
  onSubmit,
  handleGroupDetailsChange
}) {
  const [contactOptions, setContactOptions] = useState([]);
  const [contactSelected, setContactSelected] = useState([]);
  const [otherUserSelected, setOtherUserSelected] = useState([]);
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const hasSelectAll = false;

  useEffect(() => {
    if (contacts) {
      let formattedContacts = contacts.map(item => {
        return {
          name: `${item.first_name} ${item.last_name}`,
          id: item.user_id
        };
      });
      setContactOptions(formattedContacts);
    }
  }, [contacts]);
  const theme = useContext(ThemeContext);
  const handleSelectChange = value => {
    handleGroupDetailsChange("contacts", [...value]);
    setContactSelected([...value]);
  };

  const handleOtherUserChange = value => {
    setOtherUserSelected(value);
  };
  return (
    <ContactFormStyled
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      theme={theme}>
      <div className="grid">
        <div className="form-group">
          <div className="field">
            <input
              name="firstname"
              className="field-input"
              placeholder="Group Name"
              onChange={({ target }) => {
                handleGroupDetailsChange("name", target.value);
              }}
              ref={register({ required: true })}
              value={groupDetails.name}
            />
            <label className="field-label">Group Name</label>
          </div>
          <ErrorMessage
            field={errors.name}
            errorType="required"
            message="Group Name is required."
          />
        </div>

        <div className="form-group">
          <div className="field">
            <select
              name="visibility"
              className="field-input"
              ref={register({ required: true })}>
              <option value="">Select</option>
              {VISIBILITY_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
            <label className="field-label">Visibility</label>
          </div>
          <ErrorMessage
            field={errors.visibility}
            errorType="required"
            message="Visibility is required."
          />
        </div>
        <div className="form-group">
          <div className="field">
            <Multiselect
              className="field-input"
              options={contactOptions}
              hasSelectAll={hasSelectAll}
              onSelect={handleSelectChange}
              placeholder="Add from my contacts"
              displayValue="name"
              closeIcon="cancel"
            />

            <label className="field-label">Assign to existing contact</label>
          </div>
        </div>
        <div className="form-group">
          <div className="field">
            <CreatableSelect onChange={handleOtherUserChange} isMulti />
            <label className="field-label">Others</label>
          </div>
        </div>
      </div>

      {/* <select
        data-testid="app-profile-select-gender"
        name="visibility"
        onChange={({ target }) => {
          handleGroupDetailsChange("visibility", target.value);
        }}
        ref={register}>
        {VISIBILITY_OPTIONS.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      <div>
        <p>Assign to existing contact</p>
        {contacts.map(contact => (
          <label htmlFor="contact" key={contact.id}>
            <input
              type="checkbox"
              name="contact"
              checked={groupDetails.contacts.includes(contact.id)}
              value={contact.id}
              onChange={({ target }) => {
                handleGroupDetailsChange("contacts", target.value);
              }}
            />
            {contact.first_name} {contact.last_name}
          </label>
        ))}
      </div> */}
      <button type="submit">Save</button>
    </ContactFormStyled>
  );
}
