import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
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
  handleInputChange,
  onSubmit
}) {
  const { register, handleSubmit, errors } = useForm();
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
          handleInputChange("title", e.target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.title}
        errorType="required"
        message="Title is required."
      />
      <div id="event-type-list">
        <button>Event</button>
        <button>Forms Reminder</button>
        <button>Task</button>
      </div>
      <button
        data-testid="app-dashboard-my-events-new-event-button-save"
        type="submit"
      >
        Save
      </button>
    </EventFormStyled>
  );
}
