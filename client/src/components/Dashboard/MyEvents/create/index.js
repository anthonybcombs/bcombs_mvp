import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import SmallCalendar from "../../../Calendar/small-calendar";
import EventForm from "../forms/EventForm";
const NewEventModal = styled.div`
  h2 {
    text-align: center;
  }
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  input {
    background: none;
    width: 100%;
    color: black;
    font-size: ${({ theme }) => theme.input.fontSize};
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
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
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
    width: 100%;
    display: block;
    margin: 10px auto;
    border: none;
  }
  #content {
    display: grid;
    background-color: white;
    padding: 1em;
  }
  .modal-content {
    margin: 1em auto;
    width: 80%;
  }
  @media (min-width: 600px) {
    #content {
      grid-template-columns: 60% 40%;
      grid-gap: 1%;
    }
    button[type="submit"] {
      width: 30%;
    }
  }
`;
export default function index({ isVisible = true, toggleCreateEventModal }) {
  const [eventDetails, setEventDetails] = useState({
    title: "",
    eventSchedule: [new Date(), new Date()],
    eventType: "Event",
    eventLocation: "",
    eventGuests: "",
    eventDescription: ""
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const theme = useContext(ThemeContext);
  const handleSetSelectedDate = date => {
    setSelectedDate(date);
  };
  const handleEventDetailsChange = (id, value) => {
    setEventDetails({ ...eventDetails, [id]: value });
  };
  const handleSubmit = value => {
    toggleCreateEventModal(false);
  };
  if (!isVisible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <NewEventModal
      data-testid="app-dashboard-my-events-new-event"
      className="modal"
      theme={theme}
    >
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleCreateEventModal(false);
          }}
        >
          &times;
        </span>
        <div id="content">
          <SmallCalendar
            removeSubHeader={true}
            events={[]}
            selectedDate={selectedDate}
            setSelectedDate={handleSetSelectedDate}
            selectedEvent={null}
            setSelectedEvent={() => {}}
          />
          <EventForm
            eventDetails={eventDetails}
            handleEventDetailsChange={handleEventDetailsChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </NewEventModal>,
    document.getElementById("modal")
  );
}
