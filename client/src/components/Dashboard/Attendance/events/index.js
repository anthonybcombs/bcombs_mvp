import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "@reach/router";
import styled from "styled-components";
import { parse } from 'query-string';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faCopy, faTrashAlt } from '@fortawesome/free-solid-svg-icons';


import { s3BucketRootPath } from '../../../../constants/aws';

import Confirmation from "../../../../helpers/Confirmation";
import Loading from "../../../../helpers/Loading.js";

import ImagePreviewModal from '../modal/imagePreview';

// import { militaryToRegularTime } from '../../../../helpers/Date';



const AttendanceEventStyled = styled.div`

    padding: 12px;
    #event-list {
        text-align: center;
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
        border: 0;
    }
  
    #event-list td, #groups th {
        border: 0;
        padding: 15px;
    }
  
    #event-list tr:nth-child(odd){background-color: #f9f9f9;}

    #event-list th {
        text-align: center;
        background-color: #f26e21;
        color: white;
    }

    #event-list a {
        color: #3e89fe;
        text-decoration: none;
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
        // padding: 10px;
        display: block;
        margin: 1em auto;
        background-color: #ff0e0e !important;
        border: none;
        width: 100% !important;
      }
`;


const getCurrentUserAndAttendance = async ({
    vendorId,
    attendanceType = '',
    appGroup = ''
}) => {
    // ${process.env.API_HOST}
    const response = await fetch(`${process.env.API_HOST}/api/attendance/events?vendorId=${vendorId}&attendanceType=${attendanceType}&appGroup=${appGroup}`, {
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

const deleteEventAndAttendance = async ({
    eventId,
    vendorId
}) => {
    // ${process.env.API_HOST}
    const response = await fetch(`${process.env.API_HOST}/api/attendance/event`, {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            eventId,
            vendorId
        })
    });
    return response.json();
}

const AttendanceEvents = props => {
    const location = useLocation();
    const queryParams = parse(location.search);

    const [events, setEvents] = useState([]);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isImagePreviewModalVisible, setIsImagePreviewModalVisible] = useState(false);
    const [currentQrCodeUrl, setCurrentQrCodeUrl] = useState('');

    useEffect(() => {
        if (queryParams?.vendorId) {
            getEventsByVendor({
                vendorId: queryParams?.vendorId,
                attendanceType: queryParams?.attendanceType,
                appGroup: queryParams?.formId
            })
        }
    }, []);

    const getEventsByVendor = async ({
        vendorId,
        attendanceType,
        appGroup
    }) => {
        try {
            setIsLoading(true);
            const response = await getCurrentUserAndAttendance({
                vendorId,
                attendanceType,
                appGroup
            });
            setEvents(response?.events || []);
        } catch (err) {

        }
        finally {
            setIsLoading(false);
        }
    };

    const handleDeleteEvent = async id => {
        try {
            await deleteEventAndAttendance({
                eventId: id,
                vendorId: queryParams?.vendorId,
            });

        } catch (err) {
            console.log('handleDeleteEvent err', err)
        } finally {
            getEventsByVendor({
                vendorId: queryParams?.vendorId,
                attendanceType: queryParams?.attendanceType,
                appGroup: queryParams?.formId
            })
        }
    }


    const handleCopyUrl = url => {
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);

        tempInput.value = url;
        tempInput.select();

        document.execCommand('copy');

        document.body.removeChild(tempInput);
    }


    console.log('Events', events)


    return <AttendanceEventStyled>
        <div style={{ paddingTop: 12, paddingBottom: 12 }}>
            <Link to={`/dashboard/studentdata?vendorId=${queryParams?.vendorId}`}>
                <FontAwesomeIcon
                    className='save-icon'
                    icon={faAngleLeft}
                />
                {` `}Back
            </Link>
        </div>
        {isLoading ? <Loading /> : <table id="event-list" style={{ width: '100%' }}>
            <tbody style={{ textAlign: 'center' }}>
                <tr style={{ padding: 8 }}>
                    <th>Name</th>
                    <th>Group</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>QR Code</th>
                    <th>Attendance Page URL</th>
                    <th>Action</th>
                </tr>
                {events.map(event => {
                    let currentAppGroupName = event.app_group_name;

                    if (event?.attendance_type === 'bcombs' && !event?.attendance_app_group && !event.app_group_name) {
                        currentAppGroupName = 'All Mentoring'
                    }

                    else if (event?.attendance_type === 'forms') {
                        currentAppGroupName = event?.form_name;
                    }
                    // else if(event?.attendance_type === 'forms' && !event?.attendance_app_group && !event.app_group_name ) {
                    //     currentAppGroupName =  ''
                    // }

                    const qrCodeUrl = `${s3BucketRootPath}/${event.qr_code_url}`;
                    return <tr style={{ backgroundColor: 'white' }}>
                        <td><Link to={`/dashboard/eventattendance/${event.id}?vendorId=${queryParams?.vendorId}&type=${event?.attendance_type === 'bcombs' ? 'mentoring' : 'forms'}`}>{event.title}</Link></td>
                        <td>{currentAppGroupName}</td>
                        <td>{format(new Date(event.start), 'yyyy-MM-dd')}</td>
                        <td>{format(new Date(event.start), 'hh:mm a')}</td>
                        <td>{format(new Date(event.end), 'hh:mm a')}</td>
                        <td>
                            <img src={qrCodeUrl} style={{ width: 100, height: 100 }} />

                            <div>
                                <span
                                    style={style.preview}
                                    onClick={() => {
                                        // printImage(qrCodeUrl,event.title)
                                        setCurrentQrCodeUrl(qrCodeUrl);
                                        setIsImagePreviewModalVisible(!isImagePreviewModalVisible)
                                    }}
                                    src={qrCodeUrl}
                                >Preview</span>
                            </div>

                        </td>
                        <td>
                            <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => {
                                const url = `${process.env.HOST}/event/${event.id}/attendance`;
                                // const url = currentCopyLink//window.location.href;
                                // const val = inputElRef.current.select()
                                // document.execCommand('copy');
                                handleCopyUrl(url);

                            }}><FontAwesomeIcon icon={faCopy} />{` `}Copy URL</span>

                        </td>

                        <td><button onClick={() => {
                            setCurrentEvent(event);
                            // handleDeleteEvent(event.id);
                            setIsConfirmationVisible(true)
                        }} type="button">

                            <FontAwesomeIcon
                                icon={faTrashAlt}
                            />
                        </button></td>
                    </tr>
                })}
            </tbody>
        </table>}
        <Confirmation
            isVisible={isConfirmationVisible}
            message={`Are you sure you want to delete this event ${currentEvent?.title}?`}
            toggleConfirmationVisible={setIsConfirmationVisible}
            onSubmit={() => {
                if (currentEvent) {
                    handleDeleteEvent(currentEvent?.id)
                }

            }}
            submitButtonLabel="Submit"
        />


        {isImagePreviewModalVisible && <ImagePreviewModal
            isImagePreviewModalVisible={isImagePreviewModalVisible}
            setIsImagePreviewModalVisible={setIsImagePreviewModalVisible}
            qrCodeUrl={currentQrCodeUrl}

        />}
       
    </AttendanceEventStyled>
};


const style = {
    preview: {
        cursor: 'pointer',
        color: 'blue',
        width: '100%'
    }
}
export default AttendanceEvents;