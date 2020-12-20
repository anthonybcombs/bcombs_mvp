import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from '@reach/router';
import { format } from 'date-fns';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  faAngleRight,
  faAngleLeft
} from "@fortawesome/free-solid-svg-icons";

import DataTable from 'react-data-table-component';

import { requestUpdateAttendance } from '../../../../redux/actions/Attendance';
import { requestVendor } from '../../../../redux/actions/Vendors';
import { requestGetApplications } from '../../../../redux/actions/Application';
import { requestUserGroup } from '../../../../redux/actions/Groups';

import ProfileImg from '../../../../images/defaultprofile.png';

import CustomDatePicker from '../../../../helpers/CustomDatePicker';

const DATE_FORMAT = "yyyy-MM-dd";

const ClassListViewStyled = styled.div`
	padding: 1em;

	#dataTableContainer {
		box-shadow: 0px 0px 10px #ccc;
		padding: 1em;
		background-color: #fff;
		position: relative;
	}

	#dataTableContainer a {
		color: #3e89fe;
		text-decoration: none;
	}

	#dataTableContainer .img-container {
		margin-right: 10px;
	}

	#dataTableContainer img {
		width: 55px;
		height: 55px;
	}

	.attendance-action {
		display: flex;
		flex-flow: row wrap;
	}

	.attendance-action div{
		margin: 3px;
	}
	.child-body {
		margin-top: 10px;
		display: flex;
		flex-flow: row wrap;
	}

	.child-body .block {
		padding-left: 3px;
		padding-right: 3px;
		width: 250px;
	}

	.child-body .extra_activitybox {
		background: white;
		border: 1px solid #ccc;
		box-shadow: 0px 0px 10px #ccc;
		padding: 10px 15px;
		margin-bottom: 10px;
		text-align: center;
	}

	.child-body h4 {
		border-bottom: 3px solid #f26e21;
		width: fit-content;
		margin: 0 auto;
		display: table;
		padding-bottom: 5px;
		font-size: 20px;
	}

	.child-body .extra_activitylist {
		margin-top: 20px;
		overflow-x: hidden;
		padding: 10px;
	}

	@media screen and (max-width: 1366px) {
		.child-body .block {
			width: 32.8%;
		}
	}

	@media screen and (max-width: 1080px) {
		.child-body .block {
			width: 49.3%;
		}
	}

	.field { 
		padding:5px !important;
		margin:5px !important;
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
		margin-bottom: 5px;
		font-weight: bold;
	}

	.search-field-container {
		display: flex;
		flex-flow: row wrap;
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
	
	.react-datepicker-wrapper{
		padding-top:24px;
	}

	.field{
		margin-top:-5px !important;
	}
	.circle-icon {
		border-radius:50%;
		width: 15px;
		height: 15px;
		margin:0 auto;
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
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];


const DateCustomInput = ({
	value,
	onClick,
	name,
	className,
	placeholder,
	register
}) => (
	<div className="field" >
		<input
			defaultValue={value}
			onClick={onClick}
			name={name}
			className={className}
			placeholder="mm/dd/yyyy"
			readOnly={true}
			id={`attendance_date`}
			style={{marginTop:24}}
			ref={register({ required: true })}
		/>
		<label className="field-label" for={`date`}>
			<span className="required">*</span> Date
		</label>
	</div>
);


export default function index() {
	const { register, handleSubmit, errors, clearError, setError } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit"
  });
	const { name, vendor_id } = useParams();
	const { auth, vendors, groups, applications, loading } = useSelector(
		({ auth, vendors, applications, groups, loading }) => {
			return { auth, vendors, applications, groups, loading };
		}
	);
	const [attendanceDetails, setAttendanceDetails] = useState({
		attendance_date:null,
		attendance_start_time:null,
		attendance_end_time:null,
		event_name:null,
		location:null,
	});
	const [appGroupId,setAppGroupId] = useState('');
	const [applicationList, setApplicationList] = useState([]);
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
				item.class_teacher = name;
				return item;
			});

			setApplicationList(filterApplications);
			setAppGroupId(currentAppGroupId)
		}
	}, [applications]);

	const handleAttendance = (payload, attendanceType) => {
		let updatedApplication = [...(applicationList || [])];

		let currentIndex = updatedApplication.findIndex(app => app.id === payload.id);

		updatedApplication[currentIndex] = {
			...updatedApplication[currentIndex],
			attendance_status: attendanceType,
			excused:null
		}
		setApplicationList(updatedApplication);
	};

	const handleVolunteerHours = (payload,volunteerHrs) => {
		let updatedApplication = [...(applicationList || [])];

		let currentIndex = updatedApplication.findIndex(app => app.id === payload.id);
		console.log('handleVolunteerHours payload', payload)
		console.log('handleVolunteerHours volunteerHrs', volunteerHrs)
		updatedApplication[currentIndex] = {
			...updatedApplication[currentIndex],
			volunteer_hours: volunteerHrs,
		};
		console.log('handleVolunteerHours volunteerHrs', volunteerHrs)
		setApplicationList(updatedApplication);
	}

	

	const onSubmit = () => {
		console.log('onSubmit2222 applicationList', applicationList);
		console.log('onSubmit2222 attendanceDetails', attendanceDetails);

		const attendanceList = applicationList.map(app => {
			return {
				app_id:app.app_id,
				attendance_status:app.attendance_status,
				child_id:app.child.ch_id,
				vendor:app.vendor,
				volunteer_hours: parseInt(app.volunteer_hours),
				is_excused:app.excused ? 1 : 0

			}
		})

		const payload = {
			attendance_list:attendanceList,
			app_group_id: appGroupId,
			...attendanceDetails,
			attendance_date: format(
				new Date(attendanceDetails.attendance_date),
				DATE_FORMAT)
		};


		console.log('ClassListViewStyled payload', payload)
		dispatch(requestUpdateAttendance(payload));
	};

	const handleAttedanceDetailChange = e => {
		const { name ,value } = e.target;

		setAttendanceDetails({
			...attendanceDetails,
			[name]: value
		})
	}

	const handleExcused = (payload, excuseType) => {
		let updatedApplication = [...(applicationList || [])];

		let currentIndex = updatedApplication.findIndex(app => app.id === payload.id);

		if(excuseType === updatedApplication[currentIndex].attendance_status.toLowerCase()) {
			updatedApplication[currentIndex] = {
				...updatedApplication[currentIndex],
				excused: excuseType,
			};
			setApplicationList(updatedApplication);
		}

	};


	return (
		<ClassListViewStyled>
			<div id="dataTableContainer">
				<form onSubmit={handleSubmit(onSubmit)}>
				<div className="search-field-container">
		
					<div className="field">
		
					<DatePicker
								readOnly={false}
								style={{marginTop:24}}
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled
                }) => (
                  <div
                    style={{
                      margin: 0,
                      display: "flex",
                      alignCenter: "center",
                      justifyContent: "center",
                      background: "#f36e22",
                      padding: "5px 3px"
                    }}>
                    <button
                      className="datepicker-btn"
                      onClick={e => {
                        e.preventDefault();
                      }}>
                      <FontAwesomeIcon
                        icon={faAngleLeft}
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                      />
                    </button>
                    <select
                      value={new Date(date).getFullYear()}
                      onChange={({ target: { value } }) => changeYear(value)}>
                      {years.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <select
                      value={months[date.getMonth()]}
                      onChange={({ target: { value } }) =>
                        changeMonth(months.indexOf(value))
                      }>
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
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                      />
                    </button>
                  </div>
                )}
                selected={null}
								disabled={false}
								selected={attendanceDetails.attendance_date}
                onChange={value => {
									setAttendanceDetails({
										...attendanceDetails,
										attendance_date: value
									})
									
                }}
                name={"attendance_date"}
                customInput={
                  <DateCustomInput
										className={"field-input date-field"}
										register={register}
                  />
                }
              />
					</div>
					<div className="field">
						<input onChange={handleAttedanceDetailChange}  ref={register({ required: true })} type="time" name={'attendance_start_time'} className={'field-input'} placeholder="Start Name" />
						<label className="field-label" for={`attendance_start_time`}>
							<span className="required">*</span> Start Time
						</label>
					</div>
					<div className="field">
						<input  onChange={handleAttedanceDetailChange} ref={register({ required: true })} type="time" name={'attendance_end_time'} className={'field-input'} placeholder="End Time" />
						<label className="field-label" for={`attendance_end_time`}>
							<span className="required">*</span> End Time
						</label>
					</div>
					<div className="field">
						<input  onChange={handleAttedanceDetailChange} ref={register({ required: true })} name={'event_name'} className={'field-input'} placeholder="Event Name" />
						<label className="field-label" for={`event_name`}>
							<span className="required">*</span> Event Name
						</label>
					</div>
					<div className="field">
						<input  onChange={handleAttedanceDetailChange} ref={register({ required: true })} name={'location'} className={'field-input'} placeholder="Location" />
						<label className="field-label" for={`location`}>
							<span className="required">*</span> Location
						</label>
					</div>
				</div>
				<div className="child-body">
					{applicationList.map(app => {
						return (
							<div className="block">
								<div className="extra_activitybox">
									<span className="img-container" style={{ margin: '0 auto' }}>
										<img src={ProfileImg} />
									</span>

									<div className="extra_activitylist">
										<a target="_blank" href={'/dashboard/menteeprofile/' + app.id}>
											<span>{app.child?.firstname + ' ' + app.child?.lastname}</span>
										</a>
									</div>
									<div className="attendance-action">
										<div>
											<div onClick={() => {
													handleAttendance(app, 'Present');
												}}>
												<div className="circle-icon" style={{	margin:'0 auto',backgroundColor: app.attendance_status === 'Present' ? 'green' : 'gray'}} />	
												Present
											</div>
										
										</div>
										<div>
												<div onClick={() => {
													handleAttendance(app, 'Absent');
												}}>
												<div className="circle-icon" style={{	margin:'0 auto',backgroundColor: app.attendance_status === 'Absent' ? 'red' : 'gray'}} />	
												Absent
											</div>

											<div onClick={() => {
													handleExcused(app, 'absent');
												}} style={{fontSize:12,marginTop:8}}>
												<div className="circle-icon" style={{	width:12,height:12,margin:'0 auto', backgroundColor: app.excused === 'absent' ? 'green' : 'gray'}} />	
												Excused
											</div>


										</div>
										<div>
						
											<div onClick={() => {
													handleAttendance(app, 'Tardy');
												}}>
												<div className="circle-icon" style={{	margin:'0 auto', backgroundColor: app.attendance_status === 'Tardy' ? 'yellow' : 'gray'}} />	
												Tardy
											</div>
						

											<div onClick={() => {
													handleExcused(app, 'tardy');
												}} style={{fontSize:12,marginTop:8}}>
												<div className="circle-icon" style={{	width:12,height:12,margin:'0 auto', backgroundColor: app.excused === 'tardy' ? 'green' : 'gray'}} />	
												Excused
											</div>

								
										</div>
									</div>
									<div className="attendance-action">
										<div className="field">
											<input type="number" onChange={e => {
												handleVolunteerHours(app,e.target.value)
											}} name={'volunteer_hrs'} className={'field-input'} placeholder="Volunteer Hours" />
											<label className="field-label" for={`volunteer_hrs`}>
											 Volunteer Hours
											</label>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
				{applicationList.length > 0 && <button onClick={handleSubmit}>Submit</button>}
				</form>
			</div>
		</ClassListViewStyled>
	);
}
