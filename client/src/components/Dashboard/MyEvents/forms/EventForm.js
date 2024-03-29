import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { format, getTime } from "date-fns";
import debounce from "lodash.debounce";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
// import DatePicker from "react-date-picker";
// import TimePicker from "react-time-picker";
import Autosuggest from "react-autosuggest";
import { Multiselect } from "multiselect-react-dropdown";
import CKEditor from "react-ckeditor-component";

// GRAPHQL<CustomMultiSelect
import graphqlClient from "../../../../graphql";
import { GET_USER_OPTIONS_QUERY } from "../../../../graphql/query";

import CustomDatePicker from "../../../../helpers/CustomDatePicker";
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

  .react-datetimerange-picker,
  .react-date-picker,
  .react-time-picker {
    width: 100%;
  }
  .react-datetimerange-picker button,
  .react-date-picker button,
  .react-time-picker button {
    width: inherit;
    color: initial;
    background-color: initial;
    box-shadow: initial;
    border-radius: initial;
  }
  .react-datetimerange-picker,
  .react-date-picker,
  .react-time-picker {
    border: none;
    width: 100%;
    margin: 1em 0 1em 0;
  }
  .react-datetimerange-picker input,
  .react-date-picker input,
  .react-time-picker input {
    margin: 0;
    width: initial;
    border-bottom: none;
  }
  .react-datetimerange-picker__wrapper,
  .react-date-picker__wrapper,
  .react-time-picker__wrapper {
    border: none;
  }

  .react-calendar .react-calendar__tile--active,
  .react-calendar__tile--rangeStart {
    background-color: #f26e21 !important;
    color: white !important;
  }

  .react-datetimerange-picker__inputGroup__input--hasLeadingZero,
  .react-date-picker__inputGroup__input--hasLeadingZero,
  .react-time-picker__inputGroup__input--hasLeadingZero {
    padding: 0;
  }
  .react-date-picker__inputGroup__input,
  .react-time-picker__inputGroup__input,
  .react-datetimerange-picker__inputGroup__input {
    display: inline !important;
    transition: none !important;
  }

  .react-calendar__tile--active:enabled:focus {
    background-color: #f26e21;
    color: white;
  }
  .react-datetimerange-picker__range-divider{
    margin-top:5px !important;
  }
  input[placeholder="Add guests"] {
    display: inline-block;
    width: initial;
  }
  svg[class="react-datetimerange-picker__clear-button__icon react-datetimerange-picker__button__icon"] {
    display: none;
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
    font-size: 14px;
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

const OPTION_VISIBILITY = [
  { name: "Public", value: "public" },
  { name: "Private", value: "private" },
  { name: "Custom", value: "custom" }
];

const OPTION_STATUS = [
  { name: "Scheduled", value: "Scheduled" },
  { name: "Re-Scheduled", value: "Re-Scheduled" },
  { name: "Cancelled", value: "Cancelled" }
];

const OPTION_RECURRING = [
  { name: "Daily", value: "Daily" },
  { name: "Weekly", value: "Weekly" },
  { name: "Monthly", value: "Monthly" },
  { name: "Annually", value: "Annually" }
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
  handleAppGroupSelect,
  handleAppGroupRemove,
  handleEventDetailsChange,
  onSubmit,
  calendars = [],
  selectedCalendar = [],
  selectedGroup = [],
  groups = [],
  vendors = [],
  editMode = false,
  isEventSection = false
}) {

  console.log('Event Form Vendor Data', vendors)
  console.log('Event Form Vendor eventDetails', eventDetails)
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const [suggestion, setSuggestion] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState([]);
  const [defaultCalendar, setDefaultCalendar] = useState(null);
  const [autoCompleteValue, setAutoCompleteValue] = useState("");
  const [userNotFound, setUserNotFound] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [appGroups, setAppGroups] = useState([]);

  useEffect(() => {
    if (calendars) {
      const TICKED_CALENDAR_ID =
        localStorage.getItem("selectedCalendars") !== null
          ? JSON.parse(localStorage.getItem("selectedCalendars"))
          : [];

      const defaultCalendarSettings = calendars.find(
        item => TICKED_CALENDAR_ID && TICKED_CALENDAR_ID.includes(item.id)
      );

      setDefaultCalendar(defaultCalendarSettings);
    }
  }, [calendars]);
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

  useEffect(() => {
    if(vendors && vendors[0]) {
      console.log('useEffect vendors',vendors)
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

  const automCompleteOnChange = (event, { newValue }) => {
    setAutoCompleteValue(newValue);
  };

  const inputProps = {
    placeholder: "Enter Guest Email",
    value: autoCompleteValue,
    onChange: automCompleteOnChange
  };

  const delayedQuery = useCallback(
    debounce(async value => {
      try {
        if (!isFetching && value !== "") {
          setFetching(true);
          const { data } = await graphqlClient.query({
            query: GET_USER_OPTIONS_QUERY,
            variables: { keyword: value }
          });

          if (data.getUserList.length === 0) {
            setUserNotFound(true);
          } else {
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
            setUserNotFound(false);
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

  const onSuggestionsFetchRequested = async ({ value }) => {
    if (userNotFound) {
      setUserNotFound(false);
    }
    delayedQuery(value);
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
  return (
    <EventFormStyled
      data-testid="app-dashboard-my-events-event-form"
      method="POST"
      onSubmit={handleSubmit(onSubmit)}>
      {/* <FontAwesomeIcon icon={faClock} /> */}
      <div className="field-group">
        <div className="field">
          <input
            className="field-input"
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
          <label className="field-label">
            <span className="required">*</span> Title
          </label>
        </div>
        <ErrorMessage
          field={errors.title}
          errorType="required"
          message="Title is required."
        />
      </div>
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
        <br />
      </div>
      <DateTimeRangePicker
        format={'MM/dd/yyyy'}
        value={eventDetails.eventSchedule}
        disableClock={true}
        rangeDivider={true}
        onChange={date => {
          if (date == null) {
            return;
          }

          handleEventDetailsChange("eventSchedule", date);
        }}
      />{" "}
      {isEventSection && (
        <div className="form-group">
          <div className="field">
            <CustomMultiSelect
              className="field-input"
              options={calendars}
              selectedValues={selectedCalendar}
              onSelect={handleCalendarSelect}
              onRemove={handleCalendarRemove}
              placeholder="Add Calendar"
              displayValue="name"
              closeIcon="cancel"
            />
            <ErrorMessage
              field={errors.calendars}
              errorType="required"
              message="Please select calendar."
            />
          </div>
        </div>
      )}
      <br />
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
      <br />
      <label>Recurring</label>
      <select
        name="recurring"
        className="field-input"
        placeholder="Recurring"
        onChange={e => {
          handleEventDetailsChange("recurring", e.target.value);
        }}
        value={eventDetails.recurring}>
        <option key="0" value="No Repeat">
          No Repeat
        </option>
        {OPTION_RECURRING.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.name}
          </option>
        ))}
      </select>
      <br />
      {eventDetails &&
        eventDetails.recurring !== "No Repeat" &&
        eventDetails.recurring !== "" &&
        eventDetails.recurring !== undefined && (
          <div>
            <div>Ends</div>
            <label className="cus-select-container" style={{ fontSize: 12 }}>
              <input
                type="radio"
                onChange={({ target }) => {
                  handleEventDetailsChange("recurringEndType", target.value);
                }}
                checked={
                  eventDetails && eventDetails.recurringEndType === "never"
                }
                value="never"
              />{" "}
              Never
              <span className="checkmark"></span>
            </label>
            <label className="cus-select-container" style={{ fontSize: 12 }}>
              <input
                type="radio"
                name="recurringEndType"
                onChange={({ target }) => {
                  handleEventDetailsChange("recurringEndType", target.value);
                }}
                checked={eventDetails && eventDetails.recurringEndType === "on"}
                value="on"
              />{" "}
              On
              <span className="checkmark"></span>
              {`  `}{" "}
            </label>
          </div>
        )}
      {eventDetails &&
        eventDetails.recurringEndType === "on" &&
        eventDetails.recurring !== "No Repeat" &&
        eventDetails.recurring !== "" && (
          <label>
            Recurring End Date
            <CustomDatePicker
              className="custom-date-picker"
              placeholderText="MM/dd/yyyy"
              selected={
                eventDetails.recurringEndDate &&
                new Date(eventDetails.recurringEndDate)
              }
              onChange={date => {
                handleEventDetailsChange(
                  "recurringEndDate",
                  format(new Date(date), "MM/dd/yyyy")
                );
              }}
            />
          </label>
        )}
      <br />
      <div>
        <label>
          <span className="required">*</span> Visibility
        </label>
        <select
          name="visibility"
          className="field-input"
          placeholder="Select Visibility"
          ref={register({ required: true })}
          onChange={e => {
            handleEventDetailsChange("visibility", e.target.value);
          }}
          value={
            eventDetails.visibility ||
            (defaultCalendar &&
              defaultCalendar.visibilityType &&
              defaultCalendar.visibilityType.toLowerCase()) ||
            "public"
          }>
          <option value="">Select</option>
          {OPTION_VISIBILITY.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.name}
            </option>
          ))}
        </select>

        <ErrorMessage
          field={errors.visibility}
          errorType="required"
          message="Visibility is required."
        />
      </div>
      <br />
      {(eventDetails.visibility === "custom" ||
        (defaultCalendar &&
          defaultCalendar.visibilityType &&
          defaultCalendar.visibilityType.toLowerCase() === "custom")) && (
       <>
        <div className="form-group">
          <div className="field">
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
          </div>
        </div>

        <div className="form-group">
          <div className="field">
            <CustomMultiSelect
              className="field-input"
              options={appGroups}
              selectedValues={eventDetails.defaultAppGroupIds}
              onSelect={handleAppGroupSelect}
              onRemove={handleAppGroupRemove}
              placeholder="Add Application Group"
              displayValue="name"
              closeIcon="cancel"
            />
          </div>
        </div>
       </>
      )}
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
      />
      <CKEditor
        name="description"
        content={eventDetails.description}
        // events={{
        //   change: handleOnChange
        // }}
        onChange={value => {
          if (value.length <= 500) {
            handleEventDetailsChange("description", value);
          }
        }}
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
