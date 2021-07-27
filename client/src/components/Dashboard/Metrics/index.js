import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import MetricMenu from './components/Menu';
import Attendance from "./components/Attendance";
import ClassReport from "./components/ClassReport";
import Mentees from "./components/Mentees";
import Tests from "./components/Tests";
import Grades from "./components/Grades";
import Mentoring from "./components/Mentoring";
import VolunteerHours from "./components/VolunteerHours";

import { requestVendor } from '../../../redux/actions/Vendors';


const MetricStyled = styled.div`

  width: auto;
  max-width: 1920px;
  margin: auto;
  padding: 24px;

  .selected {
    background-color: #cdcdcd;
  }
  button {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
  #metrics-page {
    display: grid;
  }
  #metrics-page > div {
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }
  #metrics-page > div:nth-of-type(2) {
    margin-right: 0.5em;
  }

  @media (min-width: 600px) {
    #metrics-page {
      grid-template-columns: 25% 75%;
      grid-gap: 1%;
    }
  }
  @media (max-width: 840px) {
    padding: 0rem 1rem 2rem;
  }
  @media (min-width: 1500px) {
    #metrics-page > div:nth-of-type(2) {
      margin-right: 1em;
    }
  }
  #metrics-page-menu-wrapper,
  .groups {
    padding: 1em;
  }
  #metrics-page-menu-wrapper > div {
    padding: 1em;
    font-size: 1.2em;
    cursor: pointer;
  }
  #metrics-page-menu-wrapper > div.selected {
    background: #f26e21;
    color: white;
  }
  #metrics-page-menu-wrapper > div > span {
    margin-left: 1em;
  }

  #metrics-page .top-left {
    display: flex;
  }

  #metrics-page .top-left select {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 20px;
  }

  #metrics-page .top-right button {
    float: right;
  }

  .grid-2b {
    grid-template-columns: 62% 31%;
    gap: 6.66666%;
  }

`;



const Metrics = props => {
  const [selectedLabel, setSelectedLabel] = useState('attendance');
  const dispatch = useDispatch();
  const {
    auth,
    user,
    vendors
  } = useSelector(
    ({
      auth,
      user,
      vendors
    }) => {
      return {
        auth,
        user,
        vendors
      };
    }
  );

  useEffect(() => {
    if(auth) {
      dispatch(requestVendor(auth.user_id));
    }
    
  },[])

  // const sql_stat = "Select xyz form a, b";
  // rows = sql_run(sql_stat)

  const handleSelectedLabel = value => {
    setSelectedLabel(value);

  };


  console.log('Vendorzzz', vendors)
  return (
    <MetricStyled>
      <div id="metrics-page" >
        <MetricMenu handleSelectedLabel={handleSelectedLabel} selectedLabel={selectedLabel} />
        <div>
          {selectedLabel === 'attendance' && <Attendance auth={auth} />}
          {selectedLabel === 'mentees' && <Mentees auth={auth} vendors={vendors} />}
          {selectedLabel === 'classes' && <ClassReport auth={auth} />}
          {selectedLabel === 'tests' && <Tests auth={auth} />}
          {selectedLabel === 'grades' && <Grades auth={auth} />}
          {selectedLabel === 'mentoring' && <Mentoring auth={auth} />}
          {selectedLabel === 'volunteer_hours' && <VolunteerHours auth={auth} />}
        </div>
      </div>
    </MetricStyled>
  );
}

//Metrics.defaultProps = {
//  selectedLabel = 'attendance',
//}

export default Metrics;