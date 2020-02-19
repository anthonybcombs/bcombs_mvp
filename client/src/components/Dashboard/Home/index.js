import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faBell,
  faPlusCircle
} from "@fortawesome/free-solid-svg-icons";
import styled, { ThemeContext } from "styled-components";
import { addDays, format } from "date-fns";
import SmallCalendar from "../../Calendar/small-calendar/";
const HomeStyled = styled.div`
  padding: 1px 1em 1px 1em;
  box-shadow: 0px 3px 6px #908e8e;
  .accordion button {
    width: 100%;
  }
  .accordion {
    margin-top: 1em;
  }
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
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
  }
  .selected {
    color: black;
    font-weight: bold;
    background-color: white;
  }

  @media (min-width: 600px) {
    .grid {
      grid-template-columns: 4fr 6fr;
      grid-gap: 2%;
    }
    #add-event-button {
      display: block;
      position: relative;
      width: 60px !important;
      left: 88%;
    }
  }
`;
export default function index() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState();
  const theme = useContext(ThemeContext);
  const events = [
    {
      id: 1,
      name: "testing event 1",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: addDays(new Date(), 1)
    },
    {
      id: 2,
      name: "testing event 2",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date()
    },
    {
      id: 3,
      name: "testing event 3",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date()
    },
    {
      id: 4,
      name: "testing event 4",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date()
    },
    {
      id: 5,
      name: "testing event 5",
      description:
        "Elit ad nisi veniam qui minim minim. Amet ea aute sint excepteur commodo commodo in ullamco quis. Voluptate labore officia esse ullamco. Officia ad dolor elit est esse ullamco cupidatat sint. Est proident sint laboris dolore nisi magna irure et aliqua eu exercitation eu et.",
      date: new Date()
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
            <div className="accordion">
              <h3>
                <FontAwesomeIcon icon={faCalendar} />
                <span>Calendars</span>
              </h3>
              <div className="panel">
                {eventsOnThisDay.map((event, i) => (
                  <div
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
              </div>
            </div>
            <div className="accordion">
              <h3>
                <FontAwesomeIcon icon={faBell} />
                <span>Notifications</span>
              </h3>
              <div className="panel">
                <div className="panel-body">test notification</div>
                <div className="panel-body">test notification</div>
                <div className="panel-body">test notification</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="pane">
            <div className="grid">
              <h3>Test</h3>
              <button id="add-event-button">
                <FontAwesomeIcon icon={faPlusCircle} size="3x" />
              </button>
            </div>

            <h2>Upcoming Events</h2>
            <div className="panel">
              {selectedEvent ? (
                <div className="panel-body">
                  <h4>{selectedEvent.name}</h4>
                  {selectedEvent.description}
                </div>
              ) : (
                <p>No event for now. Create and enjoy the system.</p>
              )}
            </div>
          </div>
          <div className="pane">
            <h3>Recommendations</h3>
            <div className="panel">
              <div className="panel-body">Sample recommendations</div>
            </div>
          </div>
        </div>
      </div>
    </HomeStyled>
  );
}
