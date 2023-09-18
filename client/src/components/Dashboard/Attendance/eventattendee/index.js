import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from "@reach/router";
import { useDispatch, useSelector } from 'react-redux';
import styled from "styled-components";
import { parse } from 'query-string';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'

import { requestAttendanceByEvent, requestUpdateAttendance } from '../../../../redux/actions/Attendance';


import ProfileImg from '../../../../images/defaultprofile.png';

import ImagePreviewModal from '../modal/imagePreview';


import { getNameFromCustomForm } from '../../Grades/utils'

import { s3BucketRootPath } from '../../../../constants/aws';

import Confirmation from "../../../../helpers/Confirmation";


import { militaryToRegularTime } from '../../../../helpers/Date';
import DisplayEventModal from '../../BCDisplayCalendar/ActivityDisplayModal';

const EventAttendeeStyled = styled.div`

    padding: 12px;

    .circle-icon {
		border-radius: 50%;
		width: 15px;
		height: 15px;
		margin: 0 auto;
	}

    .field {
		// padding: 5px !important;
		// margin: 5px !important;
	}
	.field-input:placeholder-shown + .field-label {
		max-width: calc(100% - 30%) !important;
	}

	.field-label,
	.field-input {
		transition: all 0.2s;
		touch-action: manipulation;
	}

	.field-input {
		font-size: 18px;
		border: 0;
		border-bottom: 2px solid #ccc;
		font-family: inherit;
		-webkit-appearance: none;
		-moz-appearance: none;
		border-radius: 0;
		padding: 5px;
		cursor: text;
		line-height: 1.8;

		padding: 5px 0;
		width: 100%;
		display: block;
		text-indent: 5px;
	}
	.form-group .form-control {
		font-size: 18px;
		border: 0;
		border-bottom: 2px solid #ccc;
		-webkit-appearance: none;
		-moz-appearance: none;
		border-radius: 0;
		padding: 10px;
	}

	.field {
		display: flex;
		flex-flow: column-reverse;
		margin-bottom: 1em;
	}

	.field-label,
	.field-input {
		transition: all 0.2s;
		touch-action: manipulation;
	}

	.field-input {
		font-size: 18px;
		border: 0;
		border-bottom: 2px solid #ccc;
		font-family: inherit;
		-webkit-appearance: none;
		-moz-appearance: none;
		border-radius: 0;
		padding: 5px;
		cursor: text;
		line-height: 1.8;

		padding: 5px 0;
		width: 100%;
		display: block;
		text-indent: 5px;
		margin-top: 8px;
		margin-bottom: -5px;
	}

	.field-label {
		font-size: 14px;
		color: #4b525a;
	}

	.field-input:placeholder-shown + .field-label {
		overflow: hidden;
		transform-origin: left bottom;
		transform: translate(0, 2.125rem) scale(1.4);
	}

	.field-input::placeholder {
		opacity: 0;
		transition: inherit;
		font-size: 12px;
	}

	.field-input:focus::placeholder {
		opacity: 1;
	}

	.field-input:focus + .field-label {
		transform: translate(0, 0) scale(1);
		cursor: pointer;
		// margin-bottom: 5px;
		font-weight: bold;
	}


    .gridView .block .extra_activitybox {
		text-align: center;
	}

	.gridView {
		margin-top: 3rem;
        padding: 12px !important;
		display: grid;
		grid-gap: 18px;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        background-color: white;
	}

	.gridView .block {
		width: auto;
		border: 1px solid #ccc;
		box-shadow: 0 0 10px #ccc;
		border-bottom: 4px solid #f5812f;
	}

	.gridView .block .extra_activitybox .img-container {
		padding: 1rem;
	}
	.gridView .block .extra_activitybox .img-container img {
		border-radius: 50%;
		height: 100px;
		width: 100px;
		box-shadow: 0 0 5px #716464;
	}
	.gridView .block .extra_activitybox .attendance-name {
		padding-bottom: 1rem;
	}
	.gridView .block .extra_activitybox .attendance-name span {
		color: #000;
		font-weight: 600;
		text-decoration: none;
		transition: 0.15s ease-in-out;
	}

	.gridView .block .extra_activitybox .attendance-action {
		display: flex;
		justify-content: space-around;
		border-top: 1px solid #ddd;
		border-bottom: 1px solid #ddd;
	}
	.gridView .block .extra_activitybox .attendance-action > div {
		flex: 1;
		padding: 1rem 0;
	}
	.gridView .block .extra_activitybox .attendance-action > div:not(:last-child) {
		border-right: 1px solid #ddd;
	}
	.gridView .block .extra_activitybox .attendance-hours {
		display: flex;
		padding: 1rem;
		border-bottom: 1px solid #ddd;
	}
	.gridView .block .extra_activitybox .attendance-hours .field {
		padding: 0 0.5rem;
	}
	.gridView .block .extra_activitybox .attendance-hours .field > input {
		text-align: center;
	}
	.gridView .block .extra_activitybox .attendance-hours .field > label {
		font-size: 12px;
	}

	.gridView .block .extra_activitybox .attendance-invitation {
		padding: 1rem;
		color: gray;
		font-size: 14px;
	}
	.gridView .block .extra_activitybox .attendance-invitation span {
		color: #000;
		font-weight: 600;
	}

    .actionBtn {
		margin-top: 1.5rem !important;
	}
	.actionBtn button {
		border: none;
		color: #f5812f;
		font-size: 18px;
		border-radius: 3px;
		background: rgb(245 129 47 / 25%);
		transition: 0.15s ease-in-out;
	}
	.actionBtn button:hover {
		color: #fff;
		background: #e87828;
	}


   
     .timeOutBtn {
        color: ${({ theme }) => theme.button.textColor.primary};
        font-size: ${({ theme }) => theme.button.fontSize} !important;
        border: none;
        box-shadow: 0px 3px 6px #908e8e;
        padding-top: 1em;
        padding-bottom: 1em;
        border-radius: 10px !important;

        padding: 10px;
        display: block;
        margin: 1em auto;
        background-color: red !important;
        border: none;
        width: 100% !important;
    }


`;

