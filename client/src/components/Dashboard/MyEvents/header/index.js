import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
export default function index({
  selectedYear,
  handleSelectedYearChange,
  toggleCreateEventModal
}) {
  return (
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
        onClick={() => {
          toggleCreateEventModal(true);
        }}
      >
        Create a new event +
      </button>
    </div>
  );
}
