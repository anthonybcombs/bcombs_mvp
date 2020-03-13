import React, { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapsible from "react-collapsible";
import {
  faCalendar,
  faBell,
  faPlusCircle
} from "@fortawesome/free-solid-svg-icons";
import styled, { ThemeContext } from "styled-components";
import { format } from "date-fns";
import WelcomeMessage from "./WelcomeMessage";
import SmallCalendar from "../../Calendar/small-calendar/";
import NewEventModal from "../MyEvents/create/withCalendar";
const HomeStyled = styled.div`
  padding: 1px 1em 1px 1em;
  box-shadow: 0px 3px 6px #908e8e;
  .pane {
    display: block;
    position: relative;
    background-color: white;
    padding: 1em;
    width: auto;
    height: auto;
    margin: 0.5em 0 0.5em 0;
    box-shadow: 0px 3px 6px #908e8e;
  }
  h3 {
    cursor: pointer;
  }
  h3 > svg {
    margin-right: 0.5em;
  }
  .panel {
    max-height: 20vh;
    overflow: auto;
  }
  .panel-body {
    width: auto;
    color: white;
    background-color: ${({ theme }) => theme.header.backgroundColor.primary};
    padding: 10px;
    margin: 0.5em;
    cursor: pointer;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize};
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    border-radius: ${({ theme }) => theme.button.borderRadius};
  }
  .selected {
    color: black;
    font-weight: bold;
    background-color: white;
  }
  .is-closed h3:after {
    content: "↓";
    font-size: 1em;
    color: black;
    margin-left: 0.5em;
  }
  .is-open h3:after {
    content: "↑";
    font-size: 1em;
    color: black;
    margin-left: 0.5em;
  }
  @media (min-width: 600px) {
    .grid {
      grid-template-columns: 4fr 6fr;
      grid-gap: 2%;
    }
    #add-event-button {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      margin-top: 0.5em;
      margin-right: 0.5em;
      line-height: 1em;
    }
  }
`;
export default function index({ location }) {
  const [isNewEventModalVisible, setIsEventModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState();
  const events = useSelector(({ events }) => events);
  const theme = useContext(ThemeContext);
  if (location.state === null) {
    location.state = {};
  }
  if (location.state.calendarName === undefined) {
    location.state.calendarName = "";
  }
  const calendars = [
    {
      id: 1,
      name:
        location.state.calendarName.length > 0
          ? location.state.calendarName
          : "test"
    }
  ];
  const eventsOnThisDay = events.filter(
    event =>
      format(event.date, "MM dd yyyy") === format(selectedDate, "MM dd yyyy")
  );
  const handleSetSelectedDate = date => {
    setSelectedEvent();
    setSelectedDate(date);
  };
  const handleEventSelection = id => {
    setSelectedEvent(eventsOnThisDay.filter(event => event.id === id)[0]);
  };
  return (
    <HomeStyled data-testid="app-dashboard-home" theme={theme}>
      {location.state.calendarName.length > 0 && (
        <WelcomeMessage calendarName={location.state.calendarName} />
      )}
      <NewEventModal
        isVisible={isNewEventModalVisible}
        toggleCreateEventModal={setIsEventModalVisible}
        defaultSelectedDate={selectedDate}
      />
      <h2 data-testid="app-dashboard-home-header">My Calendar</h2>
      <div className="grid">
        <div>
          <div className="pane">
            <SmallCalendar
              events={events}
              selectedDate={selectedDate}
              setSelectedDate={handleSetSelectedDate}
              setSelectedEvent={setSelectedEvent}
            />
            <Collapsible
              trigger={
                <h3 data-testid="app-dashboard-home-sub-header-calendars">
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>Calendars</span>
                </h3>
              }
              open
              lazyRender
            >
              <div className="panel">
                {calendars.map((calendar, i) => (
                  <div
                    className={`panel-body`}
                    key={i}
                    onClick={() => {
                      handleEventSelection(calendar.id);
                    }}
                  >
                    {calendar.name}
                  </div>
                ))}
              </div>
            </Collapsible>
            <Collapsible
              trigger={
                <h3 data-testid="app-dashboard-home-sub-header-notifications">
                  <FontAwesomeIcon icon={faBell} />
                  <span>Notifications</span>
                </h3>
              }
              open
              lazyRender
            >
              <div className="panel">
                <div className="panel-body">test notification</div>
                <div className="panel-body">test notification</div>
                <div className="panel-body">test notification</div>
              </div>
            </Collapsible>
          </div>
        </div>
        <div>
          <div className="pane">
            <h3>Test</h3>
            <button
              id="add-event-button"
              onClick={() => {
                setIsEventModalVisible(true);
              }}
            >
              <FontAwesomeIcon icon={faPlusCircle} size="3x" />
            </button>

            <h2 data-testid="app-dashboard-home-sub-header-upcoming-events">
              Upcoming Events
            </h2>

            <div className="panel">
              {eventsOnThisDay.map((event, i) => (
                <div
                  data-testid="app-dashboard-home-event"
                  className={`panel-body ${
                    selectedEvent && event.id === selectedEvent.id
                      ? "selected"
                      : ""
                  }`}
                  key={i}
                  onClick={() => {
                    handleEventSelection(event.id);
                  }}
                >
                  {event.name}
                </div>
              ))}
              {/* {selectedEvent ? (
                <div className="panel-body">
                  <h4>{selectedEvent.name}</h4>
                  {selectedEvent.description}
                </div>
              ) : (
                <p>No event for now. Create and enjoy the system.</p>
              )} */}
            </div>
          </div>
          <div className="pane">
            <h3 data-testid="app-dashboard-home-sub-header-recommendations">
              Recommendations
            </h3>
            <div className="panel">
              <div className="panel-body">Sample recommendations</div>
            </div>
          </div>
        </div>
      </div>
    </HomeStyled>
  );
}
