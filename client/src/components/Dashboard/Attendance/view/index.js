import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faMinusCircle,
	faAngleLeft,
	faAngleRight,
	faSearch,
	faClock,
	faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation, useParams } from '@reach/router';
import { format, isRan } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { uuid } from 'uuidv4';
import { isAfter, isEqual, getHours, max, addDays, subDays, addYears, isWithinInterval } from 'date-fns';
import { parse } from 'query-string';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { requestAttendance, requestEventAttendance } from '../../../../redux/actions/Attendance';
import { requestGetApplications, requestGetCustomApplications } from '../../../../redux/actions/Application';
import { requestGetForms, requestGetFormById } from '../../../../redux/actions/FormBuilder';
import { requestUserGroup } from '../../../../redux/actions/Groups';
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
	#attendance-table tbody tr .subHeader .subTable tr td .class > div {
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
		transition: 0.15s ease-in-out;
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
	
	}
	.filter-container > div {
		position: relative;
		min-width: 200px;
	}

	.filter-container .custom-range-picker {
		width: 150px !important;
		min-width: 150px;
	}
	.filter-container .react-datetimerange-picker {
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
		transition: 0.15s ease-in-out;
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
		margin: auto !important;
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
	.react-calendar__month-view__weekdays__weekday > abbr {
		text-decoration: none;
	}
	.react-calendar__month-view__days {
		padding: 0 0.3rem 0.5rem;
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

	.react-datepicker-wrapper {
		margin: 0;
	}
	.react-datepicker__input-container .field {
		margin: 0 !important;
		padding: 0 !important;
	}
	.react-datepicker__input-container .field svg.calendar-icon {
		position: absolute;
		right: 0;
		bottom: 10px;
		color: grey;
	}
`;

const DATE_FORMAT = 'MM-dd-yyyy';
const DATE_KEY_FORMAT = 'MM_dd_yyyy';
const DISPLAY_DATE_FORMAT = 'MMM d, yyyy';

const DEFAULT_DISPLAY_DAYS = [subDays(new Date(), 2), subDays(new Date(), 1), new Date()];

const AttendanceIcon = ({ color = 'gray' }) => {
	return <div className="circle-icon" style={{ backgroundColor: color }} />;
};

const attendanceColor = {
	present: '#14e414',
	absent: 'red',
	tardy: '#f26e21',
};

const range = (start, end) => {
	let arr = [];

	for (let i = start; i <= end; i++) {
		arr.push(i);
	}

	return arr;
};

const years = range(1900, new Date().getFullYear());
const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const DateCustomInput = ({ value, onClick, name, className, placeholder, label }) => (
	<div className="field">
		<input
			value={value}
			onClick={onClick}
			name={name}
			className={className}
			placeholder={DISPLAY_DATE_FORMAT}
			readOnly={true}
			id={`attendance_date`}
		/>
		<label className="field-label" for={`attendance_date`}>
			<span className="required">*</span> {label}
		</label>
		<FontAwesomeIcon icon={faCalendar} className="calendar-icon" />
	</div>
);

const CustomRangePicker = ({ onChange, placeholder, selected }) => {
	return (
		<DatePicker
			dateFormat={DISPLAY_DATE_FORMAT}
			readOnly={false}
			style={{ marginTop: 24 }}
			renderCustomHeader={({
				date,
				changeYear,
				changeMonth,
				decreaseMonth,
				increaseMonth,
				prevMonthButtonDisabled,
				nextMonthButtonDisabled,
			}) => (
				<div
					style={{
						margin: 0,
						display: 'flex',
						alignCenter: 'center',
						justifyContent: 'center',
						background: '#f36e22',
						padding: '5px 3px',
					}}>
					<button
						className="datepicker-btn"
						onClick={e => {
							e.preventDefault();
						}}>
						<FontAwesomeIcon icon={faAngleLeft} onClick={decreaseMonth} disabled={prevMonthButtonDisabled} />
					</button>
					<select
						value={new Date(date).getFullYear()}
						onChange={({ target: { value } }) => {
							if (value) {
								return changeYear(value);
							}
						}}>
						{years.map(option => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>

					<select
						value={months[date.getMonth()]}
						onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
						{months.map(option => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
					<button
						className="datepicker-btn"
						onClick={e => {
							e.preventDefault();
						}}>
						<FontAwesomeIcon icon={faAngleRight} onClick={increaseMonth} disabled={nextMonthButtonDisabled} />
					</button>
				</div>
			)}
			disabled={false}
			onChange={onChange}
			name={'attendance_date'}
			customInput={<DateCustomInput label={placeholder} className={'field-input date-field'} />}
			selected={selected}
		/>
	);
};

const DEFAULT_DATE = {
	start: new Date('2020-08-01'),
	end: new Date('2021-07-31'),
};

export default function index(props) {
	const dispatch = useDispatch();
	const { attendance, applications, groups, auth, vendors, loading } = useSelector(
		({ attendance, applications, groups, auth, vendors, loading }) => {
			return { attendance, applications, groups, auth, vendors, loading };
		}
	);
	const [currentDisplayDays, setCurrentDisplayDays] = useState([]);
	const [displayDays, setDisplayDays] = useState(DEFAULT_DISPLAY_DAYS);
	const [defaultDisplayDays, setDefaultDisplayDays] = useState(DEFAULT_DISPLAY_DAYS);
	const [displayDayIndex, setDisplayDayIndex] = useState([0, 1, 2]);
	const [attendanceDisplay, setAttendanceDisplay] = useState([]);
	const [attendanceSummary, setAttendanceSummary] = useState({});
	const [defaultAttendanceDisplay, setDefaultAttendanceDisplay] = useState([]);
	const [events, setEvents] = useState([]);
	const [defaultEvents, setDefaultEvents] = useState([]);
	const [selectedRangeDate, setSelectedRangeDate] = useState({ start: new Date(), end: new Date() });
	const [selectedSummaryRangeDate, setSelectedSummaryRangeDate] = useState({
		start: new Date(),
		end: addYears(new Date(), 1),
	});
	const [isRightCalendarVisible, setIsRightCalendarVisible] = useState(false);
	const { app_group_id } = useParams();
	const queryLocation = useLocation();
	const searchParams = parse(queryLocation.search); // => {init: "true"}
	//const [startDateRange, setStartDateRange]

	// appGroups = appGroups.filter((group) => {
	//   return group.vendor == vendor.id;
	// })

	useEffect(() => {
		// if (auth.user_id) {
		// 	dispatch(requestVendor(auth.user_id));
		// }

		if (searchParams && searchParams.type === 'custom' && searchParams.formId) {
			dispatch(requestGetCustomApplications(searchParams.formId));
			dispatch(requestVendor(auth.user_id));
			dispatch(requestUserGroup(auth.email));
		} else if (searchParams && searchParams.type !== 'custom' && app_group_id && auth.user_id) {
			dispatch(requestVendor(auth.user_id));
			dispatch(requestUserGroup(auth.email));
		}
	}, []);

	useEffect(() => {
		if (vendors && vendors.length > 0) {
			console.log('REQUEST GET APPLICATIONSSS', vendors);
			//dispatch(requestGetApplications(vendors[0].id));
		}
	}, [vendors]);

	useEffect(() => {
		console.log('useEffect app_group_id', app_group_id);
		if (searchParams && searchParams.type !== 'custom' && app_group_id && !attendance.isLoading) {
			dispatch(requestAttendance(app_group_id, 'bcombs'));
			dispatch(requestEventAttendance(app_group_id));
		} else if (searchParams.formId) {
			dispatch(requestAttendance(searchParams.formId, 'forms'));
		}
	}, []);
	console.log('applicationszzzz', applications);
	useEffect(() => {
		if (attendance.list) {
			console.log('Attendaance Listtt', attendance);
			console.log('Attendaance Listtt applications.activeapplications', applications);
			let currentAttendance = attendance.list.reduce((accum, att) => {
				let attDate = format(new Date(parseInt(att.attendance_date)), DATE_FORMAT);
				attDate = attDate.replaceAll('-', '_');

				let formApplication = {};

				if (searchParams && searchParams.type === 'custom') {
					formApplication = applications.activeapplications.find(item => item.app_id === att.child_id);
				}
				console.log('formApplication', formApplication);
				return {
					...accum,
					[att.child_id]: {
						...att,
						fullname: `${att.firstname} ${att.lastname}`,
						// total_volunteer_hours:
						// 	((accum[att.child_id] && accum[att.child_id].total_volunteer_hours) || 0) + att.volunteer_hours || 0,
						// total_mentoring_hours:
						// 	((accum[att.child_id] && accum[att.child_id].total_mentoring_hours) || 0) + att.mentoring_hours || 0,
						attendance: {
							...((accum[att.child_id] && accum[att.child_id].attendance) || {}),
							[attDate]: {
								status: att.attendance_status,
								mentoring_hours: att.mentoring_hours,
								volunteer_hours: att.volunteer_hours,
								is_excused: att.is_excused,
							},
						},
						custom: {
							...(formApplication || {}),
						},
					},
				};
			}, {});

			currentAttendance = Object.keys(currentAttendance)
				.map(key => {
					return currentAttendance[key];
				})
				.map(att => {
					const dateKeys = Object.keys(att.attendance);
					const filteredDate = dateKeys.filter(key => {
						return isWithinInterval(new Date(key.replaceAll('_', '-')), {
							start: new Date('2020-08-01'),
							end: new Date('2021-07-31'),
						});
					});
					console.log('Total Hourssss filteredDate', filteredDate);
					const totalHours = filteredDate.reduce(
						(accum, key) => {
							return {
								total_volunteer_hours: accum.total_volunteer_hours + att.attendance[key].volunteer_hours || 0,
								total_mentoring_hours: accum.total_mentoring_hours + att.attendance[key].mentoring_hours || 0,
							};
						},
						{ total_volunteer_hours: 0, total_mentoring_hours: 0 }
					);

					console.log('Total Hourssss', totalHours);

					return {
						...att,
						...totalHours,
					};
				});

			let displayDayList = attendance.list.map(att => format(new Date(parseInt(att.attendance_date)), DATE_FORMAT));
			displayDayList = [...new Set(displayDayList)].sort();

			setDisplayDays(displayDayList);
			setAttendanceDisplay(currentAttendance);
			setDefaultAttendanceDisplay(currentAttendance);

			if (displayDayList.length <= 3) {
				setCurrentDisplayDays(displayDayList);
			} else {
				setCurrentDisplayDays([displayDayList[0], displayDayList[1], displayDayList[2]]);
			}
		}
	}, [attendance.list, applications]);

	useEffect(() => {
		if (attendance.eventAttendanceList) {
			const updatedEvents = attendance.eventAttendanceList.map(event => {
				return {
					...event,
					start_of_event: format(new Date(parseInt(event.start_of_event)), DATE_FORMAT),
					end_of_event: format(new Date(parseInt(event.end_of_event)), DATE_FORMAT),
				};
			});
			setEvents(updatedEvents);
			setDefaultEvents(updatedEvents);
		}
	}, [attendance.eventAttendanceList]);

	useEffect(() => {
		handleChangeDateFilter({
			start: new Date('2020-08-01'),
			end: new Date('2021-07-31'),
		});
	}, [defaultEvents, defaultAttendanceDisplay]);

	const renderTableData = () => {
		console.log('Render Table Data', attendanceDisplay);
		console.log('Render Table Data displayDays', displayDays);
		let formattedDateKeys = currentDisplayDays.map(key => format(new Date(key), DATE_KEY_FORMAT));

		console.log('Render Table Data attendanceDisplay', attendanceDisplay);
		console.log('attendanceSummary', attendanceSummary);
		return attendanceDisplay.map((att, index) => {
			// let totalPresent = null;
			// let totalAttendance = null;
			// if(events.length > 0) {

			// 	totalPresent = defaultAttendanceDisplay.reduce((accum,defaultAtt) => {
			// 		if(	att && defaultAtt.child_id === att.child_id) {
			// 			let result = Object.keys(defaultAtt.attendance).filter(key => {
			// 				let dashedDate = key.replaceAll('_','-');

			// 				const hasEvent = events.find( event => dashedDate === event.start_of_event);

			// 				return hasEvent && (att.attendance[key] && (att.attendance[key].status === 'Present' || att.attendance[key].is_excused === 1));
			// 			}).length || 0;
			// 			return accum + result
			// 		}
			// 		return accum;
			// 	},0)

			// 	totalAttendance = events.length || 0;
			// }
			// else {
			// 	totalPresent = Object.keys(att.attendance).filter(key => {
			// 		return att.attendance[key] && (att.attendance[key].status === 'Present' || att.attendance[key].is_excused === 1);
			// 	}).length || 0;
			// 	totalAttendance = Object.keys(att.attendance).length || 0;
			// }
			//  app.form_contents?.formData[0]?.fields[0]?.value
			let summaryTotal = 0;
			if (attendanceSummary[att.child_id]) {
				summaryTotal = (
					(attendanceSummary[att.child_id].total_present * 100) /
					attendanceSummary[att.child_id].total_attendance
				).toFixed(2);
				summaryTotal = !isNaN(summaryTotal) ? summaryTotal : 0;
			}
			console.log('attendanceSummary', attendanceSummary);
			console.log('formattedDateKeys', formattedDateKeys);
			return (
				<tr key={index}>
					<td className="subHeader">
						<table className="subTable">
							<tr>
								<td style={{ width: 250 }}>
									<div className="name">
										<a href={'#'}>{`${
											searchParams && searchParams.type !== 'custom' && att.firstname && att.lastname
												? `${att.firstname} ${att.lastname}`
												: att.custom?.form_contents?.formData[0]?.fields[0]?.value
										}`}</a>
									</div>
								</td>
								<td>
									<div className="class">{att.app_group_name}</div>
								</td>
							</tr>
						</table>
					</td>

					<td className="subHeader">
						<table className="subTable">
							<tr>
								<td>
									{attendanceSummary[att.child_id] && (
										<div className="summary">
											{`${summaryTotal}%`} ({attendanceSummary[att.child_id].total_present}/
											{attendanceSummary[att.child_id].total_attendance})
										</div>
									)}
								</td>
								<td style={{ width: '380px' }}>
									<div className="attendance-status-container">
										{currentDisplayDays.length > 0 && (
											<div>
												<div style={{ position: 'relative' }}>
													{' '}
													{(att.attendance[formattedDateKeys[0]] &&
														att.attendance[formattedDateKeys[0]].status !== null && (
															<div>
																<AttendanceIcon
																	color={attendanceColor[att.attendance[formattedDateKeys[0]].status.toLowerCase()]}
																/>

																{(att.attendance[formattedDateKeys[0]].status === 'Absent' ||
																	att.attendance[formattedDateKeys[0]].status === 'Tardy') &&
																att.attendance[formattedDateKeys[0]].is_excused === 1 ? (
																	<div className="exclude-icon"></div>
																) : (
																	<span />
																)}
															</div>
														)) || <AttendanceIcon />}
												</div>
											</div>
										)}
										{currentDisplayDays.length >= 2 && (
											<div>
												{(att.attendance[formattedDateKeys[1]] &&
													att.attendance[formattedDateKeys[1]].status !== null && (
														<div style={{ position: 'relative' }}>
															<AttendanceIcon
																color={attendanceColor[att.attendance[formattedDateKeys[1]].status.toLowerCase()]}
															/>

															{(att.attendance[formattedDateKeys[1]].status === 'Absent' ||
																att.attendance[formattedDateKeys[1]].status === 'Tardy') &&
															att.attendance[formattedDateKeys[1]].is_excused === 1 ? (
																<div className="exclude-icon"></div>
															) : (
																<span />
															)}
														</div>
													)) || <AttendanceIcon />}
											</div>
										)}

										{currentDisplayDays.length >= 3 && (
											<div>
												{(att.attendance[formattedDateKeys[2]] &&
													att.attendance[formattedDateKeys[2]].status !== null && (
														<div style={{ position: 'relative' }}>
															<AttendanceIcon
																color={attendanceColor[att.attendance[formattedDateKeys[2]].status.toLowerCase()]}
															/>

															{(att.attendance[formattedDateKeys[2]].status === 'Absent' ||
																att.attendance[formattedDateKeys[2]].status === 'Tardy') &&
															att.attendance[formattedDateKeys[2]].is_excused === 1 ? (
																<div className="exclude-icon"></div>
															) : (
																<span />
															)}
														</div>
													)) || <AttendanceIcon />}
											</div>
										)}
									</div>
								</td>
							</tr>
						</table>
					</td>
					{/* <td>{format(new Date(parseInt(att.attendance_date)), DATE_FORMAT)}</td> */}

					<td className="subHeader">
						<table className="subTable">
							<tr>
								<td style={{ width: '100px' }}> {Math.round(att.total_volunteer_hours)}</td>
								<td style={{ width: '100px' }}> {Math.round(att.total_mentoring_hours)}</td>
							</tr>
						</table>
					</td>
				</tr>
			);
		});
	};

	// const handlePreviousDate = () => {
	// 	setDisplayDays([subDays(displayDays[0], 1), subDays(displayDays[1], 1), subDays(displayDays[2], 1)]);
	// };
	// const handleNextDate = () => {
	// 	setDisplayDays([addDays(displayDays[0], 1), addDays(displayDays[1], 1), addDays(displayDays[2], 1)]);
	// };

	const handlePreviousDate = () => {
		//setDisplayDays([subDays(displayDays[0], 1), subDays(displayDays[1], 1), subDays(displayDays[2], 1)]);

		if (displayDayIndex[0] > 0 && displayDays.length > 3) {
			let first = displayDayIndex[0] - 1;
			let second = displayDayIndex[1] - 1;
			let third = displayDayIndex[2] - 1;
			setCurrentDisplayDays([displayDays[first], displayDays[second], displayDays[third]]);
			setDisplayDayIndex([first, second, third]);
		}
	};
	const handleNextDate = () => {
		//setDisplayDays([addDays(displayDays[0], 1), addDays(displayDays[1], 1), addDays(displayDays[2], 1)]);

		if (
			displayDayIndex[2] === displayDayIndex[displayDayIndex.length - 1] &&
			displayDayIndex[displayDayIndex.length - 1] < displayDays.length - 1 &&
			displayDays.length > 3
		) {
			let first = displayDayIndex[0] + 1;
			let second = displayDayIndex[1] + 1;
			let third = displayDayIndex[2] + 1;

			setCurrentDisplayDays([displayDays[first], displayDays[second], displayDays[third]]);
			setDisplayDayIndex([first, second, third]);
		}
	};

	const handleSearchChange = e => {
		const { value } = e.target;
		if (value === '') {
			setAttendanceDisplay(defaultAttendanceDisplay);
		} else {
			let lowerCaseValue = value.toLowerCase();

			const list = defaultAttendanceDisplay.filter(
				item => item.fullname && item.fullname.toLowerCase().includes(lowerCaseValue)
			);
			setAttendanceDisplay(list);
		}
	};

	const handleLeftCustomRangeDatePickerChange = (name, value) => {
		const payload = {
			...selectedSummaryRangeDate,
			[name]: value,
		};

		console.log(
			'handleLeftCustomRangeDatePickerChange isAfter',
			isAfter(new Date(payload.end), new Date(payload.start))
		);
		if (
			isEqual(new Date(payload.start), new Date(payload.end)) ||
			isAfter(new Date(payload.end), new Date(payload.start))
		) {
			handleChangeDateFilter(payload);
		}
	};
	const handleRightCustomRangeDatePickerChange = (name, value) => {
		const payload = {
			...selectedRangeDate,
			[name]: value,
		};

		console.log(
			'handleLeftCustomRangeDatePickerChange isAfter',
			isAfter(new Date(payload.end), new Date(payload.start))
		);
		if (
			isEqual(new Date(payload.start), new Date(payload.end)) ||
			isAfter(new Date(payload.end), new Date(payload.start))
		) {
			handleChangeRangeDate(payload);
		}
	};

	const handleChangeDateFilter = date => {
		console.log('handleChangeDateFilter date', date);
		console.log('handleChangeDateFilter defaultAttendanceDisplay', defaultAttendanceDisplay);
		if (Object.keys(date).length === 0) {
			setAttendanceDisplay(defaultAttendanceDisplay);
			setSelectedSummaryRangeDate({
				start: new Date('2020-08-01'),
				end: new Date('2021-07-31'),
			});

			//setDisplayDays(DEFAULT_DISPLAY_DAYS);
			//setCurrentDisplayDays(displayDays)
			if (displayDays.length <= 3) {
				setCurrentDisplayDays(displayDays);
			} else {
				setCurrentDisplayDays([displayDays[0], displayDays[1], displayDays[2]]);
			}
			return;
		}

		if (defaultEvents.length > 0) {
			let filteredEvents = defaultEvents.filter(event => {
				console.log('Formatted Date event', new Date(event.start_of_event));
				console.log('Formatted Date start', new Date(date.start));
				console.log('Formatted Date end', new Date(date.end));
				let response = isWithinInterval(new Date(event.start_of_event), {
					// start:  subDays(new Date(date.start), 1),
					// end: addDays(new Date(date.end), 1)
					start: new Date(date.start),
					end: new Date(date.end),
				});
				console.log('Formatted Date response', response);
				return response;
			});
			console.log('Filtered Events1111 defaultEvents', defaultEvents);
			console.log('Filtered Events1111', filteredEvents);

			// ------------------------------------------- //

			let totalPresent = null;
			let totalAttendance = null;
			if (filteredEvents.length > 0) {
				totalAttendance = filteredEvents.length || 0;
				let childEventAttendance = defaultAttendanceDisplay.reduce((accum, defaultAtt) => {
					let totalPresent =
						Object.keys(defaultAtt.attendance).filter(key => {
							let dashedDate = key.replaceAll('_', '-');
							console.log('dashedDate', dashedDate);
							console.log('dashedDate 2', filteredEvents);
							const hasEvent = filteredEvents.find(event => dashedDate === event.start_of_event);

							return (
								hasEvent &&
								defaultAtt.attendance[key] &&
								(defaultAtt.attendance[key].status === 'Present' || defaultAtt.attendance[key].is_excused === 1)
							);
						}).length || 0;
					console.log('totalPresent', totalPresent);
					return {
						...accum,
						[defaultAtt.child_id]: {
							...(accum[defaultAtt.child_id] || {}),
							total_present:
								accum[defaultAtt.child_id] && accum[defaultAtt.child_id].total_present
									? accum[defaultAtt.child_id].total_present + totalPresent
									: totalPresent,
							total_attendance: totalAttendance,
						},
					};
				}, {});

				setAttendanceSummary(childEventAttendance);

				console.log('childEventAttendance', childEventAttendance);
			} else {
				attendanceSummyByAttendance(date);
			}

			setEvents(filteredEvents);
		} else {
			attendanceSummyByAttendance(date);
		}

		//setSelectedSummaryRangeDate([new Date(date[0]), new Date(date[1])]);
		//console.log('selectedSummaryRangeDate',selectedSummaryRangeDate)
		console.log('DATEEEEEEEE', date);
		setSelectedSummaryRangeDate(date);
	};

	const attendanceSummyByAttendance = date => {
		const updatedAttendanceDisplay = defaultAttendanceDisplay.map(att => {
			const dateKeys = Object.keys(att.attendance);
			const filteredDate = dateKeys.filter(key => {
				return isWithinInterval(new Date(key.replaceAll('_', '-')), {
					start: subDays(new Date(date.start), 1),
					end: addDays(new Date(date.end), 1),
				});
			});
			const totalHours = filteredDate.reduce(
				(accum, key) => {
					return {
						total_volunteer_hours: accum.total_volunteer_hours + att.attendance[key].volunteer_hours || 0,
						total_mentoring_hours: accum.total_mentoring_hours + att.attendance[key].mentoring_hours || 0,
					};
				},
				{ total_volunteer_hours: 0, total_mentoring_hours: 0 }
			);

			return {
				...att,
				...totalHours,
				attendance: filteredDate.reduce((accum, key) => {
					return {
						...(accum || {}),
						[key]: {
							...(att.attendance[key] || {}),
						},
					};
				}, {}),
			};
		});

		console.log('updatedAttendanceDisplazzzzy', updatedAttendanceDisplay);

		let childEventAttendance = updatedAttendanceDisplay.reduce((accum, att) => {
			console.log('ACCUMMM', accum);
			let totalAttendance = Object.keys(att.attendance).length || 0;
			let totalPresent =
				Object.keys(att.attendance).filter(key => {
					return (
						att.attendance[key] && (att.attendance[key].status === 'Present' || att.attendance[key].is_excused === 1)
					);
				}).length || 0;

			return {
				...accum,
				[att.child_id]: {
					...(accum[att.child_id] || {}),
					total_mentoring_hours: att.total_mentoring_hours,
					total_volunteer_hours: att.total_volunteer_hours,
					total_present:
						accum[att.child_id] && accum[att.child_id].total_present
							? accum[att.child_id].total_present + totalPresent
							: totalPresent,
					total_attendance: totalAttendance,
				},
			};
		}, {});

		console.log('childEventAttendance123123123123123', childEventAttendance);
		setAttendanceSummary(childEventAttendance);
	};

	const handleChangeRangeDate = date => {
		if (!date.start && !date.end) {
			setSelectedRangeDate({ start: new Date(), end: new Date() });
			if (displayDayList.length <= 3) {
				setCurrentDisplayDays(displayDayList);
			} else {
				setCurrentDisplayDays([displayDayList[0], displayDayList[1], displayDayList[2]]);
			}
			return;
		}
		const updatedAttendanceDisplay = defaultAttendanceDisplay.map(att => {
			const dateKeys = Object.keys(att.attendance);
			const filteredDate = dateKeys.filter(key => {
				return isWithinInterval(new Date(key.replaceAll('_', '-')), {
					start: subDays(new Date(date.start), 1),
					end: addDays(new Date(date.end), 1),
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
						...(accum || {}),
						[key]: {
							...(att.attendance[key] || {}),
						},
					};
				}, {}),
			};
		});
		setAttendanceDisplay(updatedAttendanceDisplay);
		// console.log('Dayzzzzzzz', currentDisplayDays)
		// console.log('Dayzzzzzzz 222', displayDays)
		// setCurrentDisplayDays([
		// 	new Date(date[0]),
		// 	addDays(new Date(new Date(date[0])), 1),
		// 	addDays(new Date(new Date(date[0])), 2),
		// ]);

		setSelectedRangeDate({ start: new Date(date.start), end: new Date(date.end) });
	};

	const handleRightCalendar = () => {
		setIsRightCalendarVisible(!isRightCalendarVisible);
	};

	console.log('currentDisplayDays', currentDisplayDays);
	return (
		<AttendanceSummaryStyled>
			<h2>Attendance Summary</h2>
			<div id="attendance-summary">
				<Link to={'/dashboard/attendance'} className="back-btn">
					<FontAwesomeIcon className="back-icon" icon={faAngleLeft} />
					Back
				</Link>
				<div className="filter-container">
					<div className="field custom-range-picker" style={{ width: 150 }}>
						<CustomRangePicker
							onChange={value => {
								handleLeftCustomRangeDatePickerChange('start', value);
							}}
							placeholder="From"
							selected={selectedSummaryRangeDate.start}
						/>
					</div>

					<div className="field custom-range-picker" style={{ width: 150 }}>
						<CustomRangePicker
							onChange={value => {
								handleLeftCustomRangeDatePickerChange('end', value);
							}}
							placeholder="To"
							selected={selectedSummaryRangeDate.end}
						/>
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
						<FontAwesomeIcon className="search-icon" icon={faSearch} />
					</div>

					<div style={{ width: 400 }}>
						{isRightCalendarVisible && (
							// <CustomRangeDatePicker
							// 	format={DISPLAY_DATE_FORMAT}
							// 	value={selectedRangeDate}
							// 	onChange={handleChangeRangeDate}
							// />
							<>
								<div className="field custom-range-picker" style={{ display: 'inline-block' }}>
									<CustomRangePicker
										onChange={value => {
											handleRightCustomRangeDatePickerChange('start', value);
										}}
										placeholder="From"
										selected={selectedRangeDate.start}
									/>
								</div>

								<div className="field custom-range-picker" style={{ display: 'inline-block' }}>
									<CustomRangePicker
										onChange={value => {
											handleRightCustomRangeDatePickerChange('end', value);
										}}
										placeholder="To"
										selected={selectedRangeDate.end}
									/>
								</div>
							</>
						)}
					</div>
				</div>
				<div style={{ marginBottom: 12, marginLeft: 8 }}>
					<span
						style={{ cursor: 'pointer' }}
						onClick={() => {
							handleChangeDateFilter(DEFAULT_DATE);
						}}>
						Set Default Date
					</span>

					{isRightCalendarVisible && <span
						style={{ cursor: 'pointer', float: 'right', marginRight:70 }}
						onClick={() => {
							handleChangeRangeDate({
								start: new Date(),
								end: new Date()
							});
						}}>
						Set Default Date
					</span>}
				</div>
				<div id="attendance-summary-list">
					<table id="attendance-table">
						<tbody>
							<tr>
								<th>Student</th>
								<th>
									Attendance Status{' '}
									<span onClick={handleRightCalendar} style={{ cursor: 'pointer' }}>
										<FontAwesomeIcon style={{ color: isRightCalendarVisible ? 'gray' : 'white' }} icon={faClock} />
									</span>
								</th>
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
											<td style={{ width: '380px', padding: '0' }}>
												<div className="attendance-status-container">
													{currentDisplayDays.map((date, index) => {
														return (
															<div className="date">
																{index === 0 && (
																	<span onClick={handlePreviousDate} style={{ cursor: 'pointer', marginRight: '1rem' }}>
																		<FontAwesomeIcon className="search-icon" icon={faAngleLeft} />
																	</span>
																)}
																{format(new Date(date), DISPLAY_DATE_FORMAT)}
																{index === 2 && (
																	<span onClick={handleNextDate} style={{ cursor: 'pointer', marginLeft: '1rem' }}>
																		<FontAwesomeIcon className="search-icon" icon={faAngleRight} />
																	</span>
																)}
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
