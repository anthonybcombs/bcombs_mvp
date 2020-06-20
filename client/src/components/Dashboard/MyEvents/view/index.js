import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import { format } from "date-fns";
import styled, { ThemeContext } from "styled-components";

const DATE = "MM/dd/yyyy hh:mm a";

const ViewEventModal = styled.div`
  h2 {
    font-size: 2em;
  }

  #content {
    display: grid;
    background-color: white;
    padding: 10em;
  }
  #content > div:first-child {
    margin-top: 5em;
  }
  .modal-content {
    margin: 1.5em auto;
    width: 50%;
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

const getColumns = () => {
  return [
    {
      name: "Name",
      selector: "name",
      sortable: true
    },
    {
      name: "Start Date",
      selector: "start_of_event",
      cell: event => {
        return <div>{format(new Date(event.start_of_event), DATE)}</div>;
      }
    },
    {
      name: "End Date",
      selector: "end_of_event",
      cell: event => {
        return <div>{format(new Date(event.end_of_event), DATE)}</div>;
      }
    }
  ];
};
export default function index({
  toggleViewEvent,
  isVisible = true,
  events = []
}) {
  const theme = useContext(ThemeContext);

  console.log("eventszzz", events);
  if (!isVisible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <ViewEventModal
      data-testid="app-dashboard-my-events-new-event"
      className="modal"
      theme={theme}>
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleViewEvent(false);
          }}>
          &times;
        </span>
        <div>
          <h4>Event on this day</h4>

          <DataTable
            columns={getColumns()}
            data={events}
            pagination
            striped={true}
          />
        </div>
      </div>
    </ViewEventModal>,
    document.getElementById("modal")
  );
}
