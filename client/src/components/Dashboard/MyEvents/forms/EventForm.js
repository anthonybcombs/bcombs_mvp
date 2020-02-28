import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Dropdown } from "semantic-ui-react";
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
  .dropdown {
    padding: 0 !important;
    width: 100%;
  }
  .ui.selection.active.dropdown,
  .ui.selection.active.dropdown:hover {
    border-color: none !important;
  }
  .ui.selection.dropdown {
    height: initial !important;
  }
  .dropdown > .ui.label {
    background-color: #f26e21;
    color: white;
    font-size: 0.8em;
    font-weight: normal;
    padding: 0.5em;
    margin: 0.5em;
  }
  .icon {
    padding: 0 !important;
    width: initial !important;
  }
  .dropdown .icon {
    top: 2em !important;
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
  familyMembers
}) {
  const { register, handleSubmit, errors } = useForm();
  const schedule = [
    format(eventDetails.eventSchedule[0], "MMM dd,yyyy hh:mm a"),
    format(eventDetails.eventSchedule[1], "MMM dd,yyyy hh:mm a")
  ];
  const options = [];
  familyMembers.forEach(familyMember => {
    options.push({
      key: familyMembers.id,
      text: familyMember.name,
      value: familyMember.id
    });
  });
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
        EditableComp={<input />}
      />
      <EditableParagraph
        DisplayComp={
          <p>
            <FontAwesomeIcon icon={faUserFriends} />
            {eventDetails.familyMembers.length > 0
              ? eventDetails.familyMembers
                  .map(
                    key =>
                      familyMembers.find(
                        familyMember => familyMember.id === key
                      ).name
                  )
                  .join()
              : "Add guests"}
          </p>
        }
        EditableComp={
          <Dropdown
            placeholder="Add guests"
            fluid
            multiple
            selection
            value={eventDetails.familyMembers}
            options={options}
            onChange={(e, { value }) => {
              handleEventDetailsChange("familyMembers", value);
            }}
          />
        }
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
