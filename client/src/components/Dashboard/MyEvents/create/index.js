import React, { useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import SmallCalendar from "../../../Calendar/small-calendar";
import EventForm from "../forms/EventForm";
const NewEventModal = styled.div`
  display: grid;
  background-color: white;
  margin: 1em;
  padding: 1em;
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
  @media (min-width: 600px) {
    grid-template-columns: 60% 40%;
    grid-gap: 1%;
    button[type="submit"] {
      width: 30%;
    }
  }
`;
export default function index() {
  const [eventDetails, setEventDetails] = useState({
    title: ""
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const theme = useContext(ThemeContext);
  const handleSetSelectedDate = date => {
    setSelectedDate(date);
  };
  const handleInputChange = (id, value) => {
    setEventDetails({ ...eventDetails, [id]: value });
  };
  const handleSubmit = value => {};
  return (
    <NewEventModal data-testid="app-dashboard-my-events-new-event">
      <SmallCalendar
        events={[]}
        selectedDate={selectedDate}
        setSelectedDate={handleSetSelectedDate}
        selectedEvent={null}
        setSelectedEvent={() => {}}
      />
      <EventForm
        eventDetails={eventDetails}
        handleInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </NewEventModal>
  );
}
