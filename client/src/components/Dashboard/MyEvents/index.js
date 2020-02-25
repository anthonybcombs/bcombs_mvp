import React, { useState, useContext } from "react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import styled, { ThemeContext } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
].reverse();
const MyEventsStyled = styled.div`
  background-color: white;
  margin: 1em;
  #header,
  #header > div:first-child,
  #header-calendar-controls,
  #header-controls-buttons {
    display: grid;
  }
  h2 {
    display: inline-block;
    font-size: 2em;
    text-align: center;
  }
  #header select {
    display: inline-block;
    border: none;
    font-size: 1em;
    text-align: center;
    font-weight: bold;
    appearance: none;
    background: url("http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png")
      right center no-repeat;
    padding-right: 20px;
  }
  #header option {
    text-align: center;
  }
  #header-input-controls,
  #header-events-controls {
    position: relative;
  }
  #header button {
    display: block;
    margin: 1em 0 1em 0;
    width: 100%;
    border: none;
    background-color: transparent !important;
    color: ${({ theme }) => theme.header.textColor.primary};
  }
  .input-field {
    width: 95%;
  }
  .input-icons {
    position: absolute;
    top: 10px;
  }
  #events-body {
    padding: 1em 3em 1em 3em;
  }
  #events-body h3 {
    font-weight: bold;
  }
  #events-body table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  #events-body table thead th {
    border-bottom: 1px solid black;
    margin: none;
  }
  #events-body table tbody td {
    border-bottom: 1px solid lightgrey;
    margin: none;
  }
  @media (min-width: 600px) {
    #header {
      grid-template-columns: 80% 20%;
    }
    #header-controls-buttons {
      grid-template-columns: 50% 50%;
    }
    #header > div:first-child {
      grid-template-columns: 40% 20% 40%;
      grid-gap: 1%;
    }
    #headers-events-controls {
      grid-template-columns: 55% 15% 30%;
    }
    #header button {
      margin: 1em 0 1em 0;
      width: initial;
    }
    .input-field {
      width: 90%;
    }
    .input-icons {
      position: absolute;
      top: 30%;
    }
  }
`;
export default function index() {
  const theme = useContext(ThemeContext);
  const { events, familyMembers } = useSelector(
    ({ events, familyMembers }) => ({
      events,
      familyMembers
    })
  );
  const [selectedYear, setSelectedYear] = useState(format(new Date(), "yyyy"));
  const handleSelectedYearChange = ({ target }) => {
    setSelectedYear(target.value);
  };
  return (
    <MyEventsStyled data-testid="app-dashboard-my-events" theme={theme}>
      <div data-testid="app-dashboard-my-events-header" id="header">
        <div>
          <div id="header-calendar-controls">
            <h2>
              Calendar Year
              <select
                data-testid="app-dashboard-my-events-select-year"
                value={selectedYear}
                onChange={handleSelectedYearChange}
              >
                <option value={2020}>2020</option>
                <option value={2019}>2019</option>
              </select>
            </h2>
          </div>
          <div id="header-controls-buttons">
            <button type="button">SORT</button>
            <button type="button">FILTER</button>
          </div>
          <div id="header-input-controls">
            <div className="input-icons">
              <FontAwesomeIcon className="icon" icon={faSearch} />
              <input
                type="text"
                data-testid="app-dashboard-my-events-input-search"
                placeholder="Find events"
                className="input-field"
              />
            </div>
          </div>
        </div>
        <button
          data-testid="app-dashboard-my-events-create-new-event-button"
          type="button"
        >
          Create a new event +
        </button>
      </div>
      <div data-testid="app-dashboard-my-events-body" id="events-body">
        {monthList.map(month => {
          const eventThisMonth = events.filter(
            event =>
              format(event.date, "MMMM") === month &&
              format(event.date, "yyyy") === selectedYear
          );
          return (
            <div
              data-testid="app-dashboard-my-events-body-events-month"
              key={month}
            >
              <h2 data-testid="app-dashboard-my-events-body-table-month">
                {month}
              </h2>
              {eventThisMonth.length === 0}
              {<p>No events scheduled</p>}
              {eventThisMonth.length > 0 && (
                <table data-testid="app-dashboard-my-events-body-table">
                  <thead>
                    <tr>
                      <th>Event name</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Location</th>
                      <th>Shared with:</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventThisMonth.map(event => (
                      <tr key={event.id}>
                        <td>{event.name}</td>
                        <td>{format(event.date, "MM/dd/yyyy")}</td>
                        <td>{event.time}</td>
                        <td>{event.location}</td>
                        <td>
                          {event.familyMembers.map(eventFamilyMemberId => (
                            <p key={eventFamilyMemberId}>
                              {
                                familyMembers.find(
                                  familyMember =>
                                    familyMember.id ===
                                    parseInt(eventFamilyMemberId)
                                )["name"]
                              }
                            </p>
                          ))}
                        </td>
                        <td>{event.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>
    </MyEventsStyled>
  );
}
