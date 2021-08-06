import React, { useRef, useState, useEffect, useReducer } from "react";
import '../BCCalendar/BCCalendar.css';
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { requestVendor } from "../../../redux/actions/Vendors";
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

  const [unfilteredEvents, setUnfilteredEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);

  const [classes, setClasses] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [vendorId, setVendorId] = useState();
  const [filters, setFilters] = useState([]);

  //const [defaultApplication,setDefaultApplication] = useState([])
  const [filteredData, setFilteredData] = useState([]);

  const [isLoading, setIsLoading] = useState(true)
  const [isAddEventModalShown, setIsActivityDetailsModalShown] = useState(false)

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
      triggerApiCallGetActivities(localVendorId, auth);
    }
  }, [vendors]);

  useEffect(() => {
    let activityList = [];
    for (let i=0; i<unfilteredEvents.length; i++) {
      let event = unfilteredEvents[i];
      if (!event.group_key) { //only events added this session don't have key - they shouldn't be filtered
        activityList.push(event);
        continue;
      }
      let bSkipEvent = false;
      for (let j=0; j<filters.length; j++) {
        if (filters[j].key == event.group_key) {
          if (!filters[j].isChecked) {
            bSkipEvent = true;
          }
          break;
        }
      }
      if (!bSkipEvent) {
        activityList.push(event);
      }
    }
    setMyEvents(activityList);

  }, [filters])

  const triggerApiCallGetActivities = async (vendorId, auth) => {
    try {
      console.log('apiCall get calendar activities: vendor ', vendorId)
      if (!vendorId) {
        return;
      }
      const res = await BC_CalendarActivity.GetCalendarActivitiesFromDB(vendorId, auth.user_id);
      console.log('apiCall get calendar activities ', res)
      let classList = []
      if (res && res.app_groups && res.app_groups.length > 0) {
        for (let i = 0; i < res.app_groups.length; i++) {
          const classData = res.app_groups[i];
          classList[classData.id] = classData;
        }
        setClasses(classList);
      }
      if (res && res.activities && res.activities.length > 0) {
        let activityList = []
        for (let i = 0; i < res.activities.length; i++) {
          const row = res.activities[i];
          let activityFromDB = new BC_CalendarActivity();
          activityFromDB.loadFromDBRow(row, classList);
          activityList.push(activityFromDB);
        }
        setUnfilteredEvents(activityList);
        //console.log("--------activityList: ", activityList);
      }
      if (res && res.filter_groups && res.filter_groups.length > 0) {
        setFilters(res.filter_groups);
      }
    } catch (err) {
      console.log('Error', err)
    }
    setIsLoading(false);
  };


  const handleClickOnActivity = ({ event }) => {
    console.log('click info: ', event);
    let activityForEdit = new BC_CalendarActivity();
    activityForEdit.setToExistingActivity(event);
    setActivityData(activityForEdit);
    showModal();
  }

  const handleFilterChange = (value, key) => {
    console.log("handleFilterChange: ", value, key);
    let adjustedFilters = [];
    for (let i=0; i< filters.length; i++) {
      let filter = filters[i];
      if (filter.key == key ) {
        filter.isChecked = value;
      }
      adjustedFilters.push(filter);
    }
    setFilters(adjustedFilters);
  }

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
