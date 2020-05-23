import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { uuid } from "uuidv4";
import { format } from "date-fns";

import CustomMultiSelect from "../../../../helpers/CustomMultiSelect";

import { addEvent } from "../../../../redux/actions/Events";
import { getUTCDate } from "../../../../helpers/datetime";

const DuplicateEventModal = styled.div`
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
  button {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    width: 100%;
    display: block;
    margin: 20px auto;
    border: none;
  }
  #content {
    display: grid;
    background-color: white;
    padding: 4em;
  }
  #content > div:first-child {
    margin-top: 5em;
  }
  .modal-content {
    margin: 1.5em auto;
    width: 35%;
  }
  @media (min-width: 600px) {
    button {
      width: 30%;
    }
  }
`;

export default function index({
  defaultEventDetails,
  isVisible = true,
  toggleDuplicateEventModal
}) {
  const { auth, calendars } = useSelector(({ auth, calendars }) => ({
    auth,
    calendars
  }));
  const [calendarOptions, setCalendarOptions] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState([]);
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  //   const { register, errors } = useForm({
  //     mode: "onSubmit",
  //     reValidateMode: "onChange"
  //   });

  useEffect(() => {
    if (calendars && calendars[0] && isVisible) {
      const formattedCalendars = calendars[0].map(item => {
        return {
          id: item.id,
          name: item.name
        };
      });
      setCalendarOptions(formattedCalendars);
    }
  }, [calendars, isVisible]);
  const handleSubmit = value => {
    const calendarIds = selectedCalendar.map(calendar => calendar.id);

    const payload = {
      id: uuid(),
      start_of_event: format(
        getUTCDate(defaultEventDetails.start_of_event),
        "yyyy-MM-dd HH:mm:ss"
      ),
      end_of_event: format(
        getUTCDate(defaultEventDetails.end_of_event),
        "yyyy-MM-dd HH:mm:ss"
      ),

      type: defaultEventDetails.type,
      location: defaultEventDetails.location,
      name: defaultEventDetails.name,
      status: defaultEventDetails.status,
      time: "8:00PM",
      description: defaultEventDetails.description,
      visibility: defaultEventDetails.visibility,
      auth_email: auth.email,
      calendar_ids: calendarIds,
      guests: defaultEventDetails.guests.map(guest => guest.user_id),
      group_ids: defaultEventDetails.group_ids
    };

    console.log("handleSubmit payload", payload);
    console.log("handleSubmit defaultEventDetails", defaultEventDetails);
    console.log("handleSubmit selectedCalendar", selectedCalendar);
    dispatch(addEvent(payload));
    toggleDuplicateEventModal();
  };

  if (!isVisible) {
    return <></>;
  }

  const handleCalendarSelect = value => {
    setSelectedCalendar(value);
  };
  const handleCalendarRemove = value => {
    setSelectedCalendar(value);
  };

  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <DuplicateEventModal
      data-testid="app-dashboard-my-events-new-event"
      className="modal"
      theme={theme}>
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleDuplicateEventModal();
          }}>
          &times;
        </span>
        <div id="content">
          <h2>Duplicate Event </h2>
          <p>
            <b>Name:</b> {defaultEventDetails.name}
          </p>
          <p>
            {format(
              new Date(defaultEventDetails.start_of_event),
              "MMM dd,yyyy hh:mm a"
            )}{" "}
            {format(
              new Date(defaultEventDetails.end_of_event),
              "MMM dd,yyyy hh:mm a"
            )}{" "}
          </p>
          <CustomMultiSelect
            className="field-input"
            options={calendarOptions}
            onSelect={handleCalendarSelect}
            onRemove={handleCalendarRemove}
            placeholder="Add Calendar"
            displayValue="name"
            closeIcon="cancel"
          />
          <button
            data-testid="app-dashboard-my-events-duplicate-event-button-save"
            onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </DuplicateEventModal>,
    document.getElementById("modal")
  );
}
