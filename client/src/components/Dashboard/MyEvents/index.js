import React, { useEffect, useState, useContext } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import styled, { ThemeContext } from "styled-components";
import NewEventModal from "./create/withCalendar";
import Header from "./header";
import Body from "./body";

// REDUX
import { getContact } from "../../../redux/actions/Contacts";
import { getEvents } from "../../../redux/actions/Events";
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
  #header-calendar-controls {
    margin-top: 1em;
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
  const [contactOptions, setContactOptions] = useState([]);
  const [isNewEventModalVisible, setIsEventModalVisible] = useState(false);
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { auth, contacts, events, familyMembers } = useSelector(
    ({ auth, contacts, events, familyMembers }) => ({
      auth,
      contacts,
      events,
      familyMembers,
    })
  );

  useEffect(() => {
    if (auth.email) {
      dispatch(getEvents(auth.email));
      dispatch(getContact(auth.email));
    }
  }, []);

  const [selectedYear, setSelectedYear] = useState(format(new Date(), "yyyy"));
  const handleSelectedYearChange = ({ target }) => {
    setSelectedYear(target.value);
  };
  console.log("contactssssssssss", contacts);
  console.log("contactssssssssss contactOptions", contactOptions);
  return (
    <MyEventsStyled data-testid="app-dashboard-my-events" theme={theme}>
      <NewEventModal
        auth={auth}
        contacts={contacts}
        isVisible={isNewEventModalVisible}
        toggleCreateEventModal={setIsEventModalVisible}
      />
      <Header
        selectedYear={selectedYear}
        handleSelectedYearChange={handleSelectedYearChange}
        toggleCreateEventModal={setIsEventModalVisible}
      />
      <Body
        events={events}
        selectedYear={selectedYear}
        familyMembers={familyMembers}
      />
    </MyEventsStyled>
  );
}
