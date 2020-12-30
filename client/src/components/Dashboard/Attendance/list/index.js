import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from '@reach/router';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { faAngleRight, faAngleLeft, faCalendar, faSearch } from '@fortawesome/free-solid-svg-icons';

import DataTable from 'react-data-table-component';

import { requestAttendance, requestUpdateAttendance } from '../../../../redux/actions/Attendance';
import { requestVendor } from '../../../../redux/actions/Vendors';
import { requestGetApplications } from '../../../../redux/actions/Application';
import { requestUserGroup } from '../../../../redux/actions/Groups';

import ProfileImg from '../../../../images/defaultprofile.png';

import CustomDatePicker from '../../../../helpers/CustomDatePicker';

const DATE_FORMAT = 'yyyy-MM-dd';

const ClassListViewStyled = styled.div`
	width: auto;
	max-width: 1920px;
	margin: auto;
	padding: 0rem 3em 2rem;

	#attendanceContainer {
		position: relative;
		padding: 1rem;
		background-color: #fff;
		box-shadow: 0 0 25px #eae9e9;
		min-height: calc(100vh - 220px);
	}
	#attendanceContainer .back-btn {
		width: 50px;
		color: #3e89fe;
		display: flex;
		align-items: center;
		padding-bottom: 1rem;
		text-decoration: none;
	}
	#attendanceContainer .back-btn svg {
		padding-right: 5px;
	}

	.field {
		padding: 5px !important;
		margin: 5px !important;
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

	.react-datetimerange-picker,
	.react-date-picker,
	.react-time-picker {
		width: 100%;
	}
	.react-datetimerange-picker button,
	.react-date-picker button,
	.react-time-picker button {
		width: inherit;
		color: initial;
		background-color: initial;
		box-shadow: initial;
		border-radius: initial;
	}
	.react-datetimerange-picker,
	.react-date-picker,
	.react-time-picker {
		border: none;
		width: 100%;
		margin: 1em 0 1em 0;
	}
	.react-datetimerange-picker input,
	.react-date-picker input,
	.react-time-picker input {
		margin: 0;
		width: initial;
		border-bottom: none;
	}
	.react-datetimerange-picker__wrapper,
	.react-date-picker__wrapper,
	.react-time-picker__wrapper {
		border: none;
	}

	.react-calendar .react-calendar__tile--active,
	.react-calendar__tile--rangeStart {
		background-color: #f26e21 !important;
		color: white !important;
	}

	.react-datetimerange-picker__inputGroup__input--hasLeadingZero,
	.react-date-picker__inputGroup__input--hasLeadingZero,
	.react-time-picker__inputGroup__input--hasLeadingZero {
		padding: 0;
	}
	.react-date-picker__inputGroup__input,
	.react-time-picker__inputGroup__input,
	.react-datetimerange-picker__inputGroup__input {
		display: inline !important;
		transition: none !important;
	}

	.react-calendar__tile--active:enabled:focus {
		background-color: #f26e21;
		color: white;
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
	.required {
		color: red;
	}
	.filter-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	}

	.search-field-container {
		display: flex;
		align-items: baseline;
	}
	.search-field-container .field {
		flex: 1;
		position: relative;
	}
	.search-field-container .field svg.search-icon {
		position: absolute;
		bottom: 20px;
		right: 15px;
		color: gray;
	}

	.search-field-container .select-field-wrapper {
		position: relative;
	}
	.search-field-container .select-field-wrapper:after {
		content: '\f078';
		position: absolute;
		right: 0;
		bottom: 18px;
		font-size: 10px;
		color: #555;
		font-family: 'fontawesome';
	}
	.search-field-container .select-field-wrapper label {
		position: absolute;
		top: -10px;
		color: grey;
		font-size: 12px;
	}
	.search-field-container .select-field-wrapper select {
		-webkit-appearance: none !important;
		-moz-appearance: none !important;
	}

	.actionBtn button {
		// width: 120px;
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

	.circle-icon {
		border-radius: 50%;
		width: 15px;
		height: 15px;
		margin: 0 auto;
	}
	.gridView .block .extra_activitybox {
		text-align: center;
	}

	.gridView {
		margin-top: 3rem;
		display: grid;
		grid-gap: 18px;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
		max-width: 120px;
		width: 100%;
	}
	.gridView .block .extra_activitybox .attendance-name {
		padding-bottom: 1rem;
	}
	.gridView .block .extra_activitybox .attendance-name a {
		color: #000;
		font-weight: 600;
		text-decoration: none;
		transition: 0.15s ease-in-out;
	}
	.gridView .block .extra_activitybox .attendance-name a:hover {
		color: #f5812f;
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
	.gridView .block .extra_activitybox .attendance-hours .field > input {
		text-align: center;
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

	// media query
	@media (max-width: 840px) {
		padding: 0rem 1rem 2rem;
	}

	#listView {
		text-align: center;
		font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif;
		border-collapse: collapse;
		width: 100%;
		border: 0;
		margin-top: 3rem;
	}

	#listView td,
	#listView th {
		border: 0;
		padding: 15px;
		width: 200px;
	}

	#listView th:not(:last-child) {
		border-right: 1px solid rgb(255 255 255 / 65%);
	}

	#listView tr:nth-child(odd) {
		background-color: #f9f9f9;
	}

	#listView th {
		text-align: center;
		background-color: #f26e21;
		color: white;
	}

	#listView a {
		color: #3e89fe;
		text-decoration: none;
	}

	.attendance-status-container,
	.attendance-hours-container {
		display: flex;
	}
	.attendance-status-container > div {
		width: 33.33%;
	}

	.attendance-hours-container > div {
		width: 50%;
	}
	.listViewTableContainer {
		overflow-x: auto;
	}
	.listViewTableContainer::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}
	.listViewTableContainer::-webkit-scrollbar-track {
		border-radius: 10px;
		transition: 0.5s ease-in-out;
		background: rgb(243 110 34 / 20%);
	}
	.listViewTableContainer::-webkit-scrollbar-thumb {
		background: #f36e22;
		border-radius: 10px;
	}

	.exclude-icon {
		position: absolute;
		background-color: black;
		width: 3px;
		height: 20px;
		z-index: 200;
		top: -2px;
		margin-left: 48%;
		transform: rotateY(0deg) rotate(45deg);
	}
`;

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

