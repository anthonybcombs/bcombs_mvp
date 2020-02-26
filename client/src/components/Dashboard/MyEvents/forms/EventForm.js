import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
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
  onSubmit
}) {
  const { register, handleSubmit, errors } = useForm();
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
      <h2>Create a new Event</h2>
      <input
        data-testid="app-dashboard-my-events-new-event-input-title"
        type="text"
        name="title"
        placeholder="Add title"
        value={eventDetails.name}
        onChange={e => {
          handleEventDetailsChange("title", e.target.value);
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
      <div></div>
      <EditableParagraph
        DisplayComp={
          <p data-testid="app-dashboard-my-events-new-event-selected-datetime">
            <FontAwesomeIcon icon={faClock} />
            {`${schedule[0]} - ${schedule[1]}`}
          </p>
        }
        EditableComp={<input />}
      />
      <EditableParagraph
        DisplayComp={
          <p>
            <FontAwesomeIcon icon={faUserFriends} />
            {eventDetails.eventGuests ? eventDetails.eventGuests : "Add guests"}
          </p>
        }
        EditableComp={
          <input
            autoFocus
            value={eventDetails.eventGuests}
            onChange={({ target }) => {
              handleEventDetailsChange("eventGuests", target.value);
            }}
          />
        }
      />
      <EditableParagraph
        DisplayComp={
          <p>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            {eventDetails.eventLocation
              ? eventDetails.eventLocation
              : "Add location or conferencing"}
          </p>
        }
        EditableComp={
          <input
            autoFocus
            value={eventDetails.eventLocation}
            onChange={({ target }) => {
              handleEventDetailsChange("eventLocation", target.value);
            }}
          />
        }
      />
      <EditableParagraph
        DisplayComp={
          <p>
            <FontAwesomeIcon icon={faAlignLeft} />
            {eventDetails.eventDescription
              ? eventDetails.eventDescription
              : "Add description"}
          </p>
        }
        EditableComp={
          <textarea
            autoFocus
            onChange={({ target }) => {
              handleEventDetailsChange("eventDescription", target.value);
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
