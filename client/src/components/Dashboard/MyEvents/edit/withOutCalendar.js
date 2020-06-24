import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { addMinutes, format, isAfter } from "date-fns";
import { updateEvent } from "../../../../redux/actions/Events";
import EventForm from "../forms/EventForm";

import { getUTCDate } from "../../../../helpers/datetime";

const EditEventModal = styled.div`
  h2 {
    text-align: center;
  }
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
    width: 40%;
  }
  @media screen and (max-width: 1024px) {
    .modal-content {
      margin: 1.5em auto;
      width: 50%;
    }
    #content {
      justify-content: center;
      display: grid;
      grid-gap: 1%;
      margin: 0 50px;
    }
  }
  @media screen and (max-width: 768px) {
    .modal-content {
      margin: 1.5em auto;
      width: 62%;
    }
    #content {
      justify-content: center;
      display: grid;
      grid-gap: 1%;
      margin: 0 50px;
    }
  }
  @media screen and (max-width: 425px) {
    .modal-content {
      margin: 1.5em auto;
      max-width: 100%;
      width: auto !important;
    }
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: 30%;
    }
  }
`;

const DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

export default function index({
  auth,
  isVisible = true,
  toggleEditEventModal,
  defaultEventDetails,
  selectedCalendars,
}) {
  const { groups } = useSelector(({ groups }) => ({
    groups,
  }));
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [eventDetails, setEventDetails] = useState({});

  useEffect(() => {
    if (defaultEventDetails) {
      console.log("defaultEventDetails", defaultEventDetails);
      setEventDetails({
        ...defaultEventDetails,
        eventSchedule: [
          new Date(defaultEventDetails.start_of_event),
          new Date(defaultEventDetails.end_of_event),
        ],
        defaultGroupIds: groupOptions.filter(
          (item) =>
            defaultEventDetails.group_ids &&
            defaultEventDetails.group_ids.includes(item.id)
        ),
        recurringEndDate: defaultEventDetails.recurring_end_date,
        recurringEndType: defaultEventDetails.recurring_end_date
          ? "on"
          : "never",
      });
      setSelectedGroup(defaultEventDetails.group_ids);
    }
  }, [isVisible]);

  useEffect(() => {
    if (groups) {
      const createdGroups = groups.created_groups;
      const joinedGroups = groups.joined_groups;
      const combinedGroups = [
        ...(createdGroups || []),
        ...(joinedGroups || []),
      ];
      // let groupOpt = combinedGroups.map((item) => {
      //   return {
      //     ...item,
      //     value: item.id,
      //     label: item.name,
      //   };
      // });

      setGroupOptions([...combinedGroups]);
    }
  }, [groups]);

  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  const handleEventDetailsChange = (id, value, action = "") => {
    if (id === "eventGuests") {
      setEventDetails({ ...eventDetails, eventGuests: value });
    } else if (id === "removeGuests") {
      setEventDetails({
        ...eventDetails,
        removedGuests: [...(eventDetails.removeGuests || []), value],
      });
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

  const handleSubmit = (value) => {
    const payload = {
      start_of_event: format(
        getUTCDate(eventDetails.eventSchedule[0]),
        DATE_TIME_FORMAT
      ),
      end_of_event: format(
        getUTCDate(eventDetails.eventSchedule[1]),
        DATE_TIME_FORMAT
      ),
      type: eventDetails.type,
      id: eventDetails.id,
      location: eventDetails.location,
      name: eventDetails.name,
      status: eventDetails.status,
      time: eventDetails.time,
      description: eventDetails.description,
      auth_email: auth.email,
      calendar_ids: selectedCalendars,
      visibility: eventDetails.visibility,
      recurring: eventDetails.recurring,
      recurring_end_date:
        eventDetails.recurring !== "No Repeat" &&
        eventDetails.recurringEndDate &&
        eventDetails.recurringEndType === "on"
          ? format(getUTCDate(eventDetails.recurringEndDate), DATE_TIME_FORMAT)
          : null,
      guests:
        eventDetails.eventGuests && eventDetails.eventGuests.length > 0
          ? eventDetails.eventGuests.map((item) => item.id)
          : [],
      removed_guests:
        eventDetails.removedGuests && eventDetails.removedGuests.length > 0
          ? eventDetails.removedGuests.map((item) => item.id)
          : [],
      group_ids:
        eventDetails.visibility === "custom"
          ? selectedGroup.map((item) => item.id)
          : [],
    };

    dispatch(updateEvent(payload));
    toggleEditEventModal();
  };

  const handleGroupSelect = (value) => {
    setSelectedGroup(value);
  };
  const handleGroupRemove = (value) => {
    setSelectedGroup(value);
  };

  console.log("selectedGroupggggg", selectedGroup);
  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <EditEventModal
      data-testid="app-dashboard-my-events-new-event"
      className="modal"
      theme={theme}
    >
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleEditEventModal();
          }}
        >
          &times;
        </span>
        <div id="content">
          <h2 style={{ textAlign: "center", marginBottom: 50, marginTop: -50 }}>
            Edit Event
          </h2>
          <EventForm
            editMode={true}
            eventDetails={eventDetails}
            handleGroupSelect={handleGroupSelect}
            handleGroupRemove={handleGroupRemove}
            groups={groupOptions}
            header={"Edit Event"}
            handleEventDetailsChange={handleEventDetailsChange}
            onSubmit={handleSubmit}
            selectedGroup={selectedGroup}
          />
        </div>
      </div>
    </EditEventModal>,
    document.getElementById("modal")
  );
}
