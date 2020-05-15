import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { updateEvent } from "../../../../redux/actions/Events";
import EventForm from "../forms/EventForm";
const EditEventModal = styled.div`
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
    margin: 20px auto;
    border: none;
  }
  #content {
    display: grid;
    background-color: white;
    padding: 4em;
  }
  #content > div:first-child {
    margin-top: 5em;
  }
  .modal-content {
    margin: 1.5em auto;
    width: 80%;
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: 30%;
    }
  }
`;

const DATE_TIME_FORMAT = "yyyy-MM-dd hh:mm:ss";
export default function index({
  auth,
  isVisible = true,
  toggleEditEventModal,
  defaultEventDetails,
  selectedCalendars
}) {
  const [eventDetails, setEventDetails] = useState({
    ...defaultEventDetails,
    eventSchedule: [
      new Date(defaultEventDetails.start_of_event),
      new Date(defaultEventDetails.end_of_event)
    ]
  });
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const handleEventDetailsChange = (id, value, action = "") => {
    // let newEventGuests;
    // newEventGuests = eventDetails.eventGuests;
    if (id === "eventGuests") {
      setEventDetails({ ...eventDetails, eventGuests: value });
    } else {
      setEventDetails({ ...eventDetails, [id]: value });
    }
  };
  const handleSubmit = value => {
    console.log("eventDetailzzs", eventDetails);
    const payload = {
      start_of_event: format(
        new Date(eventDetails.eventSchedule[0]),
        DATE_TIME_FORMAT
      ),
      end_of_event: format(
        new Date(eventDetails.eventSchedule[1]),
        DATE_TIME_FORMAT
      ),
      type: eventDetails.eventType,
      id: eventDetails.id,
      location: eventDetails.location,
      name: eventDetails.name,
      status: eventDetails.status,
      time: eventDetails.time,
      description: eventDetails.description,
      guests:
        eventDetails.eventGuests && eventDetails.eventGuests.length > 0
          ? eventDetails.eventGuests.map(item => item.id)
          : [],
      auth_email: auth.email,
      calendar_ids: selectedCalendars
    };
    console.log("payloadddd", payload);
    toggleEditEventModal();
    dispatch(updateEvent(payload));
  };
  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <EditEventModal
      data-testid="app-dashboard-my-events-new-event"
      className="modal"
      theme={theme}>
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleEditEventModal();
          }}>
          &times;
        </span>
        <div id="content">
          <EventForm
            eventDetails={eventDetails}
            header={"Edit Event"}
            handleEventDetailsChange={handleEventDetailsChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </EditEventModal>,
    document.getElementById("modal")
  );
}
