import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useDispatch } from "react-redux";
import { addHours, addMinutes, addSeconds, toDate, format } from "date-fns";
import { addEvent } from "../../../../redux/actions/Events";
import MicroCalendar from "../../../Calendar/micro-calendar";
import EventForm from "../forms/EventForm";
const NewEventModal = styled.div`
  h2 {
    font-size: 2em;
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
    padding: 7em;
  }
  #content > div:first-child {
    margin-top: 5em;
  }
  .modal-content {
    margin: 1.5em auto;
    width: 80%;
  }
  @media (min-width: 600px) {
    #content {
      grid-template-columns: 50% 50%;
      grid-gap: 1%;
    }
    button[type="submit"] {
      width: 30%;
    }
  }
`;
const initialEventDetails = selectedDate => {
  return {
    name: "",
    date: new Date(),
    time: format(selectedDate, "hh:mm a"),
    eventSchedule: [selectedDate, selectedDate],
    eventGuests: [],
    familyMembers: [],
    eventType: "Event",
    location: "",
    eventDescription: "",
    status: "Scheduled"
  };
};
export default function index({ isVisible = true, toggleCreateEventModal }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventDetails, setEventDetails] = useState(
    initialEventDetails(selectedDate)
  );
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const handleSetSelectedDate = date => {
    const currentDateTime = addSeconds(
      addMinutes(
        addHours(date, new Date().getHours()),
        new Date().getMinutes()
      ),
      new Date().getSeconds()
    );
    setSelectedDate(date);
    setEventDetails({
      ...eventDetails,
      date: currentDateTime,
      time: format(currentDateTime, "hh:mm a"),
      eventSchedule: [currentDateTime, currentDateTime]
    });
  };
  const handleEventDetailsChange = (id, value, action = "") => {
    let newEventGuests;
    newEventGuests = eventDetails.eventGuests;
    if (id === "eventGuests") {
      if (action !== "remove") {
        newEventGuests.push(value);
      } else {
        newEventGuests = newEventGuests.filter(
          (guest, index) => index !== value
        );
      }
      setEventDetails({ ...eventDetails, eventGuests: newEventGuests });
      return;
    }
    setEventDetails({ ...eventDetails, [id]: value });
  };
  const handleSubmit = value => {
    toggleCreateEventModal(false);
    dispatch(addEvent(eventDetails));
    setEventDetails(initialEventDetails(selectedDate));
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
          <MicroCalendar
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