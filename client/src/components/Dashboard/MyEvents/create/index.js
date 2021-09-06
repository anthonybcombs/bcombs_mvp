import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useDispatch } from "react-redux";
import { addHours, addMinutes, addSeconds, format, isAfter } from "date-fns";
import { addEvent } from "../../../../redux/actions/Events";
import MicroCalendar from "../../../Calendar/micro-calendar";
import EventForm from "../forms/EventForm";
const NewEventModal = styled.div`
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  input,
  textarea {
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
  .timepicker {
    transition: none !important;
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
    max-width: 120px;
    display: block;
    margin: 20px auto;
    border: none;
  }
  #content {
    justify-content: center
    display: grid;
    background-color: white;
    padding: 7em;
  }
  #content > div:first-child {
    margin-bottom: 20px;
  }
  .modal-body #content {
    padding: 0;
    margin: 0;
  }
  .modal-body #content >div {
    margin: 0;
    padding: 0;
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
    description: "",
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
        <div className="modal-header">
          <h2>Create New Event</h2>
          <span
            className="close"
            onClick={() => {
              toggleCreateEventModal(false);
            }}>
            &times;
          </span>
        </div>
        <div className="modal-body">
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
              familyMembers={familyMembers}
              eventDetails={eventDetails}
              handleEventDetailsChange={handleEventDetailsChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </NewEventModal>,
    document.getElementById("modal")
  );
}
