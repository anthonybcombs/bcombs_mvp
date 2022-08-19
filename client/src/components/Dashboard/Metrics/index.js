import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import MetricMenu from './components/Menu';
import Attendance from "./components/Attendance";
import ClassAttendance from "./components/ClassAttendance";
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
    grid-template-columns: 77% 16%;
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
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    if (auth) {
      dispatch(requestVendor(auth.user_id, false));
    }

  }, []);

  // vendors[0].id2

  useEffect(() => {
    if (vendors && Array.isArray(vendors)) {
      //const defaultVendor = vendors.find(item => item.is_lot);
      const defaultVendor = vendors.find(item => item.is_default);

      if(defaultVendor) {
        setSelectedVendor(defaultVendor);
      }
      else {
        setSelectedVendor(defaultVendor || vendors[0]);
      }
   
    }
  }, [vendors])

  // const sql_stat = "Select xyz form a, b";
  // rows = sql_run(sql_stat)

  const handleSelectedLabel = value => {
    setSelectedLabel(value);

  };


  const lotVendorId2s = Array.isArray(vendors) && vendors.filter(item => item.name.includes('LOT')).map(item => item.id2)
  /// const lotVendors =
  console.log('selectedVendor', selectedVendor)
  return (
    <MetricStyled>
      <div id="metrics-page" >
        <MetricMenu handleSelectedLabel={handleSelectedLabel} selectedLabel={selectedLabel} />
        <div>
          <div>
            <select
              ///    className="custom-default-select"
              style={{
                "marginLeft": "20px",
                "fontSize": "1.5em",
                "borderRadius": "0",
                "cursor": "pointer",
                "width": "60%",
                "display": "block",
                "background": "transparent",
                "border": "0",
                "paddingTop": "12px",
                "lineHeight": "1",
                "color": "#000000"
              }}
              onChange={({ target }) => {
                if (target.value) {
                  const value = parseInt(target.value);
                  const currentVendor = vendors.find(item => {
                    return item.id2 === value
                  })
                  if (currentVendor && auth) {
                    setSelectedVendor({
                      ...currentVendor,
                      is_lot:!currentVendor.is_lot ?  auth.nickname === 'lot' : currentVendor.is_lot
                    });
                  }

                }


              }}
              value={selectedVendor?.id2}
            >
              {Array.isArray(vendors) && vendors.map(vendor => (
                <option key={vendor.id2} value={vendor.id2}>
                  {vendor.name}
                </option>
              ))}
            </select>


          </div>
          {selectedLabel === 'attendance' && <Attendance auth={auth} selectedVendor={selectedVendor} vendors={vendors} lotVendorId2s={lotVendorId2s} />}
          {selectedLabel === 'class_attendance' && <ClassAttendance auth={auth} selectedVendor={selectedVendor} vendors={vendors} lotVendorId2s={lotVendorId2s} />}
          {selectedLabel === 'mentees' && <Mentees auth={auth} selectedVendor={selectedVendor} vendors={vendors} lotVendorId2s={lotVendorId2s} />}
          {selectedLabel === 'classes' && <ClassReport auth={auth} selectedVendor={selectedVendor} vendors={vendors} />}
          {selectedLabel === 'tests' && <Tests auth={auth} selectedVendor={selectedVendor} vendors={vendors} lotVendorId2s={lotVendorId2s} />}
          {selectedLabel === 'grades' && <Grades auth={auth} selectedVendor={selectedVendor} vendors={vendors} lotVendorId2s={lotVendorId2s} />}
          {selectedLabel === 'mentoring' && <Mentoring auth={auth} selectedVendor={selectedVendor} vendors={vendors} lotVendorId2s={lotVendorId2s} />}
          {selectedLabel === 'volunteer_hours' && <VolunteerHours auth={auth} selectedVendor={selectedVendor} vendors={vendors} lotVendorId2s={lotVendorId2s} />}
        </div>
      </div>
    </MetricStyled>
  );
}

//Metrics.defaultProps = {
//  selectedLabel = 'attendance',
//}

export default Metrics;