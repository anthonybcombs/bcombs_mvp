import React, { useState, useEffect } from 'react';
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

	#dataTableContainer {
		position: relative;
		padding: 1rem;
    background-color: #fff;
    box-shadow: 0 0 25px #eae9e9;
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
		// grid-template-columns: repeat(5, 1fr);
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
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
	.search-field-container button {
		width: 120px;
    border: none;
    color: #fff;
    border-radius: 3px;
		background: #f5812f;
		transition: .15s ease-in-out;
	}
	.search-field-container button:hover {
		background: #e87828;
	}
	

	.circle-icon {
		border-radius: 50%;
		width: 15px;
		height: 15px;
		margin: 0 auto;
	}
	.child-body .block .extra_activitybox {
		text-align: center;
	}

	.child-body {
		margin-top: 3rem;
		display: grid;
    grid-gap: 18px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	}

	.child-body .block {
		width: auto;
		border: 1px solid #ccc;
    box-shadow: 0 0 10px #ccc;
    border-bottom: 4px solid #f5812f;
	}

	.child-body .block .extra_activitybox .img-container {
		padding: 1rem;
	}
	.child-body .block .extra_activitybox .img-container img {
		max-width: 120px;
    width: 100%;
	}
	.child-body .block .extra_activitybox .attendance-name {
		padding-bottom: 1rem;
	}
	.child-body .block .extra_activitybox .attendance-name a {
		color: #000;
    font-weight: 600;
		text-decoration: none;
		transition: .15s ease-in-out;
	}
	.child-body .block .extra_activitybox .attendance-name a:hover {
		color: #f5812f;
	}
	.child-body .block .extra_activitybox .attendance-action {
		display: flex;
		justify-content: space-around;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
	}
	.child-body .block .extra_activitybox .attendance-action >div {
		flex: 1;
    padding: 1rem 0;
	}
	.child-body .block .extra_activitybox .attendance-action >div:not(:last-child) {
		border-right: 1px solid #ddd;
	}
	.child-body .block .extra_activitybox .attendance-hours {
		display: flex;
    padding: 1rem;
    border-bottom: 1px solid #ddd;
	}
	.child-body .block .extra_activitybox .attendance-hours .field > input {
		text-align: center;
	}
	
	.child-body .block .extra_activitybox .attendance-invitation {
		padding: 1rem;
    color: gray;
    font-size: 14px;
	}
	.child-body .block .extra_activitybox .attendance-invitation span {
		color: #000;
		font-weight: 600;
	}




	// media query
	@media (max-width: 840px) {
    padding: 0rem 1rem 2rem;
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
		<FontAwesomeIcon
			icon={faCalendar}
			className='calendar-icon'
		/>
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

	const handleHours = (payload, hours,type = 'volunteer_hours') => {
		let updatedApplication = [...(applicationList || [])];
		let updatedFilteredApplication = [...(filteredApplicationList || [])];
		let currentIndex = updatedApplication.findIndex(app => app.id === payload.id);
		let currentFilteredIndex = updatedFilteredApplication.findIndex(app => app.id === payload.id);
		console.log('Handle Hours', hours)
		console.log('Handle Hours Type', type)
		updatedApplication[currentIndex] = {
			...updatedApplication[currentIndex],
			[type]: hours,
		};
		updatedFilteredApplication[currentFilteredIndex] = {
			...updatedFilteredApplication[currentFilteredIndex],
			[type]: hours,
		};
		console.log('Handle Hours updatedApplication 11',updatedApplication[currentIndex])
		console.log('Handle Hours updatedApplication 22',	updatedFilteredApplication[currentFilteredIndex])
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
				volunteer_hours: parseInt(app.volunteer_hours),
				mentoring_hours: parseInt(app.mentoring_hours),
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
				excused: updatedApplication[currentIndex].excused === excuseType ? null : excuseType,
			};
			updatedFilteredApplication[currentFilteredIndex] = {
				...updatedFilteredApplication[currentFilteredIndex],
				excused: updatedApplication[currentIndex].excused === excuseType ? null : excuseType,
			};
	
			setApplicationList(updatedApplication);
			setFilteredApplicationList(updatedFilteredApplication);
		}
	};

	const handleSearchChange = e => {
		let { name, value } = e.target;
		let lowerCaseVale = value;

		if(value !== '') {
			value = value.toLowerCase();
			const filteredApplication = applicationList.filter((app) => {
				if(app.child) {
					return app.child.lastname.toLowerCase().includes(value) || app.child.firstname.toLowerCase().includes(value)
				}
			})
			setFilteredApplicationList(filteredApplication);
		}
		else{
			setFilteredApplicationList(applicationList);
		}

	}
	console.log('applicationListttt', applicationList);

	return (
		<ClassListViewStyled>
			<h2>Attendance</h2>
			<div id="dataTableContainer">
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

					<div className="search-field-container">
						<div className="field">
							<input id="search" name={'search'} className={'field-input'} onChange={handleSearchChange} placeholder="Search" />
							<label className="field-label" for={`search`}>
								Search
							</label>
							<FontAwesomeIcon
								className='search-icon'
								icon={faSearch}
							/>
						</div>
						{applicationList.length > 0 && (
							<button disabled={attendance.isAttendanceUpdateSuccess} onClick={handleSubmit}>
								{attendance.isAttendanceUpdateSuccess ? 'Please Wait...' : 'Submit'}
							</button>
						)}
					</div>

					<div className="child-body">
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
													style={style.attendanceSubAction}
												>
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
															backgroundColor: app.attendance_status === 'Tardy' ? 'orange' : 'gray',
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
														handleHours(app, e.target.value,'volunteer_hours');
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
														handleHours(app, e.target.value,'mentoring_hours');
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
					{/* {applicationList.length > 0 && (
						<button disabled={attendance.isAttendanceUpdateSuccess} onClick={handleSubmit}>
							{attendance.isAttendanceUpdateSuccess ? 'Please Wait...' : 'Submit'}
						</button>
					)} */}
				</form>
			</div>
		</ClassListViewStyled>
	);
}
