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
    width: 30%;
    display: block;
    margin: 20px auto;
    border: none;
  }
  #content {
    justify-content: center
    display: grid;
    background-color: white;
    padding: 4em;
  }
  #content > div:first-child {
    margin-top: 5em;
  }
  ..modal-content {
    margin: 1.5em auto;
    width: 30%;
  }
  @media screen and (max-width: 1920px) {
    .modal-content{
      margin: 1.5em auto;
      width: 38%;
    }
    #content {
      justify-content: center;
      display: grid;
      grid-gap: 1%;
      margin: 0 50px
    }
    button[type="submit"] {
      width: 30%;
    }
  }
  @media screen and (max-width: 1024px) {
    .modal-content{
      margin: 1.5em auto;
      width: 50%;
    }
  }
  @media screen and (max-width: 768px) {
    .modal-content{
      margin: 1.5em auto;
      width: 62%;
    }
  }
`;

const initialEventDetails = selectedDate => {
  console.log(
    "new Date(addMinutes(new Date(selectedDate), 30))",
    new Date(addMinutes(new Date(selectedDate), 30))
  );
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

const DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
export default function index({
  isVisible = true,
  auth,
  toggleCreateEventModal,
  selectedCalendars,
  defaultSelectedDate = new Date()
}) {
  const { groups } = useSelector(({ groups }) => ({
    groups
  }));
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
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
    if (id === "eventGuests") {
      setEventDetails({ ...eventDetails, eventGuests: value });
      return;
    } else if (id === "eventSchedule") {
      const isStartDateAfterEndDate = isAfter(
        new Date(value[0]),
        new Date(value[1])
      );
      console.log("isStartDateAfterEndDate", isStartDateAfterEndDate);
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
          : []
    };

    if (selectedCalendars.length > 0) {
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

  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <NewEventModal
      data-testid="app-dashboard-my-events-new-event"
      className="modal"
      theme={theme}>
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleCreateEventModal(false);
          }}>
          &times;
        </span>
        <div id="content">
          <h2
            style={{
              textAlign: "center",
              marginBottom: 50,
              marginTop: -10,
              fontSize: "2em"
            }}>
            Create New Event
          </h2>
          <EventForm
            eventDetails={eventDetails}
            handleGroupSelect={handleGroupSelect}
            handleGroupRemove={handleGroupRemove}
            groups={groupOptions}
            handleEventDetailsChange={handleEventDetailsChange}
            onSubmit={handleSubmit}
            selectedGroup={selectedGroup}
          />
        </div>
      </div>
    </NewEventModal>,
    document.getElementById("modal")
  );
}
