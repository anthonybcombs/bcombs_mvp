import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { format } from "date-fns";
import styled, { ThemeContext } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { deleteEvent } from "../../../../redux/actions/Events";

import Confirmation from "../../../../helpers/Confirmation";

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

const getColumns = ({
  auth,
  toggleEditEvent,
  toggleViewEvent,
  setCurrentData,
  setIsConfirmationVisible
}) => {
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
    },
    {
      name: "Action",

      cell: event => {
        return (
          <div>
            <button
              style={{ cursor: "pointer" }}
              onClick={() => {
                toggleEditEvent(event);
              }}>
              Edit
            </button>
            {`   `}
            <button
              style={{ cursor: "pointer" }}
              onClick={e => {
                setCurrentData({
                  id: event.id,
                  email: auth.email
                });
                setIsConfirmationVisible(true);
              }}>
              Delete
            </button>
          </div>
        );
      }
    }
  ];
};
export default function index({
  auth,
  toggleViewEvent,
  toggleEditEvent,
  isVisible = true,
  events = []
}) {
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteEvent(currentData));
    setCurrentData(null);
    setIsConfirmationVisible(false);
    toggleViewEvent(false);
  };

  console.log("eventszzz auth", auth);
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
            columns={getColumns({
              auth,

              toggleEditEvent,
              toggleViewEvent,
              setCurrentData,
              setIsConfirmationVisible
            })}
            data={events}
            pagination
            striped={true}
          />
        </div>
      </div>

      <Confirmation
        isVisible={isConfirmationVisible}
        message={`Are you sure you want to delete this event?`}
        toggleConfirmationVisible={setIsConfirmationVisible}
        onSubmit={handleDelete}
        submitButtonLabel="Submit"
      />
    </ViewEventModal>,
    document.getElementById("modal")
  );
}