function getCurrentTime() {
    const currentDate = new Date();
    const currentTime = format(currentDate, "HH:mm");
    return currentTime;
}



const getEventById = async eventId => {
    const response = await fetch(`${process.env.API_HOST}/api/event/${eventId}`, {
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

const EventAttendee = props => {
    const dispatch = useDispatch();

    const { attendance } = useSelector(state => {
        return {
            attendance: state.attendance
        }
    });

    const location = useLocation();
    const { event_id } = useParams();
    const queryParams = parse(location.search);

    const [currentAttendance, setCurrentAttendance] = useState([]);
    // const [defaultAttendance, setDefaultAttendance] = useState([]);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const [markedAsAbsent, setMarkedAsAbsent] = useState(false);

    const [isImagePreviewModalVisible, setIsImagePreviewModalVisible] = useState(false);
    const [currentQrCodeUrl, setCurrentQrCodeUrl] = useState('');


    useEffect(() => {
        if (queryParams?.vendorId) {
            getCurrentEvent(event_id);
            dispatch(requestAttendanceByEvent({
                eventId: event_id,
                attendanceType: queryParams?.type
            }));
        }


    }, []);




    useEffect(() => {
        if (attendance.currentEventAttendance.attendance) {
            setCurrentAttendance(attendance.currentEventAttendance.attendance);
        }
    }, [attendance.currentEventAttendance.attendance]);


    const getCurrentEvent = async id => {
        try {
            const response = await getEventById(id);
            setCurrentEvent(response?.event);
        } catch (e) {
            console.log('getCurrentEvent error', e)
        }
    }


    const handleAttendance = (payload, attendanceType = '') => {


        let currentIndex = currentAttendance.findIndex(app => app.child_id === payload.child_id);
        let updatedAttendance = [...currentAttendance];
        if (currentIndex > -1) {
            updatedAttendance[currentIndex] = {
                ...updatedAttendance[currentIndex],
                excused: null,
                attendance_status: attendanceType
            }

        }
        setCurrentAttendance([...(updatedAttendance || [])]);
    };

    const handleHours = (payload, hours, type = 'volunteer_hours') => {
        let updatedAttendance = [...(currentAttendance || [])];
        let currentIndex = updatedAttendance.findIndex(app => app.child_id === payload.child_id);

        if (currentIndex > -1) {
            updatedAttendance[currentIndex] = {
                ...updatedAttendance[currentIndex],
                [type]: hours,
            };
            setCurrentAttendance(updatedAttendance);
        }

    };


    const handleCheckOut = payload => {
        let updatedAttendance = [...(currentAttendance || [])];
        let currentIndex = updatedAttendance.findIndex(app => app.child_id === payload.child_id);

        if (currentIndex > -1) {
            updatedAttendance[currentIndex] = {
                ...updatedAttendance[currentIndex],
                attendance_end_time: getCurrentTime(),
            };
            setCurrentAttendance(updatedAttendance);
        }

    };

    const handleCheckOutAll = () => {

        let updatedAttendance = [...(currentAttendance || [])];

        updatedAttendance = updatedAttendance.map(att => {
            if (!att.attendance_end_time) {
                return {
                    ...att,
                    attendance_end_time: getCurrentTime(),
                }
            }

            return {
                ...att,

            }
        });

        setCurrentAttendance(updatedAttendance);

        setIsConfirmationVisible(true);
    }

    const handleSubmit = () => {
        setIsConfirmationVisible(true);
    };

    const handleUpdateAttendance = () => {
        const payload = {
            attendance_list: currentAttendance.map(att => {
                return {
                    app_group_id: att.app_group_id,

                    attendance_start_time: att.attendance_start_time,
                    attendance_end_time: att.attendance_end_time,
                    attendance_status: !att.attendance_status ? markedAsAbsent ? 'Absent' : '' : att.attendance_status,
                    mentoring_hours: parseInt(att.mentoring_hours),
                    volunteer_hours: parseInt(att.volunteer_hours),
                    child_id: att.child_id

                }
            }),
            app_group_id: currentAttendance[0]?.app_group_id,
            attendance_type: currentAttendance[0]?.attendance_type,
            attendance_date: `${format(new Date(parseInt(currentAttendance[0]?.attendance_date)), 'yyyy-MM-dd')} 00:00:00`,
            event_name: currentAttendance[0].event_name,
            location: currentAttendance[0].location,
            description: currentAttendance[0].description,
            vendorId2: parseInt(queryParams?.vendorId || 0),
            create_event: false,
            event_id
        };

        console.log('Attendance Payload', payload)
        dispatch(requestUpdateAttendance(payload));

        setTimeout(() => {
            dispatch(requestAttendanceByEvent({
                eventId: event_id,
                attendanceType: queryParams?.type
            }));
        }, 1500);
    }



    console.log('currentAttendance', currentAttendance)

    return <EventAttendeeStyled>
        <div style={{ paddingTop: 12, paddingBottom: 12 }}>
            <Link to={`/dashboard/attendance/events?vendorId=${queryParams?.vendorId}`}>
                <FontAwesomeIcon
                    className='save-icon'
                    icon={faAngleLeft}
                />
                {` `}Back
            </Link>
        </div>
        {currentEvent ? <div className="eventDetails" style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: 'white',
            padding: 12

        }}>

            <div>
                <b>Title</b> {currentEvent?.title}
            </div>
            <div>
                <b>Description</b> {currentEvent?.description}
            </div>

            <div>
                <b>Date</b> {format(new Date(currentEvent?.start), 'yyyy-MM-dd')}
            </div>

            <div>
                <b>Start Time</b> {format(new Date(currentEvent?.start), 'hh:mm a')}
            </div>
            <div>
                <b>End Time</b> {format(new Date(currentEvent?.end), 'hh:mm a')}
            </div>
            <div>
                <img src={`${s3BucketRootPath}/${currentEvent.qr_code_url}`} style={{ width: 100, height: 100 }} />

                <div>
                    <span
                        style={style.preview}
                        onClick={() => {
                            // printImage(qrCodeUrl,event.title)
                            setCurrentQrCodeUrl(`${s3BucketRootPath}/${currentEvent.qr_code_url}`);
                            setIsImagePreviewModalVisible(!isImagePreviewModalVisible)
                        }}
                        src={`${s3BucketRootPath}/${currentEvent.qr_code_url}`}
                    >Preview</span>
                </div>
            </div>
        </div> : <span />}

        <div className="attendee">
            <div className="gridView">
                {currentAttendance.map(app => {
                    const currentChild = app.form_contents ? getNameFromCustomForm(app.form_contents) : {
                        lastname: app?.lastname,
                        firstname: app?.firstname
                    }
                    let profile = app?.child?.image || ''
                    if (app.form_contents) {
                        const { formData = [] } = typeof app.form_contents === 'string' ? JSON.parse(app.form_contents) : app.form_contents
                        const { fields = [] } = formData.find(e => e.fields[0].tag === 'profileImage') || {}
                        if (fields.length) {
                            const { value } = fields[0]
                            const { url } = value ? JSON.parse(value) : {}
                            profile = url?.includes('file/') ? 'https://bcombs.s3.amazonaws.com/' + url : url;
                        }
                    } else if (!app.form_contents && profile) {
                        profile = profile?.includes('file/') ? 'https://bcombs.s3.amazonaws.com/' + profile : profile;
                    }
                    return (
                        <div className="block">
                            <div className="extra_activitybox">
                                <div className="img-container" style={{ margin: '0 auto' }}>
                                    <img src={/* profile || */ ProfileImg} />
                                </div>

                                <div className="attendance-name">
                                    {/* <a href={'/dashboard/menteeprofile/' + app.id}> */}
                                    <span>
                                        {/* {app.child
															? app.child?.firstname + ' ' + app.child?.lastname
															: app.form_contents?.formData[0]?.fields[0]?.value} */}
                                        {`${currentChild.firstname} ${currentChild.lastname}`}
                                    </span>
                                    {/* </a> */}

                                    <div>
                                        {app?.new_childId}
                                    </div>
                                </div>


                                <div className="attendance-action">
                                    <div>
                                        <div
                                            onClick={() => {
                                                console.log('handleAttendance', app)
                                                handleAttendance(app, 'Present');
                                            }}
                                            style={style.attendanceAction}>
                                            <div
                                                className="circle-icon"
                                                style={{
                                                    ...style.circleIcon,
                                                    backgroundColor: app.attendance_status === 'Present' ? '#14e414' : 'gray',
                                                }}
                                            />
                                            Present
                                        </div>
                                    </div>

                                    <div>
                                        <div
                                            onClick={() => {
                                                handleAttendance(app, 'Absent');
                                            }}
                                            style={style.attendanceAction}>
                                            <div
                                                className="circle-icon"
                                                style={{
                                                    ...style.circleIcon,
                                                    backgroundColor: app.attendance_status === 'Absent' ? 'red' : 'gray',
                                                }}
                                            />
                                            Absent
                                        </div>

                                        {/* <div style={style.attendanceSubAction}>
                                            <div
                                                className="circle-icon"
                                                style={{
                                                    ...style.miniCircleIcon,
                                                    backgroundColor: app.excused === 'absent' ? 'red' : 'gray',
                                                }}
                                            />
                                            {app.excused === 'absent' ? <div className="exclude-icon"></div> : <span />}
                                            {'    '}Excused {'  '}
                                        </div> */}
                                    </div>

                                    <div>
                                        <div
                                            onClick={() => {
                                                handleAttendance(app, 'Tardy');
                                            }}
                                            style={style.attendanceAction}>
                                            <div
                                                className="circle-icon"
                                                style={{
                                                    ...style.circleIcon,
                                                    backgroundColor: app.attendance_status === 'Tardy' ? '#f26e21' : 'gray',
                                                }}
                                            />
                                            Tardy
                                        </div>

                                        {/* <div style={style.attendanceSubAction}>
                                            <div
                                                className="circle-icon"
                                                style={{
                                                    ...style.miniCircleIcon,
                                                    backgroundColor: app.excused === 'tardy' ? '#f26e21' : 'gray',
                                                }}
                                            />
                                            {app.excused === 'tardy' ? <div className="exclude-icon"></div> : <span />}
                                            {'    '}Excused {'  '}
                                        </div> */}
                                    </div>
                                </div>

                                <div className="attendance-hours">
                                    <div className="field">
                                        <input
                                            type="number"
                                            onChange={e => {
                                                handleHours(app, e.target.value, 'volunteer_hours');
                                            }}
                                            name={'volunteer_hrs'}
                                            className={'field-input'}
                                            placeholder="Volunteer Hours"
                                            value={app?.volunteer_hours || 0}
                                        />
                                        <label className="field-label" for={`volunteer_hrs`}>
                                            Volunteer Hours
                                        </label>
                                    </div>
                                    <div className="field">
                                        <input
                                            type="number"
                                            onChange={e => {
                                                handleHours(app, e.target.value, 'mentoring_hours');
                                            }}
                                            name={'mentoring_hrs'}
                                            className={'field-input'}
                                            placeholder="Mentoring Hours"
                                            value={app?.mentoring_hours || 0}
                                        />
                                        <label className="field-label" for={`mentoring_hrs`}>
                                            Mentoring Hours
                                        </label>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', }}>
                                    <div style={{ padding: 12 }}>
                                        <div>
                                            <b>Time In</b>
                                        </div>
                                        <div style={{ fontSize: 14, fontStyle: 'italic' }}>
                                            {app.attendance_start_time ? militaryToRegularTime(app.attendance_start_time) : 'Not Clocked In'}
                                        </div>
                                    </div>
                                    <div style={{ padding: 12 }}>
                                        <div>
                                            <b>Time Out</b>
                                        </div>
                                        <div style={{ fontSize: 14, fontStyle: 'italic' }}>
                                            {app.attendance_end_time ? militaryToRegularTime(app.attendance_end_time) : 'Not Clocked Out'}
                                        </div>
                                    </div>
                                </div>

                                <div className="field" style={{ padding: 12 }}>
                                    <button
                                        className="timeoutBtn"
                                        onClick={() => {
                                            handleCheckOut(app);
                                        }}
                                        type="button"
                                    // style={{ width: '100%' }}
                                    >
                                        Time Out
                                    </button>
                                </div>



                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="field actionBtn">
                <button
                    className="timeoutBtn"
                    onClick={handleCheckOutAll}
                    type="button"
                    style={{ width: '100%', backgroundColor: '#ff0e0e', color: 'white', }}
                >
                    End Session
                </button>
            </div>

            <div className="field actionBtn">
                <button onClick={handleSubmit}>
                    {attendance.isAttendanceUpdateLoading ? 'Please Wait...' : 'Save'}
                </button>
            </div>

        </div>


        <Confirmation
            isVisible={isConfirmationVisible}
            message={<div>

                <div style={{ padding: 12, textAlign: 'left' }}>
                    <div>
                        Are you certain you wish to conclude the session? This action will check out all participants from the event.
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <input
                            checked={markedAsAbsent}
                            type="checkbox"
                            onChange={e => {
                                setMarkedAsAbsent(e.target.checked)
                            }}
                        />

                        Mark unchecked users as Absent

                    </div>
                </div>
            </div>}
            toggleConfirmationVisible={setIsConfirmationVisible}
            onSubmit={() => {
                handleUpdateAttendance();
            }}
            submitButtonLabel="Submit"
        />


        {isImagePreviewModalVisible && <ImagePreviewModal
            isImagePreviewModalVisible={isImagePreviewModalVisible}
            setIsImagePreviewModalVisible={setIsImagePreviewModalVisible}
            qrCodeUrl={currentQrCodeUrl}

        />}
    </EventAttendeeStyled>
};


const style = {
    attendanceAction: {
        cursor: 'pointer',
    },
    attendanceSubAction: {
        marginTop: '8px',
        fontSize: '12px',
        //cursor: 'pointer',
        color: 'grey',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleIcon: {
        margin: '0 auto',
    },
    miniCircleIcon: {
        width: 10,
        height: 10,
        marginRight: '3px',
        marginLeft: '0',
    },
    preview: {
        cursor: 'pointer',
        color: 'blue',
        width: '100%'
    }
};
export default EventAttendee;