const DateCustomInput = ({ value, onClick, name, className, placeholder, register }) => (
	<div className="field">
		<input
			defaultValue={value}
			onClick={onClick}
			name={name}
			className={className}
			placeholder="mm/dd/yyyy"
			readOnly={true}
			id={`attendance_date`}
			ref={register({ required: true })}
		/>
		<label className="field-label" for={`attendance_date`}>
			<span className="required">*</span> Date
		</label>
		<FontAwesomeIcon icon={faCalendar} className="calendar-icon" />
	</div>
);

const style = {
	attendanceAction: {
		cursor: 'pointer',
	},
	attendanceSubAction: {
		marginTop: '8px',
		fontSize: '12px',
		cursor: 'pointer',
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
};

export default function index() {
	const { register, handleSubmit, errors, clearError, setError, reset } = useForm({
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
	});
	const { name, vendor_id } = useParams();
	const { attendance, auth, vendors, groups, applications, loading } = useSelector(
		({ attendance, auth, vendors, applications, groups, loading }) => {
			return { attendance, auth, vendors, applications, groups, loading };
		}
	);
	const [attendanceDetails, setAttendanceDetails] = useState({
		attendance_date: null,
		attendance_start_time: null,
		attendance_end_time: null,
		event_name: null,
		location: null,
	});
	const [appGroupId, setAppGroupId] = useState('');
	const [applicationList, setApplicationList] = useState([]);
	const [defaultApplicationList, setDefaultApplicationList] = useState([]);
	const [filteredApplicationList, setFilteredApplicationList] = useState([]);
	const [viewMode, setViewMode] = useState('grid');
	const dispatch = useDispatch();

	useEffect(() => {
		if (auth.user_id) {
			dispatch(requestVendor(auth.user_id));
			dispatch(requestUserGroup(auth.email));
		}
	}, []);

	useEffect(() => {
		if (vendors && vendors.length > 0) {
			let vendorId;
			for (const vendor of vendors) {
				if (vendor.id2 == vendor_id) {
					vendorId = vendor.id;
					break;
				}
			}
			dispatch(requestGetApplications(vendorId));
		}
	}, [vendors]);

	useEffect(() => {
		if (appGroupId !== '') {
			dispatch(requestAttendance(appGroupId));
		}
	}, [appGroupId]);

	useEffect(() => {
		if (applications && applications.activeapplications.length > 0) {
			let currentAppGroupId = '';

			if (groups && groups.application_groups && groups.application_groups.length > 0) {
				const applicationGroups = groups.application_groups;

				for (const group of applicationGroups) {
					if (group.name === name) {
						currentAppGroupId = group.app_grp_id;
						break;
					}
				}
			}

			let filterApplications = applications.activeapplications.filter(application => {
				return application && application.class_teacher == currentAppGroupId;
			});

			filterApplications = filterApplications.map(item => {
				let currentAttendance = attendance.list.find(att => att.child_id === item.child.ch_id);
				item.class_teacher = name;
				return item;
			});

			setApplicationList(filterApplications);
			setAppGroupId(currentAppGroupId);
		}
	}, [applications]);

	useEffect(() => {
		if (attendance.list) {
			let updatedApplicationList = applicationList.map(application => {
				let currentAttendance = attendance.list.find(att => att.child_id === application.child.ch_id);

				return {
					...application,
					is_following: currentAttendance?.is_following,
				};
			});
			setApplicationList(updatedApplicationList);
			setDefaultApplicationList(updatedApplicationList);
			setFilteredApplicationList(updatedApplicationList);
		}
	}, [attendance.list]);

	useEffect(() => {
		if (attendance.isAttendanceUpdateSuccess) {
			setApplicationList(defaultApplicationList);
		}
	}, [attendance.isAttendanceUpdateSuccess]);

	const handleAttendance = (payload, attendanceType) => {
		let updatedApplication = [...(applicationList || [])];
		let updatedFilteredApplication = [...(filteredApplicationList || [])];
		let currentIndex = updatedApplication.findIndex(app => app.id === payload.id);
		let currentFilteredIndex = updatedFilteredApplication.findIndex(app => app.id === payload.id);
		updatedApplication[currentIndex] = {
			...updatedApplication[currentIndex],
			attendance_status: attendanceType,
			excused: null,
		};
		updatedFilteredApplication[currentFilteredIndex] = {
			...updatedFilteredApplication[currentFilteredIndex],
			attendance_status: attendanceType,
			excused: null,
		};

		setApplicationList(updatedApplication);
		setFilteredApplicationList(updatedFilteredApplication);
	};

	const handleHours = (payload, hours, type = 'volunteer_hours') => {
		console.log('Handl');
		let updatedApplication = [...(applicationList || [])];
		let updatedFilteredApplication = [...(filteredApplicationList || [])];
		let currentIndex = updatedApplication.findIndex(app => app.id === payload.id);
		let currentFilteredIndex = updatedFilteredApplication.findIndex(app => app.id === payload.id);
		console.log('Handle Hours', hours);
		console.log('Handle Hours Type', type);
		updatedApplication[currentIndex] = {
			...updatedApplication[currentIndex],
			[type]: hours,
		};
		updatedFilteredApplication[currentFilteredIndex] = {
			...updatedFilteredApplication[currentFilteredIndex],
			[type]: hours,
		};
		console.log('Handle Hours updatedApplication 11', updatedApplication[currentIndex]);
		console.log('Handle Hours updatedApplication 22', updatedFilteredApplication[currentFilteredIndex]);
		setApplicationList(updatedApplication);
		setFilteredApplicationList(updatedFilteredApplication);
	};

	const onSubmit = e => {
		reset();

		const attendanceList = applicationList.map(app => {
			return {
				app_id: app.app_id,
				attendance_status: app.attendance_status || '',
				child_id: app.child.ch_id,
				vendor: app.vendor,
				volunteer_hours: app.volunteer_hours ? parseInt(app.volunteer_hours) : 0,
				mentoring_hours: app.mentoring_hours ? parseInt(app.mentoring_hours) : 0,
				is_excused: app.excused ? 1 : 0,
			};
		});

		const payload = {
			attendance_list: attendanceList,
			app_group_id: appGroupId,
			...attendanceDetails,
			attendance_date: format(new Date(attendanceDetails.attendance_date), DATE_FORMAT),
		};

		dispatch(requestUpdateAttendance(payload));
	};

	const handleAttedanceDetailChange = e => {
		const { name, value } = e.target;

		setAttendanceDetails({
			...attendanceDetails,
			[name]: value,
		});
	};

	const handleExcused = (payload, excuseType) => {
		let updatedApplication = [...(applicationList || [])];
		let updatedFilteredApplication = [...(filteredApplicationList || [])];
		let currentIndex = updatedApplication.findIndex(app => app.id === payload.id);
		let currentFilteredIndex = updatedFilteredApplication.findIndex(app => app.id === payload.id);

		if (excuseType === updatedApplication[currentIndex].attendance_status.toLowerCase()) {
			updatedApplication[currentIndex] = {
				...updatedApplication[currentIndex],
				excused: updatedApplication[currentIndex].excused === null ? excuseType : null,
			};
			updatedFilteredApplication[currentFilteredIndex] = {
				...updatedFilteredApplication[currentFilteredIndex],
				excused: updatedFilteredApplication[currentIndex].excused === null ? excuseType : null,
			};

			setApplicationList(updatedApplication);
			setFilteredApplicationList(updatedFilteredApplication);
		}
	};

	const handleSearchChange = e => {
		let { name, value } = e.target;
		let lowerCaseVale = value;

		if (value !== '') {
			value = value.toLowerCase();
			const filteredApplication = applicationList.filter(app => {
				if (app.child) {
					return app.child.lastname.toLowerCase().includes(value) || app.child.firstname.toLowerCase().includes(value);
				}
			});
			setFilteredApplicationList(filteredApplication);
		} else {
			setFilteredApplicationList(applicationList);
		}
	};

	const handleViewChange = e => {
		console.log('Handle View Change Value', e.target.value);
		setViewMode(e.target.value);
	};

	const renderTableData = () => {
		return filteredApplicationList.map((app, index) => {
			return (
				<tr key={index}>
					<td>
						<span>{app.child?.firstname + ' ' + app.child?.lastname}</span>
					</td>
					<td>{app.class_teacher}</td>
					<td>
						<span>{
							app.is_following === 1 ? (
								<div className="circle-icon" style={{ ...style.attendanceAction, backgroundColor: 'green' }}></div>
							) : app.is_following === 2 ? (
								<div className="circle-icon" style={{ ...style.attendanceAction, backgroundColor: '#f26e21' }}></div>
							) : (
								<span />
							)
						}</span>
					</td>
					<td style={{ width: '300px' }}>
						<div className="attendance-status-container">
							<div>
								<div style={{ position: 'relative'}}>
									<div
										className="circle-icon"
										onClick={() => {
											handleAttendance(app, 'Present');
										}}
										style={{ ...style.attendanceAction, backgroundColor: 'green' }}></div>
									{app.attendance_status === 'Present' ? <div className="exclude-icon"></div> : <span />}
								</div>
							</div>
							<div style={{ minHeight: 22 }}>
								<div style={{ position: 'relative'}}>
									<div
										className="circle-icon"
										onClick={() => {
											handleAttendance(app, 'Absent');
										}}
										style={{ ...style.attendanceAction, backgroundColor: 'red' }}></div>
									{app.attendance_status === 'Absent' ? <div className="exclude-icon"></div> : <span />}
								</div>
								<div>
									<div
										onClick={() => {
											handleExcused(app, 'absent');
										}}
										style={style.attendanceSubAction}>
										<div
											className="circle-icon"
											style={{
												...style.miniCircleIcon,
												backgroundColor: app.excused === 'absent' ? 'green' : 'gray',
											}}
										/>
										Excused
									</div>
								</div>
							</div>
							<div style={{ minHeight: 22 }}>
								<div style={{ position: 'relative'}}>
									<div
										className="circle-icon"
										onClick={() => {
											handleAttendance(app, 'Tardy');
										}}
										style={{ ...style.attendanceAction, backgroundColor: '#f26e21' }}></div>
									{app.attendance_status === 'Tardy' ? <div className="exclude-icon"></div> : <span />}
								</div>

								<div>
									<div
										onClick={() => {
											handleExcused(app, 'tardy');
										}}
										style={style.attendanceSubAction}>
										<div
											className="circle-icon"
											style={{
												...style.miniCircleIcon,
												backgroundColor: app.excused === 'tardy' ? 'green' : 'gray',
											}}
										/>
										Excused
									</div>
								</div>
							</div>
						</div>
					</td>
					{/* <td>
						<div className="attendance-hours-container">
							<div>
								<input
									type="number"
									onChange={e => {
										handleHours(app, e.target.value, 'volunteer_hours');
									}}
									name={'volunteer_hours'}
									className={'field-input'}
									placeholder="Volunteer Hours"
									value={app?.volunteer_hours || '0'}
									style={{ textAlign: 'center' }}
								/>
							</div>
							<div>
								<input
									type="number"
									onChange={e => {
										handleHours(app, e.target.value, 'mentoring_hours');
									}}
									name={'mentoring_hours'}
									className={'field-input'}
									placeholder="Mentoring Hours"
									value={app?.mentoring_hours || '0'}
									style={{ textAlign: 'center' }}
								/>
							</div>
						</div>
					</td> */}

					<td style={{}}>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<input
								type="number"
								onChange={e => {
									handleHours(app, e.target.value, 'volunteer_hours');
								}}
								name={'volunteer_hours'}
								className={'field-input'}
								placeholder="Volunteer Hours"
								value={app?.volunteer_hours || '0'}
								style={{ textAlign: 'center', maxWidth: '200px' }}
							/>
						</div>
					</td>

					<td style={{}}>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<input
								type="number"
								onChange={e => {
									handleHours(app, e.target.value, 'mentoring_hours');
								}}
								name={'mentoring_hours'}
								className={'field-input'}
								placeholder="Mentoring Hours"
								value={app?.mentoring_hours || '0'}
								style={{ textAlign: 'center', maxWidth: '200px' }}
							/>
						</div>
					</td>
				</tr>
			);
		});
	};

	return (
		<ClassListViewStyled>
			<h2>Attendance</h2>
			<div id="attendanceContainer" style={{ marginTop: 12 }}>
				<Link to={'/dashboard/attendance'} className="back-btn">
					<FontAwesomeIcon className="back-icon" icon={faAngleLeft} />
					Back
				</Link>
				<form onSubmit={handleSubmit(onSubmit)}>
					{attendance.isAttendanceUpdateSuccess && <div>Attendance has been updated successfully!</div>}
					<div className="filter-container">
						<div className="field">
							<DatePicker
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
								selected={null}
								disabled={false}
								selected={attendanceDetails.attendance_date}
								onChange={value => {
									setAttendanceDetails({
										...attendanceDetails,
										attendance_date: value,
									});
								}}
								name={'attendance_date'}
								customInput={<DateCustomInput className={'field-input date-field'} register={register} />}
							/>
						</div>
						<div className="field">
							<input
								onChange={handleAttedanceDetailChange}
								ref={register({ required: true })}
								type="time"
								name={'attendance_start_time'}
								className={'field-input'}
								placeholder="Start Name"
							/>
							<label className="field-label" for={`attendance_start_time`}>
								<span className="required">*</span> Start Time
							</label>
						</div>
						<div className="field">
							<input
								onChange={handleAttedanceDetailChange}
								ref={register({ required: true })}
								type="time"
								name={'attendance_end_time'}
								className={'field-input'}
								placeholder="End Time"
							/>
							<label className="field-label" for={`attendance_end_time`}>
								<span className="required">*</span> End Time
							</label>
						</div>
						<div className="field">
							<input
								id="event_name"
								onChange={handleAttedanceDetailChange}
								ref={register({ required: true })}
								name={'event_name'}
								className={'field-input'}
								placeholder="Event Name"
							/>
							<label className="field-label" for={`event_name`}>
								<span className="required">*</span> Event Name
							</label>
						</div>
						<div className="field">
							<input
								id="location"
								onChange={handleAttedanceDetailChange}
								ref={register({ required: true })}
								name={'location'}
								className={'field-input'}
								placeholder="Location"
							/>
							<label className="field-label" for={`location`}>
								<span className="required">*</span> Location
							</label>
						</div>
					</div>

					<div className="field actionBtn">
						{applicationList.length > 0 && (
							<button disabled={attendance.isAttendanceUpdateSuccess} onClick={handleSubmit}>
								{attendance.isAttendanceUpdateSuccess ? 'Please Wait...' : 'Submit'}
							</button>
						)}
					</div>

					<div className="search-field-container">
						<div className="field">
							<input
								id="search"
								name={'search'}
								className={'field-input'}
								onChange={handleSearchChange}
								placeholder="Search"
							/>
							<label className="field-label" for={`search`}>
								Search
							</label>
							<FontAwesomeIcon className="search-icon" icon={faSearch} />
						</div>
						<div className="field select-field-wrapper">
							<select onChange={handleViewChange} className={'field-input'}>
								<option value="grid">Grid View</option>
								<option value="list">List View</option>
							</select>
							{/* <input
								id="event_name"
								onChange={handleAttedanceDetailChange}
								ref={register({ required: true })}
								name={'event_name'}
								className={'field-input'}
								placeholder="Event Name"
							/> */}
							{/* <label className="field-label" for={`event_name`}>
								<span className="required">*</span> Event Name
							</label> */}
						</div>
					</div>

					{viewMode === 'grid' ? (
						<div className="gridView">
							{filteredApplicationList.map(app => {
								return (
									<div className="block">
										<div className="extra_activitybox">
											<div className="img-container" style={{ margin: '0 auto' }}>
												<img src={ProfileImg} />
											</div>

											<div className="attendance-name">
												<a target="_blank" href={'/dashboard/menteeprofile/' + app.id}>
													<span>{app.child?.firstname + ' ' + app.child?.lastname}</span>
												</a>
											</div>

											<div className="attendance-action">
												<div>
													<div
														onClick={() => {
															handleAttendance(app, 'Present');
														}}
														style={style.attendanceAction}>
														<div
															className="circle-icon"
															style={{
																...style.circleIcon,
																backgroundColor: app.attendance_status === 'Present' ? 'green' : 'gray',
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

													<div
														onClick={() => {
															handleExcused(app, 'absent');
														}}
														style={style.attendanceSubAction}>
														<div
															className="circle-icon"
															style={{
																...style.miniCircleIcon,
																backgroundColor: app.excused === 'absent' ? 'green' : 'gray',
															}}
														/>
														Excused
													</div>
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

													<div
														onClick={() => {
															handleExcused(app, 'tardy');
														}}
														style={style.attendanceSubAction}>
														<div
															className="circle-icon"
															style={{
																...style.miniCircleIcon,
																backgroundColor: app.excused === 'tardy' ? 'green' : 'gray',
															}}
														/>
														Excused
													</div>
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
														value={app?.volunteer_hours || '0'}
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
														value={app?.mentoring_hours || '0'}
													/>
													<label className="field-label" for={`mentoring_hrs`}>
														Mentoring Hours
													</label>
												</div>
											</div>

											<div className="attendance-invitation">
												{app.is_following && (
													<div className="calendar-invite">
														Calendar Invite: <span>{`${app.is_following === 1 ? 'Accepted' : 'Declined'}`}</span>
													</div>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className="listViewTableContainer">
							<table id="listView">
								<tbody>
									<tr>
										<th>Name</th>
										<th>Class</th>
										<th>Calendar Invite</th>
										<th>Attendance Status</th>
										<th>Total Volunteer Hours</th>
										<th>Total Mentoring Hours</th>
									</tr>

									{renderTableData()}
								</tbody>
							</table>
						</div>
					)}
				</form>
			</div>
		</ClassListViewStyled>
	);
}
