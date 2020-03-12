import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faUserFriends,
  faMapMarkerAlt,
  faAlignLeft
} from "@fortawesome/free-solid-svg-icons";

import EditableParagraph from "../../../../helpers/EditableParagraph";
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
`;
export default function createEventForm({
  eventDetails,
  handleEventDetailsChange,
  onSubmit,
  header = "Create a new Event"
}) {
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const schedule = [
    format(eventDetails.eventSchedule[0], "MMM dd,yyyy hh:mm a"),
    format(eventDetails.eventSchedule[1], "MMM dd,yyyy hh:mm a")
  ];
  return (
    <EventFormStyled
      data-testid="app-dashboard-my-events-event-form"
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2>{header}</h2>
      <input
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
          className={`${eventDetails.eventType === "Event" ? "selected" : ""}`}
          onClick={() => {
            handleEventDetailsChange("eventType", "Event");
          }}
        >
          Event
        </button>
        <button
          type="button"
          className={`${
            eventDetails.eventType === "Forms Reminder" ? "selected" : ""
          }`}
          onClick={() => {
            handleEventDetailsChange("eventType", "Forms Reminder");
          }}
        >
          Forms Reminder
        </button>
        <button
          type="button"
          className={`${eventDetails.eventType === "Task" ? "selected" : ""}`}
          onClick={() => {
            handleEventDetailsChange("eventType", "Task");
          }}
        >
          Task
        </button>
      </div>
      <EditableParagraph
        DisplayComp={
          <p data-testid="app-dashboard-my-events-new-event-selected-datetime">
            <FontAwesomeIcon icon={faClock} />
            {`${schedule[0]} - ${schedule[1]}`}
          </p>
        }
        EditableComp={
          <DateTimeRangePicker
            value={eventDetails.eventSchedule}
            disableClock={true}
            onChange={date => {
              if (date == null) {
                return;
              }
              handleEventDetailsChange("eventSchedule", date);
            }}
          />
        }
      />
      <EditableParagraph
        DisplayComp={
          <p>
            <FontAwesomeIcon icon={faUserFriends} />
            {eventDetails.eventGuests.length > 0
              ? eventDetails.eventGuests.map((guest, index) => (
                  <span className="guest" key={index}>
                    <span>
                      {guest}
                      <span
                        onClick={e => {
                          e.stopPropagation();
                          handleEventDetailsChange(
                            "eventGuests",
                            index,
                            "remove"
                          );
                        }}
                      >
                        &times;
                      </span>
                    </span>
                  </span>
                ))
              : "Add guests"}
          </p>
        }
        EditableComp={
          <div>
            <FontAwesomeIcon icon={faUserFriends} />
            {eventDetails.eventGuests.map((guest, index) => (
              <span className="guest" key={index}>
                <span>
                  {guest}
                  <span
                    onClick={e => {
                      e.stopPropagation();
                      handleEventDetailsChange("eventGuests", index, "remove");
                    }}
                  >
                    &times;
                  </span>
                </span>
              </span>
            ))}
            <input type="text" placeholder="Add guests" />
          </div>
        }
        handleOnEnter={value => {
          handleEventDetailsChange("eventGuests", value);
        }}
      />
      <EditableParagraph
        DisplayComp={
          <p>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            {eventDetails.location
              ? eventDetails.location
              : "Add location or conferencing"}
          </p>
        }
        EditableComp={
          <input
            autoFocus
            name="location"
            value={eventDetails.location}
            onChange={({ target }) => {
              handleEventDetailsChange("location", target.value);
            }}
            ref={register({ required: true })}
          />
        }
      />
      <EditableParagraph
        DisplayComp={
          <p>
            <FontAwesomeIcon icon={faAlignLeft} />
            {eventDetails.description
              ? eventDetails.description
              : "Add description"}
          </p>
        }
        EditableComp={
          <textarea
            autoFocus
            value={eventDetails.description}
            onChange={({ target }) => {
              handleEventDetailsChange("description", target.value);
            }}
          />
        }
      />
      <button
        data-testid="app-dashboard-my-events-new-event-button-save"
        type="submit"
      >
        Save
      </button>
    </EventFormStyled>
  );
}
