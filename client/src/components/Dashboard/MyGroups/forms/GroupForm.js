import React, { useCallback, useEffect, useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import Autosuggest from "react-autosuggest";
import debounce from "lodash.debounce";

import ErrorMessage from "../../../../helpers/ErrorMessage";
import CustomMultiSelect from "../../../../helpers/CustomMultiSelect";
import CustomMultiSelectOptions from "../../../../helpers/CustomMultiSelectOptions";

// GRAPHQL
import graphqlClient from "../../../../graphql";
import { GET_USER_OPTIONS_QUERY } from "../../../../graphql/query";

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
    max-width: 150px;
    margin: 1.5rem auto .5rem;
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
  .react-autosuggest__container {
    position: relative;
  }

  .react-autosuggest__input {
    font-family: Helvetica, sans-serif;
    font-weight: 300;
  }

  .react-autosuggest__input--focused {
    outline: none;
  }

  .react-autosuggest__input--open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .react-autosuggest__suggestions-container {
    display: none;
  }

  .react-autosuggest__suggestions-container--open {
    display: block;
    position: absolute;
    top: 20px;
    width: 100%;
    border: 1px solid #aaa;
    background-color: #fff;
    font-family: Helvetica, sans-serif;
    font-weight: 300;
    font-size: 16px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    z-index: 2;
  }

  .react-autosuggest__suggestions-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .react-autosuggest__suggestion {
    cursor: pointer;
    padding: 10px 20px;
  }

  .react-autosuggest__suggestion--highlighted {
    background-color: #ddd;
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
    margin-top: 1.5rem;
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

const renderSuggestion = (suggestion) => (
  <div>
    <div>{suggestion.name}</div>
    <div className="user-email">{suggestion.value}</div>
  </div>
);

export default function GroupForm({
  groupDetails,
  contacts,
  onSubmit,
  handleDelete,
  handleGroupDetailsChange,
  action,
}) {
  const [contactOptions, setContactOptions] = useState([]);
  const [otherUserSelected, setOtherUserSelected] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [autoCompleteValue, setAutoCompleteValue] = useState("");
  const [isFetching, setFetching] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const hasSelectAll = false;

  useEffect(() => {
    if (contacts) {
      let formattedContacts = contacts.map((item) => {
        return {
          name: `${item.first_name} ${item.last_name}`,
          id: item.user_id,
        };
      });
      setContactOptions(formattedContacts);
    }
  }, [contacts]);

  const theme = useContext(ThemeContext);
  const handleSelectChange = (value) => {
    handleGroupDetailsChange("contacts", value);
  };

  const automCompleteOnChange = (event, { newValue }) => {
    setAutoCompleteValue(newValue);
  };

  const inputProps = {
    placeholder: "Enter Guest Email",
    value: autoCompleteValue,
    onChange: automCompleteOnChange,
  };

  const delayedQuery = useCallback(
    debounce(async (value) => {
      try {
        if (!isFetching && value !== "") {
          setFetching(true);
          const { data } = await graphqlClient.query({
            query: GET_USER_OPTIONS_QUERY,
            variables: { keyword: value },
          });
          console.log("onSuggestionsFetchRequested DATAAAAAAAAAAAAAA", data);
          if (data.getUserList.length === 0) {
            setUserNotFound(true);
          } else {
            const options = data.getUserList.map((item) => {
              return {
                name: `${item.given_name} ${item.family_name}`,
                value: item.email,
                id: item.id,
              };
            });

            setSuggestion(
              options.filter(
                (item) =>
                  item.value.includes(value) || item.name.includes(value)
              )
            );
          }
          setFetching(false);
        }
      } catch (err) {
        console.log("onSuggestionsFetchRequested Error ", err);
        setFetching(false);
      }
    }, 500),
    []
  );

  const onSuggestionsFetchRequested = ({ value }) => {
    delayedQuery(value);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestion([]);
  };

  const getSuggestionValue = (suggestion) => {
    const isExist = otherUserSelected.find(
      (item) => suggestion.value === item.value
    );
    if (!isExist) {
      setOtherUserSelected([...otherUserSelected, suggestion]);
      handleGroupDetailsChange("other_ids", [...otherUserSelected, suggestion]);
    }
    return suggestion.name;
  };

  const handleRemoveOtherUser = (email) => () => {
    const updatedOtherUser = otherUserSelected.filter(
      (guest) => guest.value !== email
    );

    setOtherUserSelected(updatedOtherUser);
    handleGroupDetailsChange("other_ids", updatedOtherUser);
  };

  return (
    <ContactFormStyled
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      theme={theme}
    >
      <div className="grid">
        <div className="form-group">
          <div className="field">
            <input
              name="groupName"
              className="field-input"
              placeholder="Group Name"
              onChange={({ target }) => {
                handleGroupDetailsChange("name", target.value);
              }}
              ref={register({ required: true })}
              value={groupDetails.name}
            />
            <label className="field-label">
              <span className="required">*</span> Group Name
            </label>
          </div>
          <ErrorMessage
            field={errors.groupName}
            errorType="required"
            message="Group Name is required."
          />
        </div>

        {/* <div className="form-group">
          <div className="field">
            <CustomMultiSelectOptions
              className="field-input"
              options={contactOptions}
              value={contactOptions.filter(item =>
                groupDetails.contacts.includes(item.value)
              )}
              onChange={handleSelectChange}
              labelledBy={"Select"}
            />
            <label className="field-label">Add existing contacts</label>
          </div>
        </div> */}

        <div className="form-group">
          <div className="field">
            <CustomMultiSelect
              className="field-input"
              options={contactOptions}
              hasSelectAll={hasSelectAll}
              onSelect={handleSelectChange}
              placeholder="Add from my contacts"
              displayValue="name"
              closeIcon="cancel"
            />
          </div>
        </div>

        <div>
          {otherUserSelected &&
            otherUserSelected.map((guest, index) => (
              <span
                key={index}
                className="user-tag"
                onClick={handleRemoveOtherUser(guest.value)}
              >
                <div> {guest.value}</div>
                {/* <div className="user-email"> {guest.value}</div> */}
              </span>
            ))}
        </div>

        <label className="field-label">
          Add other users (Should be an existing bcombs user)
        </label>
        <Autosuggest
          autoComplete="off"
          inputProps={inputProps}
          suggestions={suggestion}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          renderSuggestion={renderSuggestion}
          getSuggestionValue={getSuggestionValue}
        />
        {userNotFound && <div style={{ color: "red" }}>User not found!</div>}
      </div>
      <div className="group-btn">
        <button type="submit">Save</button>
        {action !== "create" && (
          <button
            className="delete-group"
            style={{ backgroundColor: "#e02500", marginLeft: 20 }}
            data-testid="app-dashboard-my-group-new-group-button-save"
            onClick={handleDelete}
          >
            Delete Group
          </button>
        )}
      </div>
    </ContactFormStyled>
  );
}
