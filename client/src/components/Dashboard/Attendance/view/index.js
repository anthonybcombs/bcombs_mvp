import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { useParams } from '@reach/router';
import { format, isRan } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { uuid } from 'uuidv4';
import { getHours, max, addDays, subDays ,isWithinInterval} from 'date-fns';

import { requestAttendance } from '../../../../redux/actions/Attendance';
import { requestVendor } from '../../../../redux/actions/Vendors';


import CustomRangeDatePicker from '../../../../helpers/CustomRangeDatePicker';
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
	.attendance-status-container > div {
		width: 33%;
	}
	.circle-icon {
		border-radius: 50%;
		width: 15px;
		height: 15px;
		margin: 0 auto;
	}

	.form-control {
		display: block;
		width: 100%;
		height: auto;
		padding: 6px 12px;
		font-size: 14px;
		line-height: 1.42857143;
		color: #555;
		background-color: #fff;
		background-image: none;
		border: 1px solid #ccc;
		border-radius: 4px;
		-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
		-webkit-transition: border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s;
		-o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
		transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
		-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
		-moz-box-sizing: border-box; /* Firefox, other Gecko */
		box-sizing: border-box;
	}

	.form-control[disabled],
	.form-control[readonly],
	fieldset[disabled] .form-control {
		background-color: #eee;
		opacity: 1;
	}

	.filter-container {
		display: flex;
		padding-bottom: 12px;
	}
	.filter-container > div {
		min-width: 200px;
		margin-left: 12px;
	}

