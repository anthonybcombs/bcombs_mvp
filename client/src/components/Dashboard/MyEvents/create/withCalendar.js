import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { uuid } from "uuidv4";
import styled, { ThemeContext } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { addHours, addMinutes, addSeconds, format } from "date-fns";

import { addEvent } from "../../../../redux/actions/Events";
import MicroCalendar from "../../../Calendar/micro-calendar";
import EventForm from "../forms/EventForm";

import { getUTCDate } from "../../../../helpers/datetime";

const NewEventModal = styled.div`
  h2 {
    font-size: 2em;
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
    display: block;
    margin: 20px auto;
    border: none;
  }
  #content {
    display: grid;
    background-color: white;
    padding: 7em;
  }
  #content > div:first-child {
    margin-top: 5em;
  }
  .modal-content {
    margin: 1.5em auto;
    width: 80%;
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
    status: "Scheduled"
  };
};

const DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
export default function index({
  auth,
  contacts,
  calendars = [],
  isEventSection = false,
  isVisible = true,
  toggleCreateEventModal
}) {
  const { groups } = useSelector(({ groups }) => ({
    groups
  }));
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [contactOptions, setContactOptions] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [eventDetails, setEventDetails] = useState(
    initialEventDetails(selectedDate)
  );
  const [calendarOptions, setCalendarOptions] = useState([]);
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (contacts && isVisible) {
      let formattedContacts = contacts.map(item => {
        return {
          name: `${item.first_name} ${item.last_name}`,
          id: item.user_id
        };
      });
      setContactOptions(formattedContacts);
    }
  }, [contacts, isVisible]);

  useEffect(() => {
    if (calendars && calendars[0]) {
      const formattedCalendars = calendars[0].map(item => {
        return {
          value: item.id,
          label: item.name
        };
      });
      setCalendarOptions(formattedCalendars);
    }
  }, [calendars]);

  useEffect(() => {
    if (groups) {
      const createdGroups = groups.created_groups;
      const joinedGroups = groups.joined_groups;
      const combinedGroups = [
        ...(createdGroups || []),
        ...(joinedGroups || [])
      ];

      setGroupOptions([...combinedGroups]);
    }
  }, [groups]);

  const handleSetSelectedDate = date => {
    const currentDateTime = addSeconds(
      addMinutes(
        addHours(date, new Date().getHours()),
        new Date().getMinutes()
      ),
      new Date().getSeconds()
    );
    setSelectedDate(date);
    setEventDetails({
      ...eventDetails,
      date: currentDateTime,
      time: format(currentDateTime, "hh:mm a"),
      eventSchedule: [currentDateTime, currentDateTime]
    });
  };
  const handleEventDetailsChange = (id, value, action = "") => {
    // let newEventGuests = eventDetails.eventGuests;
    if (id === "eventGuests") {
      setEventDetails({ ...eventDetails, eventGuests: value });
      return;
    }
    setEventDetails({ ...eventDetails, [id]: value });
  };

  const handleCalendarSelect = value => {
    console.log("HANDLE SELECT CALENDAR", value);
    setSelectedCalendar(value);
  };
  const handleCalendarRemove = value => {
    setSelectedCalendar(value);
  };
  const handleSubmit = value => {
    toggleCreateEventModal(false);
    const calendarIds = selectedCalendar.map(calendar => calendar.value);
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
      visibility: eventDetails.visibility,
      recurring: eventDetails.recurring,
      recurring_end_date:
        eventDetails.recurring !== "No Repeat" &&
        eventDetails.recurringEndDate &&
        eventDetails.recurringEndType === "on"
          ? format(getUTCDate(eventDetails.recurringEndDate), DATE_TIME_FORMAT)
          : null,
      auth_email: auth.email,
      calendar_ids: calendarIds,
      guests: eventDetails.eventGuests.map(item => item.id),
      group_ids:
        eventDetails.visibility === "custom"
          ? selectedGroup.map(group => group.id)
          : []
    };

    dispatch(addEvent(payload));
    setEventDetails(initialEventDetails(selectedDate));
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
          <MicroCalendar
            removeSubHeader={true}
            events={[]}
            selectedDate={selectedDate}
            setSelectedDate={handleSetSelectedDate}
            selectedEvent={null}
            setSelectedEvent={() => {}}
          />
          <EventForm
            calendars={calendarOptions}
            contactOptions={contactOptions}
            eventDetails={eventDetails}
            groups={groupOptions}
            isEventSection={isEventSection}
            handleGroupSelect={handleGroupSelect}
            handleGroupRemove={handleGroupRemove}
            handleCalendarSelect={handleCalendarSelect}
            handleCalendarRemove={handleCalendarRemove}
            handleEventDetailsChange={handleEventDetailsChange}
            onSubmit={handleSubmit}
            header={`Create New ${eventDetails.eventType}`}
            selectedCalendar={selectedCalendar}
          />
        </div>
      </div>
    </NewEventModal>,
    document.getElementById("modal")
  );
}
