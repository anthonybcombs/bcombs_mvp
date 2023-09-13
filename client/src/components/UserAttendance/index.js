import React, { useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import { useParams } from "@reach/router";
import { useDispatch } from "react-redux";
import { format, setSeconds, setMilliseconds } from 'date-fns';



import ErrorMessage from "../../helpers/ErrorMessage";
import { militaryToRegularTime } from '../../helpers/Date';

import { requestUserEventAttendance } from '../../redux/actions/Events';



import { s3BucketRootPath } from '../../constants/aws';

function getCurrentDateTimeString() {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd HH:mm:ss");
  return formattedDate.slice(0, -2) + "00";
}

function getCurrentTime() {
  const currentDate = new Date();
  const currentTime = format(currentDate, "HH:mm");
  return currentTime;
}



const AttendanceFormStyled = styled.form`
  display: flex;
  justify-content: center;
  padding: 14px !important;
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  input {
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
    outline: 0;
    margin-top: 1em;
    margin-bottom: 1em;
  }
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    padding-top: 1em;
    padding-bottom: 1em;
    border-radius: 10px !important;
  }
  button[type="button"] {
    padding: 10px;
    display: block;
    margin: 1em auto;
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    border: none;
    width: 100% !important;
  }

  button:disabled {
    background-color: #ccc; 
    color: #888; 
    cursor: not-allowed; 
  }

  svg {
    vertical-align: middle;
  }
  #socials {
    margin-top: 2em !important;
  }
  #socials button {
    padding: 1em;
    border-radius: 0 !important;
    margin: 5px;
  }
  #facebook {
    background-color: ${({ theme }) => theme.button.backgroundColor.secondary};
  }
  #google {
    background-color: ${({ theme }) => theme.button.backgroundColor.error};
  }
  #authOptions p {
    font-weight: bold;
    text-align: center;
    padding: 0;
    margin-top: 1em;
    font-size: ${({ theme }) => theme.p.fontSize} !important;
  }
  #authOptions p a {
    color: ${({ theme }) => theme.anchor.textColor.primary};
    font-size: ${({ theme }) => theme.anchor.fontSize} !important;
    text-decoration: none;
  }
  #socials > * {
    width: initial;
  }
  p.error {
    text-align: left !important;
  }
  p.error-size {
    font-size: 14px !important;
  }
  @media (min-width: 600px) {
    .grid {
      grid-template-columns: 50% 50%;
      grid-gap: 1%;
    }
    #authOptions p:first-child {
      text-align: left;
    }
    #authOptions p:last-child {
      text-align: right;
    }
    button[type="submit"] {
      width: 300px;
    }
  }
  #g-recaptcha {
    margin-top: 3em;
  }

  .eventInfo {
    display: flex;
    flex-direction: row;
  }

  @media (max-width: 769px) {
    .eventInfo {
      display: flex;
      flex-direction: column !important;
    }
  }
`;

// ${process.env.API_HOST}
const getEventById = async eventId => {
  const response = await fetch(`${process.env.API_HOST}/api/bccalendar/activities/${eventId}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });
  return response.json();
}

const getCurrentUserAndAttendance = async data => {
  const response = await fetch(`${process.env.API_HOST}/api/child/attendance/search`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json();
}

export default function UserAttendance(props) {
  const { event_id } = useParams();
  const [event, setEvent] = useState(null);
  const [currentChild, setCurrentChild] = useState({
    firstname: "",
    lastname: "",
    childId: "",
  });

  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [currentChildDetails, setCurrentChildDetails] = useState(null);
  const [isFindingUser, setIsFindingUser] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');

  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);
  const { register, handleSubmit, errors, setValue, reset } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });



  useEffect(() => {
    const triggerApi = async () => {
      try {
        const response = await getEventById(event_id);
        setEvent(response?.data);
      }
      catch (err) {
        console.log('Trigger API Err', err)
      }
    };

    triggerApi();
  }, [event_id]);

  const handleInputChange = (id, value) => {
    setCurrentChild({
      ...currentChild,
      [id]: value
    });
  };

  const handleFindUser = async () => {
    try {
      setUserMessage('');
      setCurrentAttendance({});
      setIsFindingUser(true);
      const response = await getCurrentUserAndAttendance({
        ...currentChild,
        eventId: event_id,
        attendanceType: event?.attendance_type
      });

      if (response?.child) {
        setCurrentAttendance(response?.attendance);
        setCurrentChildDetails(response?.child);

      }
      else {
        setUserMessage(`User Does Not Exist`)
      }

    } catch (e) {
      console.log('handleFindUser e', e)
    }
    finally {
      setIsFindingUser(false);

      setTimeout(() => {
        setUserMessage('');
      }, 5000)
    }
  }

  const handleCheckInAndOut = type => () => {
    let fieldName = 'attendance_start_time';

    if (type === 'out') {
      fieldName = 'attendance_end_time'
    }

    if (currentChildDetails && event) {
      const currentTime = getCurrentTime();
      dispatch(requestUserEventAttendance({
        child_id: currentChildDetails.ch_id,
        event_id: event_id,
        attendance_date: event?.start,
        attendance_start_time: currentAttendance?.attendance_start_time,
        attendance_end_time: currentAttendance?.attendance_end_time,
        attendance_type: event?.attendance_type,
        [fieldName]: currentTime
      }));

      setAttendanceMessage(`Your attendance has been recorded successfully!`)
      setCurrentAttendance({
        ...currentAttendance,
        attendance_start_time: currentAttendance?.attendance_start_time,
        attendance_end_time: currentAttendance?.attendance_end_time,
        [fieldName]: currentTime
      });

      setTimeout(() => {
        setAttendanceMessage('');
      }, 5000);
    }

  }
  return (
    <AttendanceFormStyled
      theme={theme}
      data-testid="event-attendance-form"
      method="POST">

      <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', width: 500 }}>
        <div style={{ padding: 24 }} >


          {event && <div className="eventInfo">

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={`${s3BucketRootPath}/${event.qr_code_url}`} style={{ width: 150, height: 150 }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 18 }}><b>{event?.title}</b></div>
              <div style={{ marginTop: 12 }}>
                <div><b>Date</b></div>
                <div>{format(new Date(event?.start), "MMM dd, yyyy hh:mm a")}</div>
              </div>
              {event?.location && <div style={{ marginTop: 12 }}>
                <div><b>Location</b></div>
                <div>{event?.location}</div>
              </div>}
              {event?.description && <div style={{ marginTop: 12 }}>
                <div><b>Description</b></div>
                <div>{event?.description}</div>
              </div>}

            </div>
          </div>}


        </div>
        {event && <div style={{ padding: 24 }}>
          <div>
            <div style={style.label}>Child ID</div>
            <input
              type="text"
              value={currentChild?.childId}
              id="childId"
              name="childId"
              data-testid="attendance-input-childId"
              placeholder=""
              onChange={({ target }) => {
                handleInputChange("childId", target.value);
              }}
              ref={register({ required: true })}
            />
          </div>
          <div>
            <div style={style.label}>Firstname</div>
            <input
              type="text"
              value={currentChild?.firstname}
              id="firstname"
              name="firstname"
              data-testid="attendance-input-firstname"
              placeholder=""
              onChange={({ target }) => {
                handleInputChange("firstname", target.value);
              }}
              ref={register({ required: true })}
            />
          </div>
          <div>
            <div style={style.label}>Lastname</div>
            <input
              type="text"
              value={currentChild?.lastname}
              id="lastname"
              name="lastname"
              data-testid="attendance-input-firstname"
              placeholder=""
              onChange={({ target }) => {
                handleInputChange("lastname", target.value);
              }}
              ref={register({ required: true })}
            />
          </div>

          <div style={style.danger}>
            {userMessage}
          </div>

          <button disabled={isFindingUser} onClick={handleFindUser} type="button" >
            {isFindingUser ? 'Please Wait...' : 'Find User'}
          </button>


          <div style={style.success}>
            {attendanceMessage}
          </div>

          <div>
            <div style={style.label}>Time In</div>
            <input
              // disabled={true}
              type="text"
              value={currentAttendance?.attendance_start_time ? militaryToRegularTime(currentAttendance.attendance_start_time) : null}
              id="Start Time"
              name="start_time"
              placeholder="Start Time"
            />
          </div>
          <div>
            <div style={style.label}>Time Out</div>
            <input
              // disabled={true}
              type="text"
              value={currentAttendance?.attendance_end_time ? militaryToRegularTime(currentAttendance.attendance_end_time) : null}
              id="End Time"
              name="end_time"
              placeholder="End Time"

            />
          </div>


          <ErrorMessage
            className="error-size"
            field={errors.childId}
            errorType="required"
            message="Child ID is required."
          />
          <div style={{ display: 'flex', flexDirection: 'row' }}>

            <button
              style={{ margin: 4 }}
              disabled={!currentChildDetails || currentAttendance?.attendance_start_time}
              onClick={handleCheckInAndOut('in')}
              type="button" >
              Time In
            </button>
            <button
              style={{ margin: 4 }}
              disabled={!currentChildDetails || (!currentAttendance?.attendance_start_time ? true : false) || currentAttendance?.attendance_end_time}
              onClick={handleCheckInAndOut('out')}
              type="button">
              Time Out
            </button>
          </div>
        </div>}

      </div>


    </AttendanceFormStyled>
  );
}


const style = {
  danger: {
    color: 'red',
    marginTop: 12,
    marginBottom: 12
  },
  label: {
    fontWeight: 'bold'
  },
  success: {
    color: 'green',
    marginTop: 12,
    marginBottom: 12
  }
}
