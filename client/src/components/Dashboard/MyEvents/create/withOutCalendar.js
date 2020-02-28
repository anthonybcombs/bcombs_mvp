import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useDispatch } from "react-redux";
import { addHours, addMinutes, addSeconds, toDate, format } from "date-fns";
import { addEvent } from "../../../../redux/actions/Events";
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
    margin: 20px auto;
    border: none;
  }
  #content {
    display: grid;
    background-color: white;
  }
  #content > div:first-child {
    margin-top: 5em;
  }
  .modal-content {
    margin: 1.5em auto;
    width: 60%;
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: 30%;
    }
  }
`;
export default function index({
  isVisible = true,
  toggleCreateEventModal,
  familyMembers,
  defaultSelectedDate
}) {
  const [eventDetails, setEventDetails] = useState({
    name: "",
    date: defaultSelectedDate,
    time: format(defaultSelectedDate, "hh:mm a"),
    eventSchedule: [defaultSelectedDate, defaultSelectedDate],
    familyMembers: [],
    eventType: "Event",
    location: "",
    eventDescription: "",
    status: "Scheduled"
  });
  useEffect(() => {
    setEventDetails({
      ...eventDetails,
      date: defaultSelectedDate,
      time: format(defaultSelectedDate, "hh:mm a"),
      eventSchedule: [defaultSelectedDate, defaultSelectedDate]
    });
  }, [defaultSelectedDate]);
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const handleEventDetailsChange = (id, value) => {
    setEventDetails({ ...eventDetails, [id]: value });
  };
  const handleSubmit = value => {
    toggleCreateEventModal(false);
    dispatch(addEvent(eventDetails));
    setEventDetails({
      name: "",
      date: defaultSelectedDate,
      time: format(defaultSelectedDate, "hh:mm a"),
      eventSchedule: [defaultSelectedDate, defaultSelectedDate],
      familyMembers: [],
      eventType: "Event",
      location: "",
      eventDescription: "",
      status: "Scheduled"
    });
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
          <EventForm
            familyMembers={familyMembers}
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
