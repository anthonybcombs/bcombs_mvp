import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { useParams } from '@reach/router';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { uuid } from 'uuidv4';
import { getHours, max, addDays,subDays } from 'date-fns';

import { requestAttendance } from '../../../../redux/actions/Attendance';
import { requestVendor } from '../../../../redux/actions/Vendors';

const AttendanceSummaryStyled = styled.div`
	#application-status {
		padding: 1em;
	}

	#application-status-header {
		font-size: 1.2em;
	}

	#application-status-header > div {
		padding: 1em 0;
	}

	#application-status-header > div > span {
		font-weight: normal;
	}

	#application-status-header > div > svg {
		color: #d33125;
	}

	#application-status-list {
		box-shadow: 0px 0px 10px #ccc;
	}

	#groups {
		text-align: center;
		font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif;
		border-collapse: collapse;
		width: 100%;
		border: 0;
	}

	#groups td,
	#groups th {
		border: 0;
		padding: 15px;
	}

	#groups tr:nth-child(odd) {
		background-color: #f9f9f9;
	}

	// #groups tr:hover {background-color: #ddd;}

	#groups th {
		text-align: center;
		background-color: #f26e21;
		color: white;
	}

	#groups a {
		color: #3e89fe;
		text-decoration: none;
	}

	.attendance-status-container {
		display: flex;
	}
	.attendance-status-container div {
		width: 33%;
	}
`;

const DATE_FORMAT = 'yyyy-MM-dd';
const DATE_KEY_FORMAT = 'yyyy_MM_dd';

export default function index(props) {
	const dispatch = useDispatch();
	const { attendance, applications, groups, auth, vendors, loading } = useSelector(
		({ attendance, applications, groups, auth, vendors, loading }) => {
			return { attendance, applications, groups, auth, vendors, loading };
		}
	);
	const [displayDays, setDisplayDays] = useState([subDays(new Date(), 2), subDays(new Date(), 1), new Date()]);
	const [attendanceDisplay, setAttendanceDisplay] = useState([]);

	const { app_group_id } = useParams();

	// appGroups = appGroups.filter((group) => {
	//   return group.vendor == vendor.id;
	// })

	useEffect(() => {
		if (auth.user_id) {
			dispatch(requestVendor(auth.user_id));
		}
	}, []);

	useEffect(() => {
		if (app_group_id) {
			dispatch(requestAttendance(app_group_id));
		}
	}, []);

	useEffect(() => {
		if(attendance.list) {
			let currentAttendance = attendance.list.reduce((accum,att) => {
				let attDate = format(new Date(parseInt(att.attendance_date)), DATE_FORMAT);
				attDate = attDate.replaceAll('-','_')
				return {
					...accum,
					[att.child_id] :{
						...att,
						total_volunteer_hours: ( accum[att.child_id] && accum[att.child_id].total_volunteer_hours || 0) + att.volunteer_hours || 0,
						attendance:{
							...(accum[att.child_id] && accum[att.child_id].attendance || {}),
							[attDate]: {
								status:att.attendance_status
							}
						}
					}
				}
			},{});
			currentAttendance = Object.keys(currentAttendance).map((key) => {
				return currentAttendance[key];
			});
			setAttendanceDisplay(currentAttendance);
		}
	},[attendance.list])

	const renderTableData = () => {
	
		let formattedDateKeys = displayDays.map(key => format(key,DATE_KEY_FORMAT));
		console.log('attendanceDisplay',attendanceDisplay)
		return attendanceDisplay.map((att, index) => {

			return (
				<tr key={index}>
					<td>
						<a href={'#'}>{`${att.firstname} ${att.lastname}`}</a>
					</td>
					<td>{att.app_group_name}</td>
					<td>85% (34/40)</td>
					{/* <td>{format(new Date(parseInt(att.attendance_date)), DATE_FORMAT)}</td> */}
					<td>
						<div className="attendance-status-container">
							<div> {att.attendance[formattedDateKeys[0]] && att.attendance[formattedDateKeys[0]].status || ''}</div>
							<div> {att.attendance[formattedDateKeys[1]] && att.attendance[formattedDateKeys[1]].status || ''}</div>
							<div> {att.attendance[formattedDateKeys[2]] && att.attendance[formattedDateKeys[2]].status || '' }</div>
						</div>
					</td>
					<td>
					<div className="attendance-status-container">
							<div> {att.total_volunteer_hours}</div>
							<div> </div>
							<div> </div>
						</div>
					</td>
				</tr>
			);
		});
	};

	console.log('app_group_id', app_group_id);
	console.log('app_group_id attendance', attendance);
	console.log('initialDayszzzz', displayDays);

	const handlePreviousDate = () => {
		setDisplayDays([
			subDays(displayDays[0],1),
			subDays(displayDays[1],1),
			subDays(displayDays[2],1),
		])
	};
	const handleNextDate = () => {
		setDisplayDays([
			addDays(displayDays[0],1),
			addDays(displayDays[1],1),
			addDays(displayDays[2],1),
		])
	};
	return (
		<AttendanceSummaryStyled>
			<div id="application-status">
				<div id="application-status-header">
					<div>
						<span>Attendance</span>
					</div>
				</div>
				<div id="application-status-list">
					<table id="groups">
						<tbody>
							<tr>
								<th>Name</th>
								<th>Class</th>
								<th>Summary</th>
								<th>Attendance Status</th>
								<th>Other Hours</th>
							</tr>

							<tr>
								<td></td>
								<td></td>
								<td></td>
								<td>
									<div className="attendance-status-container">
										{displayDays.map((date, index) => {
											return (
												<div>
													{index === 0 && <span onClick={handlePreviousDate}>{`<`}</span>}
													{format(date, DATE_FORMAT)}
													{index === 2 && <span onClick={handleNextDate}>{`>`}</span>}
												</div>
											);
										})}
									</div>
								</td>
								<td>
									<div className="attendance-status-container">
										<div>Total Volunteer Hours</div>
										<div>Total Mentoring Hours</div>
									</div>
								</td>
							</tr>

							{renderTableData()}
						</tbody>
					</table>
				</div>
			</div>
		</AttendanceSummaryStyled>
	);
}
