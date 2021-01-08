import React, { useEffect, useState } from 'react';
import { Link } from "@reach/router";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faAngleLeft, faAngleRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useParams } from '@reach/router';
import { format, isRan } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { uuid } from 'uuidv4';
import { getHours, max, addDays, subDays, isWithinInterval } from 'date-fns';

import { requestAttendance } from '../../../../redux/actions/Attendance';
import { requestVendor } from '../../../../redux/actions/Vendors';

import CustomRangeDatePicker from '../../../../helpers/CustomRangeDatePicker';
const AttendanceSummaryStyled = styled.div`
	width: auto;
	max-width: 1920px;
	margin: auto;
	padding: 0rem 3em 2rem;

	#attendance-summary {
		position: relative;
		padding: 1rem;
		background-color: #fff;
		box-shadow: 0 0 25px #eae9e9;
		min-height: calc(100vh - 220px);
	}
	#attendance-summary .back-btn {
		width: 50px;
		color: #3e89fe;
		display: flex;
    align-items: center;
		padding-bottom: 1rem;
		text-decoration: none;
	}
	#attendance-summary .back-btn svg {
		padding-right: 5px;
	}

	#attendance-summary-list {
		box-shadow: 0px 0px 10px #ccc;
		overflow-x: auto;
	}

	#attendance-summary-list::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}
	#attendance-summary-list::-webkit-scrollbar-track {
		border-radius: 10px;
		transition: 0.5s ease-in-out;
		background: rgb(243 110 34 / 20%);
	}
	#attendance-summary-list::-webkit-scrollbar-thumb {
		background: #f36e22;
		border-radius: 10px;
	}
	


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

	#attendance-table {
		text-align: center;
		font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif;
		border-collapse: collapse;
		width: 100%;
		border: 0;
	}

	#attendance-table tbody tr:nth-child(2) {
		background: rgb(128 128 128 / 20%);
	}

	#attendance-table th:not(:last-child),
	#attendance-table tbody tr:nth-child(2) .subHeader:not(:last-child),
	#attendance-table tbody tr:nth-child(2) .subHeader .subTable tr td:not(:last-child) {
		border-right: 1px solid rgb(255 255 255 / 65%);
	}

	#attendance-table tbody tr:nth-child(2) .subHeader .subTable tr td {
		white-space: nowrap;
	}
	#attendance-table tbody tr .subHeader .subTable tr td {
		width: 200px;
	}
	#attendance-table tbody tr .subHeader .subTable tr td .name,
	#attendance-table tbody tr .subHeader .subTable tr td .class {
		min-width: 100px;
	}
	#attendance-table tbody tr .subHeader .subTable tr td .name a,
	#attendance-table tbody tr .subHeader .subTable tr td .class >div {
		word-break: break-word;
	}

	#attendance-table tbody tr .subHeader .subTable tr td .summary {
		white-space: nowrap;
	}

	#attendance-table td,
	#attendance-table th {
		border: 0;
		padding: 15px;
	}

	#attendance-table tr:nth-child(even) {
		background-color: #f9f9f9;
	}

	#attendance-table th {
		text-align: center;
		background-color: #f26e21;
		color: white;
	}

	#attendance-table td.subHeader {
		padding: 0;
	}


	#attendance-table td.subHeader table.subTable {
		width: 100%;
	}
	#attendance-table td.subHeader table.subTable tr {
		background: transparent;
	}


	#attendance-table a {
		color: #3e89fe;
		text-decoration: none;
	}



	.attendance-status-container {
		display: flex;
	}
	.attendance-status-container .date svg {
		color: grey;
		transition: .15s ease-in-out;
	}
	.attendance-status-container .date svg:hover {
		color: #000;
	}
	.attendance-status-container > div {
		width: 100%;
    min-width: 110px;
	}
	.attendance-status-container > div.date {
		padding: 15px 0;
	}
	.attendance-status-container > div.date:not(:last-child) {
		border-right: 1px solid rgb(255 255 255);
	}


	.circle-icon {
		border-radius: 50%;
		width: 15px;
		height: 15px;
		margin: 0 auto;
	}


	.exclude-icon {
    position: absolute;
		top: -2px;
    left: 49%;
		width: 3px;
		height: 20px;
		z-index: 99px;
		// top: -17px;
		margin: 0 auto;
		background-color: black;
		transform: rotateY(0deg) rotate(45deg);
	}

	.field {
		padding: 5px !important;
		margin: 5px !important;
		display: flex;
		flex-flow: column-reverse;
		margin-bottom: 1em;
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
	.field-input:placeholder-shown + .field-label {
		max-width: calc(100% - 30%) !important;
	}
	.field-label,
	.field-input {
		transition: all 0.2s;
		touch-action: manipulation;
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
		font-weight: bold;
	}
	.field .calendars {
		padding-left: 2.3rem;
	}




	.filter-container {
		display: flex;
		padding-bottom: 12px;
	}
	.filter-container > div {
		position: relative;
		min-width: 200px;
	}
	.filter-container .react-datetimerange-picker{
		margin: 0;
	}
	.filter-container .react-datetimerange-picker__wrapper {
		border: 0;
		padding-top: 8px;
		padding-bottom: 8px;
		padding-left: 2.3rem;
		border-bottom: 2px solid #ccc;
	}
	.filter-container .react-datetimerange-picker__calendar-button {
		position: absolute;
		left: 0;
	}
	.filter-container .react-datetimerange-picker__wrapper button svg {
		stroke: grey;
		transition: .15s ease-in-out;
	}
	.filter-container .react-datetimerange-picker__calendar-button:hover svg,
	.filter-container .react-datetimerange-picker__calendar-button svg:hover {
		stroke: #f26e21;
	}

	.filter-container .react-datetimerange-picker__clear-button:hover svg,
	.filter-container .react-datetimerange-picker__clear-button svg:hover {
		stroke: red;
	}
	.filter-container .react-datetimerange-picker__inputGroup {
		font-size: 18px;
	}

	.filter-container > div.search {
		margin-left: auto !important;
		width: 280px;
	}
	.filter-container > div.search > svg {
		position: absolute;
		bottom: 18px;
		color: gray;
	}
	.filter-container > div.search > input {
		text-indent: 2rem;
	}
	.filter-container > div.search > label {
		padding-left: 1.5rem;
	}


	.react-calendar {
		border: none;
		box-shadow: 0 3px 6px #ddd;
	}
	.react-calendar__navigation {
		margin: 0px;
		display: flex;
		justify-content: center;
		background: rgb(243, 110, 34);
	}
	.react-calendar__navigation button {
		color: #fff;
	}
	.react-calendar__month-view__weekdays {
		padding: 5px 0;
		background: #f0f0f0;
	}
	.react-calendar__month-view__weekdays__weekday {
		font-weight: normal;
	}
	.react-calendar__month-view__weekdays__weekday >abbr {
		text-decoration: none;
	}
	.react-calendar__month-view__days {
		padding: 0 .3rem .5rem;
	}
	.react-calendar__tile--hasActive,
	.react-calendar__tile--active:enabled:hover,
	.react-calendar__tile--active:enabled:focus {
		background: #f46e21;
		color: #fff;
		font-weight: 600;
	}
	.react-calendar__tile--active {
	background: rgb(242 110 33 / 25%);
	color: #000;
	}


	.react-calendar__tile {
	border-radius: 5px;
	}
	.react-calendar__navigation button:enabled:hover, 
	react-calendar__navigation button:enabled:focus {
	background-color: rgb(255 255 255 / 20%);
	}





	@media (max-width: 840px) {
		padding: 0rem 1rem 2rem;
	}

	@media (max-width: 740px) {
		.filter-container {
			display: block;
		}
		.filter-container > div.search {
			margin-left: unset !important;
			width: 100%;
		}
		.filter-container .react-datetimerange-picker__wrapper {
			width: 100%;
			justify-content: space-between;
		}
		.filter-container .react-datetimerange-picker__inputGroup {
			flex-grow: unset;
		}
	}

`;

