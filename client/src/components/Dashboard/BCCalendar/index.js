import React, {useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import { 
  requestGetApplicationByUserId, 
  requestGetUserApplicationHistory
} from "../../../redux/actions/Application";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import NewEventModal from "./events/NewEventModal/index.js";

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

    .control-block .btn-holder {
      margin: 20px;
    }

    .control-block .fa-plus {
      padding-right: 5px;
    }

    .control-block a {
      margin: 5px;
      width: 100%;
      color: #fff;
      background-color: #2cabe3;
      border-color: #2cabe3;
      box-shadow: 0 1px 0 rgb(255 255 255 / 15%);
      font-weight: 400;
      line-height: 1.5;
      text-align: center;
      text-decoration: none;
      vertical-align: middle;
      cursor: pointer;
      user-select: none;
      border: 1px solid transparent;
      padding: .375rem .75rem;
      font-size: .875rem;
      border-radius: 4px;
      transition: color .15s
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
  const [isAddEventModalShown,setIsAddEventModalShown ] = useState(false)

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

  const showModal = () => setIsAddEventModalShown(true);
  const hideModal = () => setIsAddEventModalShown(false);

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

   const handleDateClick = (info) => {
     console.log("date click: ", info);
     showModal();
    //if(window.confirm("Are you sure you want to create an event?")){
    //    console.log('change confirmed')
    //} else {
    //    console.log('change aborted')
    //}
}

  console.log('calendar auth',auth)
  return (
    <CalendarStyled>
      <NewEventModal show={isAddEventModalShown} handleClose={hideModal}> </NewEventModal>
      <div id="calendarControls" className="control-block"> 
        <h3>Schedule Activities</h3>

      <div className="btn-holder">
        <a href="#" data-bs-toggle="modal" data-bs-target="#add-new-event" 
          className="btn mt-3 btn-info d-block w-100 waves-effect waves-light">
            <FontAwesomeIcon icon={faPlus} />
            Add New Event
        </a> 
        </div>
        <div className="btn-holder">     
        <a href="#" data-bs-toggle="modal" data-bs-target="#add-new-event" 
          className="btn mt-3 btn-info d-block w-100 waves-effect waves-light">
            <FontAwesomeIcon icon={faPlus} />
            Add New Class
        </a> 
        </div>     
      </div>
      <div id="calendarContainer" className="calendar-wrapper">
        {
          loading.application ? (
            <Loading />
          ) : (
            <FullCalendar 
            headerToolbar={{left: 'prev,next,today', center: 'title', right: 'timeGridDay,timeGridWeek,dayGridMonth'}}
            defaultView="dayGridMonth" 
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            editable={true}
            eventDrop={handleEventDrop}
            eventClick={handleEventClick}
            events={formatEvents}
            dateClick={handleDateClick}
            allDaySlot={true}
            scrollTime = {'08:00:00'}
            axisFormat = {'HH:mm'}
            timeFormat = {{
                agenda: 'H:mm{ - h:mm}'
            }}
        />
            )
        }
      </div>


 
    </CalendarStyled>
  );
};

export default BCCalendar;
