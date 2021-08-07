import React, { useRef, useState, useEffect, useReducer } from "react";
import '../BCCalendar/BCCalendar.css';
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { requestVendor } from "../../../redux/actions/Vendors";
import BC_CalendarActivities from "../BCCalendar/BC_CalendarActivities";
import BC_CalendarActivity from "../BCCalendar/activity/BC_CalendarActivity";
import ActivityDisplaylModal from "./ActivityDisplayModal/index.js";

import * as Icon from "react-icons/fi";
import Checkbox from "react-custom-checkbox";

const CalendarStyled = styled.div`
    `;

import Loading from "../../../helpers/Loading.js";


const BCDisplayCalendar = props => {
  const dispatch = useDispatch();


  const { admins, auth, user, vendors } = useSelector(
    ({
      admins,
      auth,
      user,
      vendors
    }) => {
      return {
        admins,
        auth,
        user,
        vendors
      };
    }
  );

  useEffect(() => {
    if (auth) {
      dispatch(requestVendor(auth.user_id, false));
    }
  }, [])

  const [myEvents, setMyEvents] = useState([]);

  const [classes, setClasses] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [vendorId, setVendorId] = useState();
  const [filters, setFilters] = useState([]);

  const [calendarActivities, setCalendarActivies] = useState();

  const [isLoading, setIsLoading] = useState(true)
  const [isAddEventModalShown, setIsActivityDetailsModalShown] = useState(false)
  const [searchTerm, setSearchTerm] = React.useState("");
  
  //const componentRef = useRef();
  console.log('vendorszxczxc',vendors)
  useEffect(() => {
    console.log('activityData: ', activityData)
  }, [activityData]);

  const showModal = () => setIsActivityDetailsModalShown(true);
  const hideModal = () => setIsActivityDetailsModalShown(false);

  useEffect(() => {
    console.log('AUTHHHH MY APPLCIATION - vendors loaded', auth)
    if (auth.user_id) {
      //dispatch(requestGetApplicationByUserId(auth.user_id))
    }
    let localVendorId = 0;
    if (vendors && vendors.length) {
      localVendorId = vendors[0].id2;
    }
    console.log("vendorId", localVendorId);
    if (localVendorId) {
      setVendorId(localVendorId);
      BC_CalendarActivities.LoadActivities(localVendorId, auth, handleCalendarActiviesReturned);
    }
  }, [vendors]);

  const handleCalendarActiviesReturned = (calendarActivities) => {
    setCalendarActivies(calendarActivities);
    setIsLoading(false);
  }

  useEffect(() => {
    if (calendarActivities) {
      setClasses(calendarActivities.classList);
      setFilters(calendarActivities.filters);
    }
  }, [calendarActivities])

  useEffect(() => {
    if (calendarActivities) {
      let activityList = calendarActivities.getFilteredActivityList();
      setMyEvents(activityList);
    }
  }, [filters])

  useEffect(() => {
    if (calendarActivities) {
        calendarActivities.setSearchTerm(searchTerm);
        let activityList = calendarActivities.getFilteredActivityList();
        setMyEvents(activityList);
    }
  }, [searchTerm])

  const handleClickOnActivity = ({ event }) => {
    console.log('click info: ', event);
    let activityForEdit = new BC_CalendarActivity();
    activityForEdit.setToExistingActivity(event);
    setActivityData(activityForEdit);
    showModal();
  }

  const handleFilterChange = (value, key) => {
    console.log("handleFilterChange: ", value, key);
    calendarActivities.adjustFilters(value, key);
    setFilters(calendarActivities.filters);
  }

  const handleSearchTermChange = event => {
    setSearchTerm(event.target.value);
  };

  return (
    <CalendarStyled className="bc-calendar-wrapper">
      <ActivityDisplaylModal show={isAddEventModalShown}
        visibleClasses={classes}
        activityData={activityData}
        handleClose={hideModal}
        >
      </ActivityDisplaylModal>

      <div id="calendarControls" className="control-block">
        <h3>My Calandars</h3>

        {isLoading ? (
            <div />
            ) : (
                <div>
                 <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
              </div>
        )
        }
          {isLoading ? (
            <Loading />
            ) : (

                filters.map((elem) => 
                <div className="btn-holder" key={elem.key}>
                    <Checkbox checked={elem.isChecked} label={elem.name} name={elem.key}
                    icon={<Icon.FiCheck color={elem.color} size={14} />}
                    borderColor={elem.color}
                    onChange={(value) => handleFilterChange(value, elem.key)}
                    />
                </div>
            )) }

      </div>
      <div id="calendarContainer" className="calendar-wrapper">
        {
          isLoading ? (
            <Loading />
          ) : (
            <FullCalendar
              headerToolbar={{ left: 'prev,next,today', center: 'title', right: 'timeGridDay,timeGridWeek,dayGridMonth' }}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              editable={false}
              eventClick={handleClickOnActivity}
              events={myEvents}
              allDaySlot={true}
              scrollTime={'08:00:00'}
            />
          )
        }
      </div>

    </CalendarStyled>
  );
};

export default BCDisplayCalendar;