const DATE_FORMAT = 'yyyy-MM-dd';
const DATE_KEY_FORMAT = 'yyyy_MM_dd';

const DEFAULT_DISPLAY_DAYS = [subDays(new Date(), 2), subDays(new Date(), 1), new Date()];

const AttendanceIcon = ({color = 'gray'}) => {
		return <div className="circle-icon" style={{backgroundColor:color}}/>
}

const attendanceColor = {
	present:'#14e414',
	absent:'red',
	tardy:'#f26e21'
}

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
	const [selectedRangeDate, setSelectedRangeDate] = useState([new Date(), new Date()]);

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
		if (app_group_id && !attendance.isLoading) {
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
						fullname: `${att.firstname} ${att.lastname}`,
						total_volunteer_hours:
							((accum[att.child_id] && accum[att.child_id].total_volunteer_hours) || 0) + att.volunteer_hours || 0,
						total_mentoring_hours:
							((accum[att.child_id] && accum[att.child_id].total_mentoring_hours) || 0) + att.mentoring_hours || 0,
						attendance: {
							...((accum[att.child_id] && accum[att.child_id].attendance) || {}),
							[attDate]: {
								status: att.attendance_status,
								mentoring_hours: att.mentoring_hours,
								volunteer_hours: att.volunteer_hours,
								is_excused: att.is_excused,
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
				return att.attendance[key].status === 'Present' || att.attendance[key].is_excused === 1;
			}).length;

			return (
				<tr key={index}>
					<td className="subHeader">
						<table className="subTable">
							<tr>
								<td>
									<div className='name'><a href={'#'}>{`${att.firstname} ${att.lastname}`}</a></div>
								</td>
								<td><div className='class'>{att.app_group_name}</div></td>
							</tr>
						</table>
						
					</td>
					
					<td className="subHeader">
						<table className="subTable">
							<tr>
								<td><div className='summary'>{`${((totalPresent * 100) / totalAttendance).toFixed(2)}%`} ({totalPresent}/{totalAttendance})</div></td>
								<td style={{ width: '380px'}}>
									<div className="attendance-status-container">
										<div>
											<div style={{ position: 'relative'}}>
												{' '}
												{(att.attendance[formattedDateKeys[0]] &&
													att.attendance[formattedDateKeys[0]].status !== null && (
														<div>
														<AttendanceIcon color={attendanceColor[	att.attendance[formattedDateKeys[0]].status.toLowerCase()]}/>
													
															{(att.attendance[formattedDateKeys[0]].status === 'Absent' || 
																att.attendance[formattedDateKeys[0]].status === 'Tardy') && 
																att.attendance[formattedDateKeys[0]].is_excused === 1 ? (
																<div className="exclude-icon"></div>
															) : (
																<span />
															)}
																{att.attendance[formattedDateKeys[0]].status}
														</div>
													)) ||
													<AttendanceIcon />	}
											</div>
											{/* <div>
												{' '}
												{(att.attendance[formattedDateKeys[0]] &&
													att.attendance[formattedDateKeys[0]].status === 'Absent' && (
														<div>
															<AttendanceIcon color="red"/>
															{att.attendance[formattedDateKeys[0]].is_excused === 1 ? (
																<div className="exclude-icon"></div>
															) : (
																<span />
															)}
														</div>
													)) ||
													''}
											</div>
											<div>
												{' '}
												{(att.attendance[formattedDateKeys[0]] && att.attendance[formattedDateKeys[0]].status === 'Tardy' && (
													<div>
															<AttendanceIcon color="#f26e21"/>
														{att.attendance[formattedDateKeys[0]].is_excused === 1 ? (
															<div className="exclude-icon"></div>
														) : (
															<span />
														)}
													</div>
												)) ||
													''}
											</div> */}
										</div>

										<div>
										{(att.attendance[formattedDateKeys[1]] &&
													att.attendance[formattedDateKeys[1]].status !== null && (
														<div style={{ position: 'relative'}}>
														<AttendanceIcon color={attendanceColor[att.attendance[formattedDateKeys[1]].status.toLowerCase()]}/>
													
															{(att.attendance[formattedDateKeys[1]].status === 'Absent' || 
																att.attendance[formattedDateKeys[1]].status === 'Tardy') && 
																att.attendance[formattedDateKeys[1]].is_excused === 1 ? (
																<div className="exclude-icon"></div>
															) : (
																<span />
															)}
																	{att.attendance[formattedDateKeys[1]].status}
														</div>
													)) ||
													<AttendanceIcon />	}
										</div>

										<div>
											{(att.attendance[formattedDateKeys[2]] &&
													att.attendance[formattedDateKeys[2]].status !== null && (
														<div style={{ position: 'relative'}}>
														<AttendanceIcon color={attendanceColor[	att.attendance[formattedDateKeys[2]].status.toLowerCase()]}/>
													
															{(att.attendance[formattedDateKeys[2]].status === 'Absent' || 
																att.attendance[formattedDateKeys[2]].status === 'Tardy') && 
																att.attendance[formattedDateKeys[2]].is_excused === 1 ? (
																<div className="exclude-icon"></div>
															) : (
																<span />
															)}
															{att.attendance[formattedDateKeys[2]].status}
														</div>
													)) ||
													<AttendanceIcon />	}
										</div>
									</div>
								</td>
							</tr>
						</table>
					</td>
					{/* <td>{format(new Date(parseInt(att.attendance_date)), DATE_FORMAT)}</td> */}
					
					<td className="subHeader">
						<table className="subTable">
							<tr>
								<td style={{ width: '100px'}}> {att.total_volunteer_hours}</td>
								<td style={{ width: '100px'}}> {att.total_mentoring_hours}</td>
							</tr>
						</table>
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
			console.log('defaultAttendanceDisplay',defaultAttendanceDisplay)
			console.log('defaultAttendanceDisplay lowerCaseValue',lowerCaseValue)
			const list = defaultAttendanceDisplay.filter(
				item => item.fullname && item.fullname.toLowerCase().includes(lowerCaseValue)
			);
			setAttendanceDisplay(list);
		}
	};

	const handleChangeRangeDate = date => {
		if (date == null) {
			setAttendanceDisplay(defaultAttendanceDisplay);
			setSelectedRangeDate([new Date(), new Date()]);
			setDisplayDays(DEFAULT_DISPLAY_DAYS);
			return;
		}
		const updatedAttendanceDisplay = defaultAttendanceDisplay.map(att => {
			const dateKeys = Object.keys(att.attendance);
			const filteredDate = dateKeys.filter(key => {
				return isWithinInterval(new Date(key.replaceAll('_', '-')), {
					start: subDays(new Date(date[0]), 1),
					end: addDays(new Date(date[1]), 1),
				});
			});
			const totalHours = filteredDate.reduce(
				(accum, key) => {
					return {
						total_volunteer_hours: (accum.total_volunteer_hours || 0) + att.attendance[key].volunteer_hours || 0,
						total_mentoring_hours: (accum.total_mentoring_hours || 0) + att.attendance[key].mentoring_hours || 0,
					};
				},
				{ total_volunteer_hours: 0, total_mentoring_hours: 0 }
			);

			return {
				...att,
				...totalHours,
				attendance: filteredDate.reduce((accum, key) => {
					return {
						...accum,
						[key]: {
							...att.attendance[key],
						},
					};
				}, {}),
			};
		});
		setAttendanceDisplay(updatedAttendanceDisplay);
		setDisplayDays([
			new Date(date[0]),
			addDays(new Date(new Date(date[0])), 1),
			addDays(new Date(new Date(date[0])), 2),
		]);
		setSelectedRangeDate([new Date(date[0]), new Date(date[1])]);
	};

	return (
		<AttendanceSummaryStyled>
			<h2>Attendance Summary</h2>
			<div id="attendance-summary">
				<Link to={'/dashboard/attendance'} className="back-btn">
					<FontAwesomeIcon
						className='back-icon'
						icon={faAngleLeft}
					/>	
					Back
				</Link>
				<div className="filter-container">
					<div className="field">
						{/* <select className="form-control">
								<option value="">Filter By</option>
								<option key={1} value={1}>
									Test
								</option>
							</select> */}

						<CustomRangeDatePicker value={selectedRangeDate} onChange={handleChangeRangeDate} />
						{/* <label className="field-label calendars">
							Calendars
						</label> */}
					</div>
					<div className="field search">
						<input
							id="search"
							type="text"
							className={'field-input'}
							name="search"
							placeholder="Search"
							onChange={handleSearchChange}
						/>
						<label className="field-label" for={`search`}>
								Search
							</label>
							<FontAwesomeIcon
								className='search-icon'
								icon={faSearch}
							/>
					</div>
				</div>
				<div id="attendance-summary-list">
					<table id="attendance-table">
						<tbody>
							<tr>
								<th>Student</th>
								<th>Attendance Status</th>
								<th>Other Hours</th>
							</tr>

							<tr>
								<td className="subHeader">
									<table className="subTable">
										<tr>
											<td>Name</td>
											<td>Class</td>
										</tr>
									</table>
								</td>

								<td className="subHeader">
									<table className="subTable">
										<tr>
											<td>Summary</td>
											<td style={{ width: '380px', padding: '0'}}>
												<div className="attendance-status-container">
													{displayDays.map((date, index) => {
														return (
															<div className='date'>
																{index === 0 && <span onClick={handlePreviousDate} style={{ cursor: 'pointer', marginRight: '1rem' }}>
																	<FontAwesomeIcon
																		className='search-icon'
																		icon={faAngleLeft}
																	/>	
																</span>}
																{format(date, DATE_FORMAT)}
																{index === 2 && <span onClick={handleNextDate} style={{ cursor: 'pointer', marginLeft: '1rem' }}>
																	<FontAwesomeIcon
																		className='search-icon'
																		icon={faAngleRight}
																	/>	
																</span>}
															</div>
														);
													})}
												</div>
											</td>
										</tr>
									</table>
								</td>

								<td className="subHeader">
									<table className="subTable">
										<tr>
											<td>Total Volunteer Hours</td>
											<td>Total Mentoring Hours</td>
										</tr>
									</table>
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
