import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useDispatch } from "react-redux";
import { addHours, addMinutes, addSeconds, format, isAfter } from "date-fns";
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
    justify-content: center
    display: grid;
    background-color: white;
    padding: 10em;
  }
  #content > div:first-child {
    margin-top: 5em;
  }
  .modal-content {
    margin: 1.5em auto;
    width: 80%;
  }
  @media (min-width: 600px) {
    .modal-content{
      margin: 1.5em auto;
      width: 40%;
    }
    #content {
      justify-content: center;
      display: grid;
      grid-gap: 1%;
      margin: 0 50px
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
    familyMembers: [],
    eventGuests: [],
    eventType: "Event",
    location: "",
    eventDescription: "",
    status: "Scheduled"
  };
};
export default function index({
  isVisible = true,
  toggleCreateEventModal,
  familyMembers,
  defaultSelectedDate = new Date()
}) {
  const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);
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
  const handleEventDetailsChange = (id, value) => {
    console.log("HANDLE EVENT DETAIL CHANGE VALUE", value);
    console.log("HANDLE EVENT DETAIL CHANGE ID", id);
    if (id === "eventGuests") {
      const newEventGuests = eventDetails.eventGuests;
      newEventGuests.push(value);
      setEventDetails({ ...eventDetails, eventGuests: newEventGuests });
      return;
    } else if (id === "eventSchedule") {
      const isStartDateAfterEndDate = isAfter(
        new Date(value[0]),
        new Date(value[1])
      );
      if (isStartDateAfterEndDate) {
        value[1] = new Date(addMinutes(new Date(value[0]), 30));
      }
      setEventDetails({ ...eventDetails, eventSchedule: value });
    } else {
      setEventDetails({ ...eventDetails, [id]: value });
    }
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
      theme={theme}>
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleCreateEventModal(false);
          }}>
          &times;
        </span>
        <div id="content">
          <h2 style={{ textAlign: "center", marginBottom: 50, marginTop: -50 }}>
            Create New Event
          </h2>
          <MicroCalendar
            removeSubHeader={true}
            events={[]}
            selectedDate={selectedDate}
            setSelectedDate={handleSetSelectedDate}
            selectedEvent={null}
            setSelectedEvent={() => {}}
          />
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
