import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
//import { format } from "date-fns";
import debounce from "lodash.debounce";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
//import { Multiselect } from "multiselect-react-dropdown";
import Autosuggest from "react-autosuggest";

// GRAPHQL
import graphqlClient from "../../../../graphql";
import { GET_USER_OPTIONS_QUERY } from "../../../../graphql/query";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faUserFriends,
  faMapMarkerAlt,
  faAlignLeft
} from "@fortawesome/free-solid-svg-icons";

//import EditableParagraph from "../../../../helpers/EditableParagraph";
import CustomMultiSelect from "../../../../helpers/CustomMultiSelect";
import ErrorMessage from "../../../../helpers/ErrorMessage";

const EventFormStyled = styled.form`
  #event-type-list {
    display: grid;
  }
  #event-type-list button {
    border-radius: 0 !important;
    background-color: transparent;
    border: none;
    color: black;
    box-shadow: none;
  }
  #event-type-list button.selected {
    background-color: lightblue;
    font-weight: bold;
    color: blue;
  }
  svg {
    margin-right: 10px;
  }
  p:hover {
    cursor: pointer;
  }
  textarea {
    width: 100%;
  }
  .guest {
    display: inline-block;
    position: relative;
    background-color: #f26e21;
    color: white;
    padding: 0.6em;
    margin: 0.3em;
  }
  .react-datetimerange-picker {
    width: 100%;
  }
  .react-datetimerange-picker button {
    width: inherit;
    color: initial;
    background-color: initial;
    box-shadow: initial;
    border-radius: initial;
  }
  .react-datetimerange-picker {
    border: none;
    width: 100%;
    margin: 1em 0 1em 0;
  }
  .react-datetimerange-picker input {
    margin: 0;
    width: initial;
    border-bottom: none;
  }
  .react-datetimerange-picker__wrapper {
    border: none;
  }
  .react-calendar .react-calendar__tile--active,
  .react-calendar .react-calendar__tile--hover,
  .react-calendar__tile--rangeStart {
    background-color: #f26e21 !important;
    color: white !important;
  }
  .react-calendar .react-calendar__tile:hover {
    background-color: #f26e21;
    color: white;
  }
  .react-datetimerange-picker__inputGroup__input--hasLeadingZero {
    padding: 0;
  }
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background-color: #f26e21;
    color: white;
  }
  input[placeholder="Add guests"] {
    display: inline-block;
    width: initial;
  }
  svg[class="react-datetimerange-picker__clear-button__icon react-datetimerange-picker__button__icon"] {
    display: none;
  }
  @media (min-width: 600px) {
    #event-type-list {
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 2%;
    }
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
    display: inline-block;
    background-color: #f26e21;
    color: white;
    padding: 0.5em;
    margin: 4px;
  }

  .user-email {
    font-size: 11px;
    font-style: italic;
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
  }
`;

const OPTION_VISIBILITY = [
  { name: "Public", value: "public" },
  { name: "Custom", value: "custom" }
];

const OPTION_STATUS = [
  { name: "Scheduled", value: "Scheduled" },
  { name: "Re-Scheduled", value: "Re-Scheduled" },
  { name: "Cancelled", value: "Cancelled" }
];

const OPTION_RECURRING = [
  { name: "Daily", value: "Daily" },
  { name: "Weekly", value: "Weekly" }
  // { name: "Monthly", value: "Monthly" },
  // { name: "Annually", value: "Annually" }
];

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    <div>{suggestion.name}</div>
    <div className="user-email">{suggestion.value}</div>
  </div>
);

