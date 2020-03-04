import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { format, startOfWeek, endOfWeek } from "date-fns";
import CreateCalendarModal from "../../new-calendar/Create";
const HeaderStyled = styled.div`
  display: grid;
  margin-bottom: 2em;
  text-align: center;
  h1 {
    padding: 0;
    margin: 0;
  }
  button {
    border: none;
  }
  svg {
    cursor: pointer;
    position: relative;
    margin: 0 1em 0 1em;
    color: black;
  }
  #calendar-controls {
    margin-top: 1em;
  }
  #calendars-control button {
    width: 100%;
    color: white;
  }
  .calendar {
    height: 100px;
    position: relative;
    display: inline-block;
    cursor: pointer;
  }
  .calendar img {
    display: inline-block;
    width: 100%; // to maintain aspect ratio. You can use 100% if you don't care about that
    height: 100%;
    padding: 0;
    margin: 0;
  }
  .calendar p {
    margin: 0;
    padding: 0.2em;
  }
  .calendar p.selected {
    background: #f26e21;
  }
  .calendar p span {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 5px;
    border-radius: 50%;
  }
  #calendar-type button.selected {
    background-color: white;
    border-bottom: 10px solid #f26e21;
  }
  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    #calendar-type {
      grid-template-columns: repeat(2, 50%);
    }
    #calendars-control {
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }
  }
`;
export default function index({
  currentWeek,
  handleWeekChange,
  calendars,
  calendarType,
  handleChangeCalendarType,
  selectedCalendars,
  handleCalendarSelection
}) {
  const [isVisibleCreateCalendarModal, toggleCreateCalendarModal] = useState(
    false
  );
  return (
    <HeaderStyled data-testid="app-big-calendar-header">
      <CreateCalendarModal
        isVisible={isVisibleCreateCalendarModal}
        toggleCreateCalendarModal={toggleCreateCalendarModal}
      />
      <div className="grid" id="calendar-type">
        <button
          className={`${calendarType === "week" ? "selected" : ""}`}
          onClick={() => handleChangeCalendarType("week")}
        >
          Week
        </button>
        <button
          className={`${calendarType === "month" ? "selected" : ""}`}
          onClick={() => handleChangeCalendarType("month")}
        >
          Month
        </button>
      </div>
      <div id="calendar-controls">
        <h2 data-testid="app-big-calendar-header-current-month">
          <FontAwesomeIcon
            data-testid="app-big-calendar-prev-month-button"
            icon={faArrowLeft}
            onClick={() => {
              handleWeekChange();
            }}
          />
          {format(startOfWeek(currentWeek), "MMM dd")}-
          {format(endOfWeek(currentWeek), "MMM dd yyyy")}
          <FontAwesomeIcon
            data-testid="app-big-calendar-next-month-button"
            icon={faArrowRight}
            onClick={() => {
              handleWeekChange("next");
            }}
          />
        </h2>
      </div>
      <div className="grid" id="calendars-control">
        <button
          onClick={() => {
            toggleCreateCalendarModal(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        {calendars.map((calendar, index) => (
          <div
            className="calendar"
            key={index}
            onClick={() => {
              handleCalendarSelection(calendar.id);
            }}
          >
            <img src={calendar.image} />
            <p
              className={`${
                selectedCalendars.includes(calendar.id) ? "selected" : ""
              }`}
            >
              <span style={{ backgroundColor: `${calendar.color}` }}></span>
              {calendar.name}
            </p>
          </div>
        ))}
      </div>
    </HeaderStyled>
  );
}