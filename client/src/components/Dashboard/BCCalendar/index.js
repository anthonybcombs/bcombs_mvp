import React, {useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import { 
  requestGetApplicationByUserId, 
  requestGetUserApplicationHistory
} from "../../../redux/actions/Application";

const CalendarStyled = styled.div`
display: grid;
padding: 20px;
grid-template-columns: 1fr 4fr;
    grid-gap: 1%;

    .control-block, .calendar-wrapper {
      background-color: white;
      box-shadow: 0 0 25px #eae9e9;
      padding: 5px;    
    }

    `;

import Loading from "../../../helpers/Loading.js";

const DATE_TIME_FORMAT = "LLL dd, yyyy p";


const BCCalendar = props => {
  const dispatch = useDispatch();

  const { auth, applications, loading } = useSelector(
    ({auth, applications, loading}) => {
      return {auth, applications, loading}
    }
  );

  // if(applications.updateapplication && applications.updateapplication.message == "application successfully updated") {
  //   window.location.reload(false);
  // }

  const [selectedApplication, setSelectedApplication] = useState({});

  const [childInformation, setChildInformation] = useState({});

  const [parentsInformation, setParentsInformation] = useState([]);

  const [vendorName, setVendorName] = useState();

  const [defaultApplication,setDefaultApplication] = useState([])
  const [filteredData, setFilteredData] = useState([]);

  const [isLoading,setIsLoading ] = useState(true)

  const componentRef = useRef();
  
  useEffect(() => {
    console.log('AUTHHHH MY APPLCIATION', auth)
    if(auth.user_id) {
      dispatch(requestGetApplicationByUserId(auth.user_id))
    }
  }, []);

  useEffect(() => {
    if (auth.user_id) {
      dispatch(requestGetUserApplicationHistory(auth.user_id));
    }
  }, []);

  const DATE_TIME_FORMAT2 = "MM/dd/yyyy hh:mm:ss";

  const formatEvents = () => {
    if (!props.appointments)
      return null;
    return props.appointments.map(appointment => {
              const {title, end, start} = appointment
  
              let startTime = new Date(start)
              let endTime = new Date(end)
  
              return {
                title, 
                start: startTime,
                end: endTime, 
                extendedProps: {...appointment}
              }
          })
  };

  const handleEventClick= ({event}) => {
    // openAppointment is a function I wrote to open a form to edit that appointment
    props.openAppointment(event.extendedProps)
  }

  const handleEventDrop = (info) => {
        if(window.confirm("Are you sure you want to change the event date?")){
            console.log('change confirmed')

            // updateAppointment is another custom method
            props.updateAppointment({...info.event.extendedProps, start: info.event.start, end: info.event.end})

        } else {
            console.log('change aborted')
        }
   }

  console.log('calendar auth',auth)
  return (
    <CalendarStyled>
      <div id="calendarControls" className="control-block"> Hello </div>
      <div id="calendarContainer" className="calendar-wrapper">
        {
          loading.application ? (
            <Loading />
          ) : (
            <FullCalendar 
            defaultView="dayGridMonth" 
            plugins={[dayGridPlugin, interactionPlugin]}
            editable={true}
            eventDrop={handleEventDrop}
            eventClick={handleEventClick}
            events={formatEvents}
        />
            )
        }
      </div>


 
    </CalendarStyled>
  );
};

export default BCCalendar;