`;

const DATE_FORMAT = 'yyyy-MM-dd';
const DATE_KEY_FORMAT = 'yyyy_MM_dd';

const DEFAULT_DISPLAY_DAYS = [subDays(new Date(), 2), subDays(new Date(), 1), new Date()]

export default function index(props) {
	const dispatch = useDispatch();
	const { attendance, applications, groups, auth, vendors, loading } = useSelector(
		({ attendance, applications, groups, auth, vendors, loading }) => {
			return { attendance, applications, groups, auth, vendors, loading };
		}
	);
	const [displayDays, setDisplayDays] = useState(DEFAULT_DISPLAY_DAYS);
	const [attendanceDisplay, setAttendanceDisplay] = useState([]);
	const [defaultAttendanceDisplay, setDefaultAttendanceDisplay] = useState([]);
	const [selectedRangeDate, setSelectedRangeDate] = useState([new Date(),new Date()]);

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
		if (attendance.list) {

			let currentAttendance = attendance.list.reduce((accum, att) => {
				let attDate = format(new Date(parseInt(att.attendance_date)), DATE_FORMAT);
				attDate = attDate.replaceAll('-', '_');

				return {
					...accum,
					[att.child_id]: {
						...att,
						total_volunteer_hours:
							((accum[att.child_id] && accum[att.child_id].total_volunteer_hours) || 0) + att.volunteer_hours || 0,
						total_mentoring_hours:
							((accum[att.child_id] && accum[att.child_id].total_mentoring_hours) || 0) + att.mentoring_hours || 0,
						attendance: {
							...((accum[att.child_id] && accum[att.child_id].attendance) || {}),
							[attDate]: {
								status: att.attendance_status,
								mentoring_hours:att.mentoring_hours,
								volunteer_hours:att.volunteer_hours
							},
						},
					},
				};
			}, {});
			currentAttendance = Object.keys(currentAttendance).map(key => {
				return currentAttendance[key];
			});
			setAttendanceDisplay(currentAttendance);
			setDefaultAttendanceDisplay(currentAttendance);
		}
	}, [attendance.list]);

	const renderTableData = () => {
		let formattedDateKeys = displayDays.map(key => format(key, DATE_KEY_FORMAT));
		return attendanceDisplay.map((att, index) => {
			const totalAttendance = Object.keys(att.attendance).length;
			const totalPresent = Object.keys(att.attendance).filter(key => {
				return att.attendance[key].status === 'Present';
			}).length;

			return (
				<tr key={index}>
					<td>
						<a href={'#'}>{`${att.firstname} ${att.lastname}`}</a>
					</td>
					<td>{att.app_group_name}</td>
					<td>
						{`${((totalPresent * 100) / totalAttendance).toFixed(2)}%`} ({totalPresent}/{totalAttendance})
					</td>
					{/* <td>{format(new Date(parseInt(att.attendance_date)), DATE_FORMAT)}</td> */}
					<td>
						<div className="attendance-status-container">
							<div>
								<div>
									{' '}
									{(att.attendance[formattedDateKeys[0]] &&
										att.attendance[formattedDateKeys[0]].status === 'Present' && (
											<div className="circle-icon" style={{ backgroundColor: 'green' }}></div>
										)) ||
										''}
								</div>
								<div>
									{' '}
									{(att.attendance[formattedDateKeys[0]] &&
										att.attendance[formattedDateKeys[0]].status === 'Absent' && (
											<div className="circle-icon" style={{ backgroundColor: 'red' }}></div>
										)) ||
										''}
								</div>
								<div>
									{' '}
									{(att.attendance[formattedDateKeys[0]] && att.attendance[formattedDateKeys[0]].status === 'Tardy' && (
										<div className="circle-icon" style={{ backgroundColor: 'yellow' }}></div>
									)) ||
										''}
								</div>
							</div>

							<div>
								<div>
									{' '}
									{(att.attendance[formattedDateKeys[1]] &&
										att.attendance[formattedDateKeys[1]].status === 'Present' && (
											<div className="circle-icon" style={{ backgroundColor: 'green' }}></div>
										)) ||
										''}
								</div>
								<div>
									{' '}
									{(att.attendance[formattedDateKeys[1]] &&
										att.attendance[formattedDateKeys[1]].status === 'Absent' && (
											<div className="circle-icon" style={{ backgroundColor: 'red' }}></div>
										)) ||
										''}
								</div>
								<div>
									{' '}
									{(att.attendance[formattedDateKeys[1]] && att.attendance[formattedDateKeys[1]].status === 'Tardy' && (
										<div className="circle-icon" style={{ backgroundColor: 'yellow' }}></div>
									)) ||
										''}
								</div>
							</div>

							<div>
								<div>
									{' '}
									{(att.attendance[formattedDateKeys[2]] &&
										att.attendance[formattedDateKeys[2]].status === 'Present' && (
											<div className="circle-icon" style={{ backgroundColor: 'green' }}></div>
										)) ||
										''}
								</div>
								<div>
									{' '}
									{(att.attendance[formattedDateKeys[2]] &&
										att.attendance[formattedDateKeys[2]].status === 'Absent' && (
											<div className="circle-icon" style={{ backgroundColor: 'red' }}></div>
										)) ||
										''}
								</div>
								<div>
									{' '}
									{(att.attendance[formattedDateKeys[2]] && att.attendance[formattedDateKeys[2]].status === 'Tardy' && (
										<div className="circle-icon" style={{ backgroundColor: 'yellow' }}></div>
									)) ||
										''}
								</div>
							</div>
						</div>
					</td>
					<td>
						<div className="attendance-status-container">
							<div> {att.total_volunteer_hours}</div>
							<div> {att.total_mentoring_hours}</div>
							<div> </div>
						</div>
					</td>
				</tr>
			);
		});
	};

	const handlePreviousDate = () => {
		setDisplayDays([subDays(displayDays[0], 1), subDays(displayDays[1], 1), subDays(displayDays[2], 1)]);
	};
	const handleNextDate = () => {
		setDisplayDays([addDays(displayDays[0], 1), addDays(displayDays[1], 1), addDays(displayDays[2], 1)]);
	};

	const handleSearchChange = e => {
		const { value } = e.target;
		if (value === '') {
			setAttendanceDisplay(defaultAttendanceDisplay);
		} else {
			let lowerCaseValue = value.toLowerCase();
			const list = defaultAttendanceDisplay.filter(
				item =>
					item.lastname.toLowerCase().includes(lowerCaseValue) || item.firstname.toLowerCase().includes(lowerCaseValue)
			);
			setAttendanceDisplay(list);
		}
	};

	const handleChangeRangeDate = date => {
		if (date == null) {
			setAttendanceDisplay(defaultAttendanceDisplay);
			setSelectedRangeDate([
				new Date(),
				new Date()
			]);
			setDisplayDays(DEFAULT_DISPLAY_DAYS)
			return;
		}
		const updatedAttendanceDisplay = defaultAttendanceDisplay.map(att => {
			const dateKeys = Object.keys(att.attendance);
			const filteredDate = dateKeys.filter(key => {
				return isWithinInterval(new Date(key.replaceAll('_','-')), {
					start: subDays(new Date(date[0]), 1),
					end: addDays(new Date(date[1]), 1)
				})
			});
			const totalHours = filteredDate.reduce((accum,key) => {
				return {
					total_volunteer_hours:
					(( accum.total_volunteer_hours) || 0) + att.attendance[key].volunteer_hours || 0,
					total_mentoring_hours:
					((accum.total_mentoring_hours) || 0) + att.attendance[key].mentoring_hours || 0,
				}
			},{ total_volunteer_hours:0,total_mentoring_hours:0 });

			return {
				...att,
				...totalHours,
				attendance: filteredDate.reduce((accum,key) => {
					return {
						...accum,
						[key]: {
							...att.attendance[key],
						}
					}
				},{})
			}

		});
		setAttendanceDisplay(updatedAttendanceDisplay);
		setDisplayDays(	[
			new Date(date[0]),
			addDays(new Date(	new Date(date[0])), 1),
			addDays(new Date(	new Date(date[0])), 2)
		]);
		setSelectedRangeDate([
			new Date(date[0]),
			new Date(date[1])
		])
	}

	return (
		<AttendanceSummaryStyled>
			<div id="application-status">
				<div id="application-status-header">
					<div>
						<span>Attendance</span>
					</div>
				</div>
				<div className="filter-container">
					<div>
						{/* <select className="form-control">
								<option value="">Filter By</option>
								<option key={1} value={1}>
									Test
								</option>
							</select> */}

						<CustomRangeDatePicker value={selectedRangeDate} onChange={handleChangeRangeDate} />
					</div>
					<div>
						<input
							type="text"
							className="form-control"
							name="search"
							placeholder="Search"
							onChange={handleSearchChange}
						/>
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
													{index === 0 && <span onClick={handlePreviousDate} style={{ cursor: 'pointer' }}>{`<`}</span>}
													{format(date, DATE_FORMAT)}
													{index === 2 && <span onClick={handleNextDate} style={{ cursor: 'pointer' }}>{`>`}</span>}
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
