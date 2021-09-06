import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { uuid } from "uuidv4";
import { addMinutes, format, isAfter } from "date-fns";
import { addEvent } from "../../../../redux/actions/Events";
import EventForm from "../forms/EventForm";

import { getUTCDate } from "../../../../helpers/datetime";

const NewEventModal = styled.div`
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
  .timepicker {
    transition: none !important;
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
    max-width: 120px;
    display: block;
    margin: 20px auto;
    border: none;
  }
  #content {
    justify-content: center
    display: grid;
    background-color: white;
    padding: 7em;
  }
  #content > div:first-child {
    margin-bottom: 20px;
  }
  .modal-body #content {
    padding: 0;
    margin: 0;
  }
  .modal-body #content >div {
    margin: 0;
    padding: 0;
  }
`;

const initialEventDetails = selectedDate => {
  return {
    id: uuid(),
    name: "",
    date: new Date(),
    time: format(selectedDate, "hh:mm a"),
    eventSchedule: [
      selectedDate,
      new Date(addMinutes(new Date(selectedDate), 30))
    ],
    eventGuests: [],
    familyMembers: [],
    eventType: "Event",
    location: "",
    eventDescription: "",
    status: "Scheduled",
    visibility: "public"
  };
};

const DATE_TIME_FORMAT = "MM/dd/yyyy HH:mm:ss";
export default function index({
  isVisible = true,
  auth,
  toggleCreateEventModal,
  selectedCalendars,
  defaultSelectedDate = new Date()
}) {
  const { calendars, groups,vendors } = useSelector(({ calendars, groups,vendors }) => ({
    calendars,
    groups,
    vendors
  }));
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [selectedAppGroup, setSelectedAppGroup] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    id: uuid(),
    name: "",
    date: defaultSelectedDate,
    time: format(defaultSelectedDate, "hh:mm a"),
    eventSchedule: [defaultSelectedDate, defaultSelectedDate],
    eventGuests: [],
    familyMembers: [],
    eventType: "Event",
    location: "",
    description: "",
    status: "Scheduled",
    recurring: ""
  });

  useEffect(() => {}, []);
  useEffect(() => {
    setEventDetails({
      ...eventDetails,
      date: defaultSelectedDate,
      time: format(defaultSelectedDate, "hh:mm a"),
      eventSchedule: [
        defaultSelectedDate,
        new Date(addMinutes(new Date(defaultSelectedDate), 30))
      ]
    });
  }, [defaultSelectedDate]);

  useEffect(() => {
    if (groups) {
      const createdGroups = groups.created_groups;
      const joinedGroups = groups.joined_groups;
      const combinedGroups = [
        ...(createdGroups || []),
        ...(joinedGroups || [])
      ];
      // let groupOpt = combinedGroups.map(item => {
      //   return {
      //     ...item,
      //     value: item.id,
      //     label: item.name
      //   };
      // });

      setGroupOptions([...combinedGroups]);
    }
  }, [groups]);
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  const handleEventDetailsChange = (id, value) => {
    console.log("Handle Event Detail Change ID", id);
    console.log("Handle Event Detail Change Value", value);
    if (id === "eventGuests") {
      setEventDetails({ ...eventDetails, eventGuests: value });
      return;
    } else if (id === "eventSchedule") {
      const isStartDateAfterEndDate = isAfter(
        new Date(value[0]),
        new Date(value[1])
      );

      console.log("EVENT SCHEDULE ", isStartDateAfterEndDate);
      if (isStartDateAfterEndDate) {
        value[1] = new Date(addMinutes(new Date(value[0]), 30));
      }
      setEventDetails({ ...eventDetails, eventSchedule: value });
    } else {
      setEventDetails({ ...eventDetails, [id]: value });
    }
  };

  const handleSubmit = value => {
    const payload = {
      start_of_event: format(
        getUTCDate(eventDetails.eventSchedule[0]),
        DATE_TIME_FORMAT
      ),
      end_of_event: format(
        getUTCDate(eventDetails.eventSchedule[1]),
        DATE_TIME_FORMAT
      ),
      type: eventDetails.eventType,
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
        eventDetails.eventGuests.length > 0
          ? eventDetails.eventGuests.map(item => item.id)
          : [],
      group_ids:
        eventDetails.visibility === "custom"
          ? selectedGroup.map(item => item.id)
          : [],
      app_group_ids:
          eventDetails.visibility === "custom"
            ? selectedAppGroup.map(item => item.id)
            : []
    };

    if (selectedCalendars.length > 0) {
      console.log('handleSubmit payload', payload)
      toggleCreateEventModal(false);
      dispatch(addEvent(payload));
      setEventDetails(initialEventDetails(new Date()));
    } else {
      alert("Please select a calendar first!");
    }
  };

  const handleGroupSelect = value => {
    setSelectedGroup(value);
  };
  const handleGroupRemove = value => {
    setSelectedGroup(value);
  };

  const handleAppGroupSelect = value => {
    setSelectedAppGroup(value);
  };
  const handleAppGroupRemove = value => {
    setSelectedAppGroup(value);
  };

  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <NewEventModal
      data-testid="app-dashboard-my-events-new-event"
      className="modal"
      theme={theme}>
      <div className="modal-content">
        <h2>Create New Event</h2> 
        <div className="modal-header">
          <span
            className="close"
            onClick={() => {
              toggleCreateEventModal(false);
            }}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <div id="content">
            <EventForm
              calendars={calendars && calendars[0]}
              eventDetails={eventDetails}
              handleGroupSelect={handleGroupSelect}
              handleGroupRemove={handleGroupRemove}
              handleAppGroupSelect={handleAppGroupSelect}
              handleAppGroupRemove={handleAppGroupRemove}
              groups={groupOptions}
              handleEventDetailsChange={handleEventDetailsChange}
              onSubmit={handleSubmit}
              selectedGroup={selectedGroup}
              vendors={vendors}
            />
          </div>
        </div>
      </div>
    </NewEventModal>,
    document.getElementById("modal")
  );
}