/*
Does not repeat
Daily
weekly on thurs
monthly on the second thurs
annually on may 14
every weekday
*/
export default function createEventForm({
  eventDetails,
  handleCalendarSelect,
  handleCalendarRemove,
  handleGroupSelect,
  handleGroupRemove,
  handleEventDetailsChange,
  onSubmit,
  calendars = [],
  groups = [],
  editMode = false,
  isEventSection = false,
  header = "Create a new Event"
}) {
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const [suggestion, setSuggestion] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState([]);
  const [autoCompleteValue, setAutoCompleteValue] = useState("");
  const [isFetching, setFetching] = useState(false);

  useEffect(() => {
    if (eventDetails && eventDetails.guests) {
      const defaultGuests = eventDetails.guests.map(item => {
        return {
          id: item.user_id,
          value: item.email
        };
      });
      setSelectedGuest(defaultGuests);
    }
  }, [eventDetails.guests]);

  const automCompleteOnChange = (event, { newValue }) => {
    setAutoCompleteValue(newValue);
  };

  const inputProps = {
    placeholder: "Enter Guest Email",
    value: autoCompleteValue,
    onChange: automCompleteOnChange
  };

  const onSuggestionsFetchRequested = async ({ value }) => {
    try {
      if (!isFetching && value !== "") {
        setFetching(true);
        const { data } = await graphqlClient.query({
          query: GET_USER_OPTIONS_QUERY,
          variables: { keyword: value }
        });
        const options = data.getUserList.map(item => {
          return {
            name: `${item.given_name} ${item.family_name}`,
            value: item.email,
            id: item.id
          };
        });

        setSuggestion(
          options.filter(
            item => item.value.includes(value) || item.name.includes(value)
          )
        );
        setFetching(false);
      }
    } catch (err) {
      console.log("onSuggestionsFetchRequested Error ", err);
      setFetching(false);
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestion([]);
  };

  const getSuggestionValue = suggestion => {
    const isExist = selectedGuest.find(item => suggestion.value === item.value);
    if (!isExist) {
      setSelectedGuest([...selectedGuest, suggestion]);
      handleEventDetailsChange("eventGuests", [...selectedGuest, suggestion]);
    }
    return suggestion.name;
  };

  const handleRemoveGuest = email => () => {
    const removedGuest = selectedGuest.find(guest => guest.value === email);
    const updatedGuest = selectedGuest.filter(guest => guest.value !== email);
    setSelectedGuest(updatedGuest);
    handleEventDetailsChange("removeGuests", removedGuest);
  };

  console.log("eventDetails111", eventDetails);
  return (
    <EventFormStyled
      data-testid="app-dashboard-my-events-event-form"
      method="POST"
      onSubmit={handleSubmit(onSubmit)}>
      <h2>{header}</h2>
      <FontAwesomeIcon icon={faClock} />
      <input
        autoComplete="off"
        data-testid="app-dashboard-my-events-new-event-input-title"
        type="text"
        name="title"
        placeholder="Add title"
        value={eventDetails.name}
        onChange={e => {
          handleEventDetailsChange("name", e.target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.title}
        errorType="required"
        message="Title is required."
      />
      <div id="event-type-list">
        <button
          type="button"
          className={`${eventDetails.type === "Event" ? "selected" : ""}`}
          onClick={() => {
            handleEventDetailsChange("type", "Event");
          }}>
          Event
        </button>
        <button
          type="button"
          className={`${
            eventDetails.type === "Forms Reminder" ? "selected" : ""
          }`}
          onClick={() => {
            handleEventDetailsChange("type", "Forms Reminder");
          }}>
          Forms Reminder
        </button>
        <button
          type="button"
          className={`${eventDetails.type === "Task" ? "selected" : ""}`}
          onClick={() => {
            handleEventDetailsChange("type", "Task");
          }}>
          Task
        </button>
      </div>
      <DateTimeRangePicker
        value={eventDetails.eventSchedule}
        disableClock={true}
        onChange={date => {
          if (date == null) {
            return;
          }
          handleEventDetailsChange("eventSchedule", date);
        }}
      />{" "}
      {isEventSection && (
        <CustomMultiSelect
          className="field-input"
          options={calendars}
          onSelect={handleCalendarSelect}
          onRemove={handleCalendarRemove}
          placeholder="Add Calendar"
          displayValue="name"
          closeIcon="cancel"
        />
      )}
      {editMode && (
        <select
          name="status"
          className="field-input"
          placeholder="Select Status"
          ref={register({ required: true })}
          onChange={e => {
            handleEventDetailsChange("status", e.target.value);
          }}
          value={eventDetails.status}>
          <option value="">Select</option>
          {OPTION_STATUS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.name}
            </option>
          ))}
        </select>
      )}
      <select
        name="recurring"
        className="field-input"
        placeholder="Recurring"
        onChange={e => {
          handleEventDetailsChange("recurring", e.target.value);
        }}
        value={eventDetails.recurring}>
        <option value="">No Repeat</option>
        {OPTION_RECURRING.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.name}
          </option>
        ))}
      </select>
      <select
        name="visibility"
        className="field-input"
        placeholder="Select Visibility"
        ref={register({ required: true })}
        onChange={e => {
          handleEventDetailsChange("visibility", e.target.value);
        }}
        value={eventDetails.visibility}>
        <option value="">Select</option>
        {OPTION_VISIBILITY.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.name}
          </option>
        ))}
      </select>
      {eventDetails.visibility === "custom" && (
        <CustomMultiSelect
          className="field-input"
          options={groups}
          selectedValues={eventDetails.defaultGroupIds}
          onSelect={handleGroupSelect}
          onRemove={handleGroupRemove}
          placeholder="Add Group"
          displayValue="name"
          closeIcon="cancel"
        />
      )}
      <Autosuggest
        autoComplete="off"
        inputProps={inputProps}
        suggestions={suggestion}
        onSuggestionsFetchRequested={debounce(
          onSuggestionsFetchRequested,
          1000
        )}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        renderSuggestion={renderSuggestion}
        getSuggestionValue={getSuggestionValue}
      />
      <div>
        {selectedGuest &&
          selectedGuest.map((guest, index) => (
            <div
              key={index}
              className="user-tag"
              onClick={handleRemoveGuest(guest.value)}>
              <div> {guest.value}</div>
              {/* <div className="user-email"> {guest.value}</div> */}
            </div>
          ))}
      </div>
      <input
        autoComplete="off"
        data-testid="app-dashboard-my-events-new-event-input-title"
        type="text"
        name="location"
        placeholder="Location"
        value={eventDetails.location}
        onChange={e => {
          handleEventDetailsChange("location", e.target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.location}
        errorType="required"
        message="Location is required."
      />
      <input
        autoComplete="off"
        data-testid="app-dashboard-my-events-new-event-input-title"
        type="text"
        name="description"
        placeholder="Description"
        value={eventDetails.description}
        onChange={e => {
          handleEventDetailsChange("description", e.target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.description}
        errorType="required"
        message="Description is required."
      />
      <button
        data-testid="app-dashboard-my-events-new-event-button-save"
        type="submit">
        Save
      </button>
    </EventFormStyled>
  );
}
