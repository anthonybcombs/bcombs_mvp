import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, redirectTo } from '@reach/router';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
	faAngleRight,
	faAngleLeft,
	faCalendar,
	faSearch,
	faListUl,
	faBorderAll,
	faTh,
	faBars,
	faClock
} from '@fortawesome/free-solid-svg-icons';
import { parse } from 'query-string';


import { requestAttendance, requestUpdateAttendance } from '../../../../redux/actions/Attendance';
import { requestVendor } from '../../../../redux/actions/Vendors';
import {
	requestGetApplications,
	// requestGetCustomApplications,
	requestGetCustomApplicationByVendor,
} from '../../../../redux/actions/Application';
import { requestUserGroup } from '../../../../redux/actions/Groups';
//// import { requestGetForms, requestGetFormById } from '../../../../redux/actions/FormBuilder';

import ProfileImg from '../../../../images/defaultprofile.png';

//// import CustomDatePicker from '../../../../helpers/CustomDatePicker';
import Confirmation from '../../../../helpers/Confirmation';


import { getNameFromCustomForm } from '../../Grades/utils'

//const DATE_FORMAT = 'MM/dd/yyyy';
const DATE_FORMAT = 'MMM d, yyyy';
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
	.description .field > input {
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
		font-size: 18px;
		cursor: pointer;
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
		transition: 0.15s ease-in-out;
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
		border-radius: 50%;
		height: 100px;
		width: 100px;
		box-shadow: 0 0 5px #716464;
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
		// box-shadow: 0px 0px 10px #ccc;
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
		position: relative;
		background-color: black;
		width: 1.5px;
		height: 14px;
		z-index: 200;
		top: 0px;
		left: -9px;
		transform: rotateY(0deg) rotate(45deg);
	}

	.react-datepicker--time-only{
		width:200px !important;
	}
	.react-datepicker__time-container  {
		width:100% !important;
	}
	.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box{
		width:100% !important;
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

const addtime = (time, hour) => {
	console.log('Add Time Time', time)
	console.log('Add Time hour', hour)
	let times = time.split(':');
	console.log('Add Time Timesssss', times)
	times[0] = parseInt(times[0]) + hour;
	times[0] >= 24 ? (times[0] -= 24) : null;
	times[0] < 10 ? (times[0] = '0' + times[0]) : null;
	console.log('ADDTIMEEEE', times)
	return times.join(':');
};

const timeCompare = (time1, time2) => {
	// console.log('Time Compare', time1);
	// console.log('Time Compare 2', time2);
	// let t1 = new Date();
	// let parts = time1.split(':');
	// t1.setHours(parts[0], parts[1], 0);
	// let t2 = new Date();
	// parts = time2.split(':');
	// t2.setHours(parts[0], parts[1], 0);
	// if (t1.getTime() > t2.getTime()) return 1;
	// if (t1.getTime() < t2.getTime()) return -1;
	// return 0;

	if (time1 && time2) {
		let arrTime1 = time1.split(':');
		let arrTime2 = time2.split(':');

		if (parseInt(arrTime1[0]) > parseInt(arrTime2[0])) return 1;
		if (parseInt(arrTime1[0]) < parseInt(arrTime2[0])) return -1;
	}
	return 0;
};

const DateCustomInput = ({ value, onClick, name, className, placeholder, register }) => (
	<div className="field">
		<input
			defaultValue={value}
			onClick={onClick}
			name={name}
			className={className}
			placeholder={DATE_FORMAT}
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

const TimeCustomInput = ({ value, onClick, name, className, placeholder, register, label }) => {
	console.log('Time Custom Input', value)
	return (
		<div className="field">
			<input
				value={value}
				onClick={onClick}
				name={name}
				className={className}
				placeholder={'HH:mm'}
				readOnly={true}
				id={`attendance_time`}
				style={{
					width: '100%'
				}}
			/>
			<label className="field-label" for={`attendance_date`}>
				{label}
			</label>
			<FontAwesomeIcon icon={faClock} className="calendar-icon" />
		</div>
	);
}

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
};

export default function index() {
	const { register, handleSubmit, errors, clearError, setError, reset } = useForm({
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
	});
	const { name, vendor_id } = useParams();
	const queryLocation = useLocation();
	const searchParams = parse(queryLocation.search); // => {init: "true"}
	const { attendance, auth, vendors, groups, applications, loading, form = {} } = useSelector(
		({ attendance, auth, vendors, applications, groups, loading, form }) => {
			return { attendance, auth, vendors, applications, groups, loading, form };
		}
	);
	const [attendanceDetails, setAttendanceDetails] = useState({
		attendance_date: null,
		attendance_start_time: null,
		attendance_end_time: null,
		event_name: null,
		location: null,
	});
	const [appGroupId, setAppGroupId] = useState(null);
	const [appGroupName, setAppGroupName] = useState(null);
	const [applicationList, setApplicationList] = useState([]);
	const [defaultApplicationList, setDefaultApplicationList] = useState([]);
	const [filteredApplicationList, setFilteredApplicationList] = useState([]);
	const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
	const [appGroupIds, setAppGroupIds] = useState([]);
	const [viewMode, setViewMode] = useState('grid');
	const dispatch = useDispatch();
	const { formList = [] } = form;

	useEffect(() => {
		if (name === 'custom' && vendor_id && auth.user_id) {
			//dispatch(requestGetForms({ vendor: vendor_id, categories: [] }));

			//dispatch(requestGetCustomApplications(searchParams.formId));
			dispatch(requestGetCustomApplicationByVendor(vendor_id));
			dispatch(requestVendor(auth.user_id));
			dispatch(requestUserGroup(auth.email));
		} else if ((name !== 'custom' || name === 'all') && vendor_id && auth.user_id) {
			dispatch(requestVendor(auth.user_id));
			dispatch(requestUserGroup(auth.email));
		}
	}, [name, vendor_id]);

	useEffect(() => {
		if (vendors && vendors.length > 0 /* && (name !== 'custom' ||  ) ) */) {
			let vendorId;
			for (const vendor of vendors) {
				if ((name === 'custom' && vendor.id == vendor_id) || vendor.id2 == vendor_id) {
					vendorId = vendor.id;
					break;
				}
			}

			// if(name !== 'custom') {
			// 	dispatch(requestGetApplications(vendorId));
			// }

			if (name !== 'custom') {
				dispatch(requestGetApplications(vendorId));
			}
			// else {
			// 	dispatch(requestGetCustomApplicationByVendor(vendorId))
			// }


		}
	}, [vendors]);

	useEffect(() => {


		if (name === 'custom' && searchParams) {
			//let currentAppGroupId = '';
			let currentAppGroupName = '';
			if (groups && groups.application_groups) {
				const applicationGroups = groups.application_groups;
	
				const filteredGroup = applicationGroups.filter(item => (searchParams && searchParams.appGroupId && (item.app_grp_id === searchParams.appGroupId)) || (searchParams && searchParams.type === 'all' && searchParams && searchParams.formId === item.form)).map(item => item.app_grp_id)


				for (const group of applicationGroups) {
					if (group.app_grp_id === searchParams.appGroupId) {

						//currentAppGroupId = group.app_grp_id;
						currentAppGroupName = group.name;
						// break;
					}
				}
				// console.log('applicationGroups currentAppGroupId',currentAppGroupId)
				setAppGroupId(searchParams.appGroupId);
				const ids = searchParams && searchParams.appGroupIds ? searchParams.appGroupIds.split(',') : [];

				setAppGroupIds([...(ids || [])])
				if (filteredGroup[0] && filteredGroup[0].name) {
					setAppGroupName(filteredGroup[0].name);
				}

			}
		} else {
			if (vendors.length > 0 && name !== 'all') {
				let currentAppGroupId = '';
				let currentAppGroupName = ''
				let vendorId = parseInt(vendor_id);
				let currentVendor = vendors.find(item => item.id2 === vendorId)
				if (currentVendor && currentVendor.app_groups) {
					const applicationGroups = currentVendor.app_groups;
					for (const group of applicationGroups) {
						if (group.name.trim() === name.trim()) {
							currentAppGroupId = group.app_grp_id;
							currentAppGroupName = group.name;
							break;
						}
					}

					setAppGroupId(currentAppGroupId);
					setAppGroupName(currentAppGroupName);
				}
			} else if (name === 'all') {
				let vendorId = parseInt(vendor_id);
				let currentVendor = vendors.find(item => item.id2 === vendorId)
				if (currentVendor && currentVendor.app_groups) {
					const applicationGroups = currentVendor.app_groups;
					const ids = applicationGroups.map(item => item.app_grp_id);
					setAppGroupIds(ids);
					setAppGroupId('all');
				}
			}
		}
	}, [groups, vendors]);

	useEffect(() => {

		if (appGroupId && appGroupId !== '') {
			dispatch(
				requestAttendance(name === 'custom' ? searchParams.appGroupId : appGroupId, name === 'custom' ? 'custom' : 'bcombs')
			);
		}
		if (
			applications &&
			applications.activeapplications.length > 0 &&
			appGroupId !== '' &&
			(name !== 'custom' || name === 'all')
		) {
			let filterApplications = [];
			if (appGroupId === 'all') {
				///filterApplications = applications.activeapplications;
				filterApplications = applications.activeapplications.filter(application => {
					const classTeachers = application.class_teacher && application.class_teacher.split(',');
					return classTeachers && classTeachers.some(grpId => appGroupIds.includes(grpId))
					//return appGroupIds.includes(application.class_teacher)
				});
			} else {
				filterApplications = applications.activeapplications.filter(application => {
					return application && application.class_teacher && application.class_teacher.includes(appGroupId);
				});
			}
			filterApplications = filterApplications.map(item => {
				//let currentAttendance = attendance.list.find(att => item.child && att.child_id === item.child.ch_id);
				const classTeacher = item.class_teacher && item.class_teacher.split(',');
				item.class_teacher = name === 'all' ? classTeacher && classTeacher[0] : appGroupId
				item.app_group_id = name === 'all' ? classTeacher && classTeacher[0] : appGroupId
				return item;
			});

			setApplicationList(filterApplications);
		} else if (applications && applications.customActiveApplications.length > 0 && name === 'custom') {
			let filterApplications = applications.customActiveApplications.filter(item => item.class_teacher && item.form === searchParams.formId);
			//console.log('2222applications.activeapplications1111', applications.customActiveApplications.filter(item => item.class_teacher))
		
			// let stringAppGroupIds = appGroupIds && appGroupIds.length > 0 ? appGroupIds.join(',') : ''
	
			// let appGroupIdStrings = appGroupIds ? appGroupIds.join(',')
			filterApplications = filterApplications.filter(item => {


				if (item.form === searchParams.formId && item.class_teacher && item.class_teacher !== '' && searchParams && searchParams.type !== 'all') {
					return item.class_teacher.includes(appGroupId)
				}
				else if (item.class_teacher && appGroupIds && searchParams && searchParams.type === 'all' && item.form === searchParams.formId) {
					//	let classTeacherArr = item.class_teacher.split(',');
					let resp = appGroupIds.some(appId => item.class_teacher.includes(appId))

					return resp;
					//return classTeacherArr.some(appGrpId => appGroupIds.includes(appGrpId))
				}

				//return searchParams && searchParams.type === 'all' && item.class_teacher && item.form === searchParams.formId; 
				// ( item.form === searchParams.formId  && (item.class_teacher && (appGroupId && (item.class_teacher.includes(appGroupId)) ||  ))) || (searchParams && searchParams.type === 'all'   && item.form === searchParams.formId)
			});
			// const test123 = applications.customActiveApplications.filter(item =>  item.form === searchParams.formId && (item.class_teacher && (appGroupId && (item.class_teacher.includes(appGroupId)) ||  item.class_teacher.includes(appGroupIds)))  || (searchParams && searchParams.type === 'all'   && item.form === searchParams.formId)  );

			// if(searchParams.type === 'all'){
			// 	filterApplications = filterApplications.map(item => {
			// 		const classTeacher = item.class_teacher.split(',');
			// 		if(classTeacher.length > 0) {
			// 			return classTeacher.map(item2 => {
			// 				return {
			// 					...item,
			// 					class_teacher:item2
			// 				}
			// 			})
			// 		}
			// 		return item
			// 	}).flat()

			// }


			console.log(' applications.activeapplications1111 FILTERED APPLICATIONS', filterApplications)
			setApplicationList(filterApplications);
			setFilteredApplicationList(filterApplications);
		}
	}, [applications, appGroupId, appGroupIds]);

	useEffect(() => {

		if (attendance.list) {
			let updatedApplicationList = applicationList.map(application => {
				let currentAttendance = attendance.list.find(
					att => application.child && att.child_id === application.child.ch_id
				);

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
			const redirect = () => {
				setTimeout(() => {
					window.location.replace(`/dashboard/studentdata${vendor_id ? `?vendor=${vendor_id}` : ''}`);
				}, 2000);
				//window.location.replace(`/dashboard/studentdata`);
			};
			redirect();
		}
	}, [attendance.isAttendanceUpdateSuccess]);

	const handleAttendance = (payload, attendanceType) => {
		let updatedApplication = [...(applicationList || [])];
		let updatedFilteredApplication = [...(filteredApplicationList || [])];
		let currentIndex = updatedApplication.findIndex(app => app.id === payload.id);
		let currentApplication = updatedApplication.find(app => app.id === payload.id);
		let currentFilteredIndex = updatedFilteredApplication.findIndex(app => app.id === payload.id);

		if (
			updatedApplication[currentIndex] &&
			updatedApplication[currentIndex].attendance_status === attendanceType &&
			!updatedApplication[currentIndex].excused
		) {
		
			//  handleExcused(payload,attendanceType.toLowerCase());

			if (attendanceType !== 'Present') {
				updatedApplication[currentIndex] = {
					...updatedApplication[currentIndex],
					excused: updatedApplication[currentIndex].excused === null ? attendanceType.toLowerCase() : null,
				};
				updatedFilteredApplication[currentFilteredIndex] = {
					...updatedFilteredApplication[currentFilteredIndex],
					excused: updatedFilteredApplication[currentIndex].excused === null ? attendanceType.toLowerCase() : null,
				};
			} else {
				updatedApplication[currentIndex] = {
					...updatedApplication[currentIndex],
					excused: null,
					attendance_status: null,
				};
				updatedFilteredApplication[currentFilteredIndex] = {
					...updatedFilteredApplication[currentFilteredIndex],
					excused: null,
					attendance_status: null,
				};
			}
		} else if (
			updatedApplication[currentIndex] &&
			updatedApplication[currentIndex].attendance_status === attendanceType &&
			updatedApplication[currentIndex].excused === attendanceType.toLowerCase()
		) {
			updatedApplication[currentIndex] = {
				...updatedApplication[currentIndex],
				attendance_status: null,
				excused: null,
			};
			updatedFilteredApplication[currentFilteredIndex] = {
				...updatedFilteredApplication[currentFilteredIndex],
				attendance_status: null,
				excused: null,
			};
		} else {
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
		}

		// updatedApplication[currentIndex] = {
		// 	...updatedApplication[currentIndex],
		// 	attendance_status: attendanceType,
		// 	excused: null,
		// };



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
		// const attendanceList = applicationList.map(app => {
		// 	return {
		// 		app_id: app.app_id,
		// 		attendance_status: app.attendance_status || '',
		// 		child_id: name === 'custom' ? app.app_id  : app.child && app.child.ch_id,
		// 		vendor: app.vendor,
		// 		volunteer_hours: app.volunteer_hours ? parseInt(app.volunteer_hours) : 0,
		// 		mentoring_hours: app.mentoring_hours ? parseInt(app.mentoring_hours) : 0,
		// 		is_excused: app.excused ? 1 : 0,
		// 	};
		// });

		// const payload = {
		// 	attendance_list: attendanceList,
		// 	app_group_id: name === 'custom' ? searchParams && searchParams.formId  : appGroupId,
		// 	attendance_type: name === 'custom' ? 'forms' : 'bcombs',
		// 	...attendanceDetails,
		// 	attendance_date: format(new Date(attendanceDetails.attendance_date), 'yyyy-MM-dd'),
		// };
		// dispatch(requestUpdateAttendance(payload));
		setIsConfirmationVisible(true);
	};

	const handleAttendanceSave = () => {
		//reset();

		const attendanceList = applicationList.map(app => {

			return {
				app_id: app.app_id,
				app_group_id: app.class_teacher,
				attendance_status: app.attendance_status || '',
				child_id: name === 'custom' ? app.app_id : app.child && app.child.ch_id,
				vendor: app.vendor,
				volunteer_hours: app.volunteer_hours ? parseFloat(app.volunteer_hours) : 0,
				mentoring_hours: app.mentoring_hours ? parseFloat(app.mentoring_hours) : 0,
				is_excused: app.excused ? 1 : 0,

			};
		});
		const isAll = searchParams && searchParams.type === 'all'
		const payload = {
			attendance_list: attendanceList,
			app_group_id: name === 'custom' ? isAll ? appGroupIds[0] : searchParams && searchParams.appGroupId : appGroupId,
			attendance_type: name === 'custom' ? 'forms' : 'bcombs',
			...attendanceDetails,
			attendance_date: format(new Date(attendanceDetails.attendance_date), 'yyyy-MM-dd'),
		};

		dispatch(requestUpdateAttendance(payload));
		setIsConfirmationVisible(false);

	};

	const handleAttedanceDetailChange = e => {
		const { name, value } = e.target;
		let payload = {
			...(attendanceDetails || {}),
			[name]: value,
		};
		if (name === 'attendance_start_time') {
			payload = {
				...(attendanceDetails || {}),
				attendance_start_time: value,
				attendance_end_time: addtime(value, 1),
			};
		} else if (name === 'attendance_end_time') {
			const timeCompareValue = timeCompare(value, attendanceDetails.attendance_start_time);
			if (timeCompareValue > -1) {
				payload = {
					...(attendanceDetails || {}),
					attendance_end_time: value,
				};
			} else {
				payload = {
					...(attendanceDetails || {}),
					attendance_end_time: addtime(attendanceDetails.attendance_start_time, 1),
				};
			}
		}


		setAttendanceDetails({
			...payload,
		});
	};

	const handleTimeChange = name => value => {

		const formattedValue = format(new Date(value), 'HH:mm');
		let payload = {
			...(attendanceDetails || {}),
			[name]: formattedValue
		};


		if (name === 'attendance_start_time' || name === 'attendance_end_time') {
			if (name === 'attendance_start_time') {
				payload = {
					...(attendanceDetails || {}),
					attendance_start_time: formattedValue,
					attendance_end_time: addtime(formattedValue, 1),
				};
			} else if (name === 'attendance_end_time') {
				const timeCompareValue = timeCompare(formattedValue, attendanceDetails.attendance_start_time);
				if (timeCompareValue > -1) {
					payload = {
						...(attendanceDetails || {}),
						attendance_end_time: formattedValue,
					};
				} else {
					payload = {
						...(attendanceDetails || {}),
						attendance_end_time: addtime(attendanceDetails.attendance_start_time, 1),
					};
				}
			}
		}

	
		setAttendanceDetails({
			...payload,
		});

	};

	const handleExcused = (payload, excuseType) => {
		let updatedApplication = [...(applicationList || [])];
		let updatedFilteredApplication = [...(filteredApplicationList || [])];
		let currentIndex = updatedApplication.findIndex(app => app.id === payload.id);
		let currentFilteredIndex = updatedFilteredApplication.findIndex(app => app.id === payload.id);

		if (excuseType === payload.attendance_status.toLowerCase()) {
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
		console.log('Render Table Data', filteredApplicationList);
		return filteredApplicationList.map((app, index) => {
			const currentChild = app.form_contents ? getNameFromCustomForm(app.form_contents) : {
				lastname: app.child?.lastname,
				firstname: app.child?.firstname
			}

			// app_grp_id

			let currentGroup = groups && groups.application_groups.find(item => {
				const classTeacher = item.class_teacher && item.class_teacher.split(',');
				return classTeacher && classTeacher.includes(item.app_grp_id)
			});

			let vendorId = parseInt(vendor_id);
			let currentVendor = vendors.find(item => item.id2 === vendorId)

			if (!currentGroup && currentVendor) {
				currentGroup = currentVendor.app_groups && currentVendor.app_groups.find(appGrp => {
					const classTeacher = app.class_teacher && app.class_teacher.split(',');
					return classTeacher && classTeacher.includes(appGrp.app_grp_id)
				});

			}


			return (
				<tr key={index}>
					<td>
						<div className="name">
							{/* {app.child
								? app.child?.firstname + ' ' + app.child?.lastname
								: app.form_contents?.formData[0]?.fields[0]?.value} */}
							{`${currentChild.firstname} ${currentChild.lastname}`}
						</div>
					</td>
					<td>
						<div className="class">{currentGroup?.name || app.class_teacher}</div>
					</td>
					<td>
						<span>
							{app.is_following === 1 ? (
								<div className="circle-icon" style={{ ...style.attendanceAction, backgroundColor: '#14e414' }}></div>
							) : app.is_following === 2 ? (
								<div className="circle-icon" style={{ ...style.attendanceAction, backgroundColor: '#f26e21' }}></div>
							) : (
								''
							)}
							{app.is_following === null || app.is_following === undefined || app.is_following === 0 ? '' : ''}
						</span>
					</td>
					<td style={{ width: '300px' }}>
						<div className="attendance-status-container">
							<div>
								<div style={{ position: 'relative' }}>
									<div
										className="circle-icon"
										onClick={() => {
											handleAttendance(app, 'Present');
										}}
										style={{
											...style.attendanceAction,
											backgroundColor: app.attendance_status === 'Present' ? '#14e414' : 'gray',
										}}
									/>
									<div>Present 1</div>
									{/* {app.attendance_status === 'Present' ? <div className="exclude-icon"></div> : <span />} */}
								</div>
							</div>
							<div style={{ minHeight: 22 }}>
								<div style={{ position: 'relative' }}>
									<div
										className="circle-icon"
										onClick={() => {
											handleAttendance(app, 'Absent');
										}}
										style={{
											...style.attendanceAction,
											backgroundColor: app.attendance_status === 'Absent' ? 'red' : 'gray',
										}}></div>
									{/* {app.attendance_status === 'Absent' ? <div className="exclude-icon"></div> : <span />} */}
									<div>Absent</div>
								</div>
								<div>
									<div style={style.attendanceSubAction}>
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
								<div style={{ position: 'relative' }}>
									<div
										className="circle-icon"
										onClick={() => {
											handleAttendance(app, 'Tardy');
										}}
										style={{
											...style.attendanceAction,
											backgroundColor: app.attendance_status === 'Tardy' ? '#f26e21' : 'gray',
										}}></div>
									<div>Tardy</div>
								</div>

								<div>
									<div style={style.attendanceSubAction}>
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

					<td>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<input
								type="number"
								onChange={e => {
									handleHours(app, e.target.value, 'volunteer_hours');
								}}
								name={'volunteer_hours'}
								className={'field-input'}
								placeholder="Volunteer Hours"
								value={app?.volunteer_hours || ''}
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
								value={app?.mentoring_hours || ''}
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
				<Link to={`/dashboard/studentdata${vendor_id ? `?vendor=${vendor_id}` : ''}`} className="back-btn">
					<FontAwesomeIcon className="back-icon" icon={faAngleLeft} />
					Back
				</Link>
				<form onSubmit={handleSubmit(onSubmit)}>
					{attendance.isAttendanceUpdateSuccess && (
						<div style={{ marginTop: 12, marginBottom: 12 }}>Attendance has been updated successfully!</div>
					)}
					<div className="filter-container">
						<div className="field">
							<DatePicker
								dateFormat={DATE_FORMAT}
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
							{/* <input
								onChange={handleAttedanceDetailChange}
								// ref={register({ required: true })}
								type="time"
								name={'attendance_start_time'}
								className={'field-input'}
								placeholder="Start Name"
							/>
							<label className="field-label" for={`attendance_start_time`}>
								Start Time
							</label> */}

							<DatePicker
								className={'field-input'}
								onChange={handleTimeChange('attendance_start_time')}
								showTimeSelect
								showTimeSelectOnly
								timeIntervals={15}
								timeCaption="Time"
								dateFormat="h:mm aa"
								//selected={attendanceDetails.attendance_start_time && new Date(attendanceDetails.attendance_start_time)}
								disabled={false}
								name={'attendance_start_time'}
								placeholder="Start Time"
								value={attendanceDetails.attendance_start_time}
								customInput={<TimeCustomInput value={attendanceDetails.attendance_start_time} name="attendance_start_time" className={'field-input date-field'} label="Start Time" register={register} />}
							/>
							{/* <label className="field-label" for={`attendance_start_time`}>
								Start Time
							</label> */}
						</div>
						<div className="field">
							{/* <input
								onChange={handleAttedanceDetailChange}
								// ref={register({ required: true })}
								type="time"
								name={'attendance_end_time'}
								className={'field-input'}
								placeholder="End Time"
								value={attendanceDetails.attendance_end_time}
							/> */}

							<DatePicker
								className={'field-input'}
								onChange={handleTimeChange('attendance_end_time')}
								showTimeSelect
								showTimeSelectOnly
								timeIntervals={30}
								timeCaption="Time"
								dateFormat="h:mm aa"
								//selected={attendanceDetails.attendance_end_time}
								disabled={false}
								name={'attendance_end_time'}
								placeholder="End Time"
								value={attendanceDetails.attendance_end_time}
								customInput={<TimeCustomInput value={attendanceDetails.attendance_end_time} name="attendance_end_time" className={'field-input date-field'} label="End Time" register={register} />}
							/>
							{/* <label className="field-label" for={`attendance_end_time`}>
								End Time
							</label> */}
						</div>
						<div className="field">
							<input
								id="event_name"
								onChange={handleAttedanceDetailChange}
								// ref={register({ required: true })}
								name={'event_name'}
								className={'field-input'}
								placeholder="Event Name"
							/>
							<label className="field-label" for={`event_name`}>
								Event Name
							</label>
						</div>
						<div className="field">
							<input
								id="location"
								onChange={handleAttedanceDetailChange}
								// ref={register({ required: true })}
								name={'location'}
								className={'field-input'}
								placeholder="Location"
							/>
							<label className="field-label" for={`location`}>
								Location
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
							<FontAwesomeIcon
								onClick={() => {
									handleViewChange('grid');
								}}
								className={`view-icon ${viewMode === 'grid' ? 'selected-view' : ''}`}
								icon={faTh}
							/>
							<FontAwesomeIcon
								onClick={() => {
									handleViewChange('list');
								}}
								className={`view-icon ${viewMode === 'list' ? 'selected-view' : ''}`}
								icon={faBars}
							/>
						</div>
					</div>

					<div>
						{(appGroupName && viewMode === 'grid') && (
							<div className="field">
								<h4>{appGroupName}</h4>
							</div>
						)}
					</div>

					{viewMode === 'grid' ? (
						<div className="gridView">
							{filteredApplicationList.map(app => {
								const currentChild = app.form_contents ? getNameFromCustomForm(app.form_contents) : {
									lastname: app.child?.lastname,
									firstname: app.child?.firstname
								}
								let profile = app?.child?.image || ''
								if (app.form_contents) {
									const { formData = [] } = typeof app.form_contents === 'string' ? JSON.parse(app.form_contents) : app.form_contents
									const { fields = [] } = formData.find(e => e.fields[0].tag === 'profileImage') || {}
									if (fields.length) {
										const { value } = fields[0]
										const { url } = value ? JSON.parse(value) : {}
										profile = url.includes('file/') ? 'https://bcombs.s3.amazonaws.com/' + url : url;
									}
								} else if (!app.form_contents && profile) {
									profile = profile.includes('file/') ? 'https://bcombs.s3.amazonaws.com/' + profile : profile;
								}
								return (
									<div className="block">
										<div className="extra_activitybox">
											<div className="img-container" style={{ margin: '0 auto' }}>
												<img src={profile || ProfileImg} />
											</div>

											<div className="attendance-name">
												<a href={'/dashboard/menteeprofile/' + app.id}>
													<span>
														{/* {app.child
															? app.child?.firstname + ' ' + app.child?.lastname
															: app.form_contents?.formData[0]?.fields[0]?.value} */}
														{`${currentChild.firstname} ${currentChild.lastname}`}
													</span>
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

													<div style={style.attendanceSubAction}>
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

													<div style={style.attendanceSubAction}>
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
														value={app?.volunteer_hours || ''}
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
														value={app?.mentoring_hours || ''}
													/>
													<label className="field-label" for={`mentoring_hrs`}>
														Mentoring Hours
													</label>
												</div>
											</div>

											{/* <div className="attendance-invitation">
												{
													<div className="calendar-invite">
														Calendar Invite:{' '}
														<span>{`${
															app.is_following !== null
																? app.is_following === 1
																	? 'Accepted'
																	: 'Declined'
																: app.is_following === null
																? 'Blank'
																: 'Pending'
														}`}</span>
													</div>
												}
											</div> */}
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
										<th>Group</th>
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
								{attendance.isAttendanceUpdateLoading ? 'Please Wait...' : 'Submit'}
							</button>
						)}
					</div>
				</form>
			</div>

			<Confirmation
				isVisible={isConfirmationVisible}
				message={`Are you sure you want to save this attendance?`}
				toggleConfirmationVisible={setIsConfirmationVisible}
				onSubmit={handleAttendanceSave}
				submitButtonLabel="Submit"
			/>
		</ClassListViewStyled>
	);
}
