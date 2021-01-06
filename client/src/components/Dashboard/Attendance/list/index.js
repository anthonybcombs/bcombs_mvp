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
import { faAngleRight, faAngleLeft, faCalendar, faSearch, faListUl,faBorderAll, faTh, faBars } from '@fortawesome/free-solid-svg-icons';

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
		grid-column-gap: 12px;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	}

	.description {
		background: #80808033;
	}
	.description .field {
		margin-bottom: 4px;
    padding: 8px 8px 12px;
	}
	.description .field >input {
		background: transparent;
	}

	.search-field-container {
		display: flex;
		align-items: baseline;
	}
	.search-field-container .field {
		flex: 1;
		position: relative;
		max-width: 350px;
    margin-right: auto;
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

	.viewType {
    margin-left: 1rem;
    display: flex;
    align-items: stretch;
  }
  .viewType > svg {
    height: auto;
    color: grey;
		font-size:18px;
		cursor:pointer;
    padding: 11px !important;
    border-radius: 0 !important;
		border: 1.65px solid #ccc;		
  }
	.viewType > svg:first-child {
		border-right: 0;
	}
  .viewType > svg:last-child {
    border-left: 0;
	}
  .viewType > svg.selected-view {
    color: #fff;
    background: #f5812f;
    border-color: rgb(204 204 204 / 30%);
    transition: .15s ease-in-out;
  }
  .viewType > svg:not(.selected-view):hover {
    color: #f5812f;
  }



	.actionBtn {
		margin-top: 3rem !important;
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
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
		max-width: 92px;
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
	.gridView .block .extra_activitybox .attendance-hours .field {
		padding: 0 .5rem;
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
		color: white;
		text-align: center;
		white-space: nowrap;
		background-color: #f26e21;
	}

	#listView td .name,
	#listView td .class {
		min-width: 100px;

	}

	#listView a {
		color: #3e89fe;
		text-decoration: none;
	}

	.attendance-status-container,
	.attendance-hours-container {
		min-width: 300px;
		display: flex;
	}
	.attendance-status-container > div {
		width: 100%;
    min-width: 100px;
	}

	.attendance-hours-container > div {
		width: 50%;
	}
	.listViewTableContainer {
		overflow-x: auto;
    margin-top: 3rem;
		box-shadow: 0px 0px 10px #ccc;
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
		position:relative;
		background-color: black;
		width: 1.5px;
		height: 14px;
		z-index: 200;
		top: 0px;
		left: -9px;
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

	console.log('Attendance List attendance',attendance)
	console.log('Attendance List auth',auth)
	console.log('Attendance List vendors',vendors)
	console.log('Attendance List groups',groups)
	console.log('Attendance List applications',applications)
	console.log('Attendance List filteredApplicationList',filteredApplicationList)
	console.log('Attendance List appGroupId',appGroupId)
	
	useEffect(() => {
	
		if (name && vendor_id && auth.user_id) {
			dispatch(requestVendor(auth.user_id));
			dispatch(requestUserGroup(auth.email));
		}
	}, [name,vendor_id]);

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

		let currentAppGroupId = '';
		console.log('Use Effect Vendors', vendors)
		if (vendors && vendors[0] && vendors[0].app_groups.length > 0) {
			const applicationGroups = vendors[0].app_groups;
			console.log('Use Effect Vendors applicationGroups', applicationGroups)
			console.log('Use Effect Vendors name', name)
			for (const group of applicationGroups) {
				if (group.name.trim() === name.trim()) {
					console.log('Use Effect Vendors current group', group)
					currentAppGroupId = group.app_grp_id;
					break;
				}
			}

			console.log('Use Effect Vendors currentAppGroupId', currentAppGroupId)
			setAppGroupId(currentAppGroupId);
		}
	}, [vendors]);



	useEffect(() => {

		if (appGroupId !== '') {
			dispatch(requestAttendance(appGroupId));
		}

		if (applications && applications.activeapplications.length > 0 && appGroupId !== '') {
	
			let filterApplications = applications.activeapplications.filter(application => {
				return application && application.class_teacher == appGroupId;
			});

			filterApplications = filterApplications.map(item => {
				let currentAttendance = attendance.list.find(att => att.child_id === item.child.ch_id);
				item.class_teacher = name;
				return item;
			});
			setApplicationList(filterApplications);

		}
	}, [applications,appGroupId]);




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

		let updatedApplication = [...(applicationList || [])];
		let updatedFilteredApplication = [...(filteredApplicationList || [])];
		let currentIndex = updatedApplication.findIndex(app => app.id === payload.id);
		let currentFilteredIndex = updatedFilteredApplication.findIndex(app => app.id === payload.id);

		updatedApplication[currentIndex] = {
			...updatedApplication[currentIndex],
			[type]: hours,
		};
		updatedFilteredApplication[currentFilteredIndex] = {
			...updatedFilteredApplication[currentFilteredIndex],
			[type]: hours,
		};

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

	const handleViewChange = value => {

		setViewMode(value);
	};

	const renderTableData = () => {
		return filteredApplicationList.map((app, index) => {
			return (
				<tr key={index}>
					<td>
						<div className='name'>{app.child?.firstname + ' ' + app.child?.lastname}</div>
					</td>
					<td><div className='class'>{app.class_teacher}</div></td>
					<td>
						<span>{
							app.is_following === 1 ? (
								<div className="circle-icon" style={{ ...style.attendanceAction, backgroundColor: '#14e414' }}></div>
							) : app.is_following === 2 ? (
								<div className="circle-icon" style={{ ...style.attendanceAction, backgroundColor: '#f26e21' }}></div>
							) : (
								""
							)
						}
						{	app.is_following  ? app.is_following === 1 ?  'Accepted' : 'Declined' : app.is_following === 0 ? 'Pending' : 'Blank'}
						</span>
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
										style={{ ...style.attendanceAction, 
										backgroundColor: app.attendance_status === 'Present' ?  '#14e414' : 'gray' }}
									/>
										<div>Present</div>
									{/* {app.attendance_status === 'Present' ? <div className="exclude-icon"></div> : <span />} */}
								</div>
							</div>
							<div style={{ minHeight: 22 }}>
								<div style={{ position: 'relative'}}>
									<div
										className="circle-icon"
										onClick={() => {
											handleAttendance(app, 'Absent');
										}}
										
										style={{ ...style.attendanceAction, backgroundColor: app.attendance_status === 'Absent' ?  'red' : 'gray'}}></div>
									{/* {app.attendance_status === 'Absent' ? <div className="exclude-icon"></div> : <span />} */}
									<div>Absent</div>
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
												backgroundColor: app.excused === 'absent' ? 'red' : 'gray',
											}}
										/>
									
										
											{app.excused === 'absent' ? <div className="exclude-icon"></div> : <span />} 
										{'    '}Excused
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
										style={{ ...style.attendanceAction, backgroundColor: app.attendance_status === 'Tardy' ?  '#f26e21' : 'gray'}}></div>
									<div>Tardy</div>
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
												backgroundColor: app.excused === 'tardy' ? '#f26e21' : 'gray',
											}}
										/>
										{app.excused === 'tardy' ? <div className="exclude-icon"></div> : <span />}
										{'    '}Excused 
										{'  '}
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

					<td >
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

					<td>
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

					<div className="field description">
							<div className="field">
								<input
									id="description"
									name={'description'}
									className={'field-input'}
									placeholder="Description"
									onChange={handleAttedanceDetailChange}
							/>
							<label className="field-label" for={`description`}>
								Description
							</label>
						</div>
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
						{/* <div className="field select-field-wrapper">
							<select onChange={handleViewChange} className={'field-input'}>
								<option value="grid">Grid View</option>
								<option value="list">List View</option>
							</select>
						
						</div>	 */}

						<div className="viewType">
							<FontAwesomeIcon onClick={() =>{
								handleViewChange("grid")
							}} className={`view-icon ${viewMode === 'grid' ? 'selected-view' : ''}`} icon={faTh} />
							<FontAwesomeIcon onClick={() =>{
								handleViewChange("list")
							}}className={`view-icon ${viewMode === 'list' ? 'selected-view' : ''}`} icon={faBars} />
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

													<div
														onClick={() => {
															handleExcused(app, 'absent');
														}}
														style={style.attendanceSubAction}>
														<div
															className="circle-icon"
															style={{
																...style.miniCircleIcon,
																backgroundColor: app.excused === 'absent' ? 'red' : 'gray',
															}}
														/>
														{app.excused === 'absent' ? <div className="exclude-icon"></div> : <span />}
														{'    '}Excused {'  '}
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
																backgroundColor: app.excused === 'tardy' ? '#f26e21' : 'gray',
															}}
														/>
														{app.excused === 'tardy' ? <div className="exclude-icon"></div> : <span />}
														{'    '}Excused {'  '}
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
												{ (
													<div className="calendar-invite">
														Calendar Invite: <span>{`${app.is_following !== null ? app.is_following === 1 ?'Accepted' : 'Declined' : app.is_following === null ? 'Blank' :  'Pending'}`}</span>
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
					<div className="field actionBtn">
 						{applicationList.length > 0 && (
							<button disabled={attendance.isAttendanceUpdateSuccess} onClick={handleSubmit}>
								{attendance.isAttendanceUpdateSuccess ? 'Please Wait...' : 'Submit'}
							</button>
						)} 
					</div>
								

				</form>
			</div>
		</ClassListViewStyled>
	);
}
