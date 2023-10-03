import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faMinusCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from "@reach/router";
// import { uuid } from 'uuidv4';
// import { getHours, max } from 'date-fns';
import { parse } from "query-string";

import { requestGetApplications, requestGetCustomApplicationByVendor } from '../../../redux/actions/Application';
import { requestGetForms } from '../../../redux/actions/FormBuilder';
import { requestUserGroup, requestArchiveGroup, requestAddArchiveGroup, requestRemoveGroupFromArchive, clearGroupArchive } from '../../../redux/actions/Groups';
import { requestVendor, requestVendorAppGroups } from '../../../redux/actions/Vendors';
import Loading from '../../../helpers/Loading.js'

const AttendanceSummaryStyled = styled.div`
	width: auto;
	max-width: 1920px;
	margin: auto;
	padding: 0rem 3em 2rem;

	#attendance {
		padding: 1rem;
		background-color: white;
		box-shadow: 0 0 25px #eae9e9;
		min-height: calc(100vh - 220px);

		max-height: calc(100vh - 500px);
    overflow: auto;
	}

	#attendance .header {
		display: flex;
    padding: 0 0 1.5rem 0;
    align-items: baseline;

		position: sticky;
    top: -16px;
    background: #fff;
    border-bottom: 1px solid #ddd;
	}

	#attendance .header .search-input {
		max-width: 450px;
    margin-left: unset;
	}

	#attendance .header .hideBtn {
		border: 0;
    color: white;
    width: 100%;
    max-width: 100px;
    box-shadow: none;
    border-radius: 3px;
    background-color: #f26e21;
		transition: all .3s ease-in-out;
	}

	#attendance .header .hideBtn span {
		padding-left: .5rem;
	}

	#attendance .header .hideBtn.disabled {
		opacity: .35;
		cursor: auto;
	}

	.field {
		padding: 0;
		margin: 0;
		display: flex;
		flex-flow: column-reverse;
	}
	.field-input {
		font-size: 18px;
		border: 0;
		border-bottom: 1.65px solid #ccc;
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

  .search-input {
    position: relative;
    // max-width: 300px;
    width: 100%;
    margin: 0 auto;
  }
  .search-input > input {
    text-indent: 2rem !important;
    background: transparent;
  }
  .search-input > label {
    padding-left: 1.5rem;
  }
  .search-input > svg {
    color: grey;
    opacity: 0.5;
    bottom: 13px;
    font-size: 18px;
    position: absolute;
    pointer-events: none;
    padding: 0 !important;
  }
  .search-input > svg:hover {
    box-shadow: none !important;
  }

	#groups {
		border: 0;
		width: 100%;
		text-align: center;
		border-collapse: collapse;
		// box-shadow: 0px 0px 10px #ccc;
		font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif;
	}

	#groups td,
	#groups th {
		border: 0;
		padding: 15px;
		text-align: left;
	}

	#groups tr:nth-child(odd) {
		background-color: #f9f9f9;
	}

	// #groups tr:hover {background-color: #ddd;}

	#groups th {
		background-color: #f26e21;
		color: white;
	}

	#groups a {
		color: #3e89fe;
		text-decoration: none;
	}

	.archived_hide {
		display: none;
		background-color: #ccc!important;
	}
	.archived_show {
		background-color: #ddd !important;
	}

	.footer-action {
		padding: 1rem 0 0;
	}
	.footer-action .hideShowGroupBtn {
		color: #f26e21;
    width: 100%;
    max-width: 150px;
    box-shadow: none;
    border-radius: 3px;
		border: 1px solid #f26e21;
    background-color: transparent;
		transition: all .3s ease-in-out;
	}
	.footer-action .hideShowGroupBtn:hover {
		background: rgb(242 110 33 / 10%);
	}

	@media (max-width: 840px) {
		padding: 0rem 1rem 2rem;
	}
`;

export default function index(props) {
	const dispatch = useDispatch();
	const { applications, groups: { archivedGroups, archiveUpdated }, auth, vendors, loading, form = {} } = useSelector(
		({ applications, groups, auth, vendors, loading, form }) => {
			return { applications, groups, auth, vendors, loading, form };
		}
	);
	const location = useLocation();
	const queryParams = parse(location.search);

	const { formAppGroups = [], formList = [] } = form;
	const [formIds, setFormIds] = useState([]);
	const [appGroups, setAppGroups] = useState([]);
	const [selectedVendor, setSelectedVendor] = useState({});
	const [search, setSearch] = useState('')
	const [selected, setSelected] = useState([])
	const [showArchived, setShowArchived] = useState(false)
	const [isLot, setIsLot] = useState(false)
	// appGroups = appGroups.filter((group) => {
	//   return group.vendor == vendor.id;
	// })

	const vendorIds = Array.isArray(vendors) && vendors.map(item => item.id);
	console.log('appGroups', appGroups)
	//  ( /*formIds.includes(appGroup.form) || */ /* vendorIds.includes(appGroup.vendor) */)
	const filteredGroups = form.formAppGroups && form.formAppGroups.filter(appGroup => (appGroup.form && (formIds.includes(appGroup.form))) || appGroup.form === null);
	const filteredFormList = form.formList
	const isShow = !!selected.find(s => archivedGroups.find(a => a.app_group_id === s.app_group_id))

	useEffect(() => {
		if (auth.user_id) {
			dispatch(requestUserGroup(auth.email));
			dispatch(requestVendor(auth.user_id));
			dispatch(requestArchiveGroup(auth.user_id))
		}
	}, []);

	useEffect(() => {

		if (queryParams.vendor && Array.isArray(vendors)) {
			const vendorId = parseInt(queryParams.vendor);
			const currentVendor = vendors.find(item => item.id2 === vendorId);

			if (currentVendor) {

				setSelectedVendor(currentVendor);
				setIsLot(currentVendor.name.includes('LOT') ? true : false);
				setAppGroups(currentVendor.app_groups);
				dispatch(requestGetCustomApplicationByVendor(currentVendor.id));
				dispatch(requestGetApplications(currentVendor.id));
				dispatch(requestVendorAppGroups(currentVendor.id));
				dispatch(requestGetForms({ vendor: currentVendor.id, currentUser: auth.user_id, isOwner: !!(auth.user_id == currentVendor.user), categories: [] }));
			}

		}
		else if (vendors && vendors[0]) {
			let defaultVendor = vendors.find(item => item.is_default);
			defaultVendor = defaultVendor ? defaultVendor : vendors[0];

			if (defaultVendor) {
				setSelectedVendor(defaultVendor);
				setIsLot(defaultVendor.name.includes('LOT') ? true : false);
				setAppGroups(defaultVendor.app_groups);
				dispatch(requestGetCustomApplicationByVendor(defaultVendor.id));
				dispatch(requestGetApplications(defaultVendor.id));
				dispatch(requestVendorAppGroups(defaultVendor.id))
				dispatch(requestGetForms({ vendor: defaultVendor.id, currentUser: auth.user_id, isOwner: !!(auth.user_id == defaultVendor.user), categories: [] }));
			}


		}

	}, [vendors]);

	useEffect(() => {

		if (form.formList) {
			const ids = formList && formList.map(form => form.form_id);
			setFormIds(ids)
		}
	}, [form.formList])
	// dispatch(requestVendorAppGroups(vendors[0].id))

	// useEffect(() => {
	// 	if (groups && groups.appplication_groups ) {

	// 		setAppGroups(groups.application_groups);
	// 	}
	// }, [groups]);

	useEffect(() => {
		if (archiveUpdated) {
			dispatch(requestArchiveGroup(auth.user_id))
			dispatch(clearGroupArchive())
			setSelected([])
		}
	}, [archiveUpdated])

	const getClassCount = group => {
		const size = applications.activeapplications.filter(app => {
			if (app.class_teacher) {
				return group.app_grp_id && app.class_teacher.includes(group.app_grp_id);
				//return group.app_grp_id && app.class_teacher == group.app_grp_id;
			}
		});

		return size.length;
	};
	///let testArray = [];
	const getFormClassCount = group => {

		const size = applications && applications.customActiveApplications && applications.customActiveApplications.filter(app => {
			if (app.class_teacher && app.class_teacher !== '' && group.form === app.form) {
				const classTeacher = app.class_teacher.split(',');
				return classTeacher.includes(group.app_grp_id);
			}
		});
		// if(group.form === '6838fda0-5407-11eb-8212-dafd2d0ae3ff'){
		// 	//6838fda0-5407-11eb-8212-dafd2d0ae3ff

		// }

		// if(applications && applications.customActiveApplications && applications.customActiveApplications && group.form === '6838fda0-5407-11eb-8212-dafd2d0ae3ff') {
		// 	const defaultIds = ['afd248f1-5b2a-11eb-8212-dafd2d0ae3ff','c577ef23-5f01-11eb-8212-dafd2d0ae3ff','849eb0b8-af53-11eb-8212-dafd2d0ae3ff','734333e5-af54-11eb-8212-dafd2d0ae3ff']
		// 	const applicationszzz = applications.customActiveApplications.filter(item => {
		// 		const classTeacher = item.class_teacher ? item.class_teacher.split(',') : [];
		// 		return (item.form === group.form ) && classTeacher.some(id => defaultIds.includes(id));
		// 	});
		// }

		return size ? size.length : 0
	};


	const getDefaultClassCount = () => {
		const appGroupIds = appGroups ? appGroups.map(item => item.app_grp_id) : [];

		const size = applications.activeapplications.filter(app => {
			if (app.class_teacher) {
				const classTeacher = app.class_teacher.split(',');
				return classTeacher.some(id => appGroupIds.includes(id));
			}
		});
		return size.length;
	};

	const handleSelectAll = ({ target: { checked } }) => {
		let newSelected = []
		if (checked) {
			const allGroups = filteredGroups.map(group => {
				const formGroup = group.form && filteredFormList.find(formItem => formItem.form_id === group.form)
				return {
					vendor_id: auth.user_id,
					app_group_id: group?.app_grp_id,
					app_group_type: formGroup && formGroup.form_contents ? 'forms' : 'bcombs'
				}
			})
			const allForms = filteredFormList.map(item => ({
				vendor_id: auth.user_id,
				app_group_id: item?.form_id,
				app_group_type: 'forms'
			}))
			newSelected = [...allGroups, ...allForms]
		}
		setSelected(newSelected)
	}

	const handleSelect = ({ target: { checked } }, data) => {
		setSelected(checked ? [...selected, data] : selected.filter(e => e.app_group_id !== data.app_group_id))
	}

	const searched = (strArr = []) => {
		return !search || !![...strArr, 'input', 'view'].find(str => str.toLowerCase().includes(search.toLowerCase()))
	}

	const renderTableData = (archived = false) => {

		const currentForm = formList.find(form => form.vendor === vendors[0]?.id);
		let newFilteredGroups = [...filteredGroups]
		if (archived) {
			newFilteredGroups = newFilteredGroups.filter(g => archivedGroups.find(e => e.app_group_id === g?.app_grp_id))
		} else {
			newFilteredGroups = newFilteredGroups.filter(g => !archivedGroups.find(e => e.app_group_id === g?.app_grp_id))
		}

		return newFilteredGroups
			.map((group, index) => {
				let count = group.size;
				const formGroup = group.form && form.formList.find(formItem => formItem.form_id === group.form);
				let classCount = formGroup && formGroup.form_contents ? getFormClassCount(group) : getClassCount(group);
				let availableCount = count - classCount;
				availableCount = availableCount < 0 ? 0 : availableCount;
				const isCustomForm = formGroup && formGroup.form_contents;

				const vendorDetails = vendors.filter(v => v.id == group.vendor)[0];

				return searched([
					formGroup && formGroup.form_contents ? formGroup.form_contents?.formTitle : isLot ? 'LOT Form' : auth && auth.nickname === 'lot' ? 'LOT Form' : 'Mentoring Application',
					classCount.toString(), count.toString()
				]) ? (
					<tr key={group.id} className={`${archived ? 'archived' : ''}_${showArchived ? 'show' : 'hide'}`}>
						<td>
							<input
								type='checkbox'
								checked={selected.find(e => e.app_group_id === group?.app_grp_id)}
								onChange={e => handleSelect(e, {
									vendor_id: auth.user_id,
									app_group_id: group?.app_grp_id,
									app_group_type: formGroup && formGroup.form_contents ? 'forms' : 'bcombs'
								})
								}
							/>
						</td>
						<td>
							{formGroup && formGroup.form_contents
								? formGroup.form_contents?.formTitle
								: isLot ? 'LOT Form' : auth && auth.nickname === 'lot' ? 'LOT Form' : 'Mentoring Application'}
						</td>
						<td>
							{group.name}
							<div>{classCount} / {count}</div>
						</td>
						<td>
							{formGroup && formGroup.form_contents
								? <Link to={`/dashboard/attendance/${formGroup.vendor}/custom?formId=${formGroup.form_id}&appGroupId=${group.app_grp_id}`}>Input</Link>
								: <Link to={'/dashboard/attendance/' + selectedVendor?.id2 + '/' + group.name}>Input</Link>
							} /
							{formGroup && formGroup.form_contents
								? <Link to={'/dashboard/attendance/view/' + group?.app_grp_id + '?type=custom&formId=' + formGroup.form_id + `&appGroupId=${group.app_grp_id}`}>View</Link>
								: <Link to={'/dashboard/attendance/view/' + group?.app_grp_id}>View</Link>
							}/
							<Link to={`/dashboard/attendance/events?vendorId=${selectedVendor?.id2}&attendanceType=${isCustomForm ? 'forms' : 'mentoring'}&formId=${isCustomForm ? formGroup.form_id  : group.app_grp_id}`}>Events</Link>
						</td>
						<td>
							{formGroup && formGroup.form_contents
								? <Link to={'/dashboard/grades/input?group_id=' + group?.app_grp_id + '&group_type=forms' + `&appGroupId=${group.app_grp_id}&form_id=${formGroup.form_id}`}>Input</Link>
								: <Link to={'/dashboard/grades/input?group_id=' + group?.app_grp_id + '&group_type=bcombs' + `&vendor=${vendorDetails?.id2}`}>Input</Link>
							} /
							{formGroup && formGroup.form_contents
								? <Link to={'/dashboard/grades?group_id=' + group?.app_grp_id + '&group_type=forms'}>View</Link>
								: <Link to={'/dashboard/grades?group_id=' + group?.app_grp_id + '&group_type=bcombs' + `&vendor=${vendorDetails?.id2}`}>View</Link>
							}
						</td>
					</tr>
				) : null
			});
	};

	// const getTotalCount = () => {
	// 	let totalCount = 0;

	// 	// const filteredGroups = form.formAppGroups && form.formAppGroups.filter(appGroup => (appGroup.form && formIds.includes(appGroup.form)) || appGroup.form === null);

	// 	// for (const group of appGroups) {
	// 	// 	totalCount += group.size;
	// 	// }

	// 	for (const group of filteredGroups) {
	// 		totalCount += group.size;
	// 	}
	// 	// filteredGroups.map(group => {
	// 	// 	totalCount += group.size;
	// 	// });
	// 	return totalCount;
	// };


	const getDefaultTotalCount = () => {
		let totalCount = 0;
		appGroups && appGroups.map(group => {
			totalCount += group.size;
		});
		return totalCount;
	};


	const getTotalAvailable = () => {
		let totalAvailable = 0;
		// const totalCount = getTotalCount();
		const totalClassCount = getTotalClassCount();
		// const filteredGroups = form.formAppGroups && form.formAppGroups.filter(appGroup => (appGroup.form && formIds.includes(appGroup.form)) || appGroup.form === null);

		for (const group of filteredGroups) {

			totalAvailable += group.size
		}


		// for (const group of appGroups) {
		// 	//let classCount = getClassCount(group);
		// 	totalAvailable += group.size ;
		// }




		return totalAvailable - totalClassCount;
	};

	const getDefaultTotalAvailable = () => {
		let totalAvailable = 0;
		for (const group of appGroups) {
			let classCount = getClassCount(group);
			totalAvailable += group.size - classCount;
		}

		totalAvailable = totalAvailable < 0 ? 0 : totalAvailable;
		return totalAvailable;
	};

	const getTotalClassCount = () => {
		let totalClassCount = 0;
		const formGroups = form && form.formAppGroups ? form.formAppGroups.filter(appGroup => appGroup.form) : []
		for (const group of appGroups) {
			totalClassCount += getClassCount(group);
		}

		for (const group of formGroups) {
			totalClassCount += getFormClassCount(group);
		}

		return totalClassCount;
	};

	// **************** */..
	const getTotalCountByForm = id => {


		const formGroups = form && form.formAppGroups ? form.formAppGroups.filter(appGroup => appGroup.form === id) : []

		// const formGroups = groups.application_groups.filter(item => item.form === id);

		let total = formGroups.reduce((accum, item) => {
			return accum + item.size;
		}, 0);

		return total > 0 ? total : 0;
	};

	// const getTotalAvailableByForm = id => {
	// 	const formGroups = form && form.formAppGroups ? form.formAppGroups.filter(appGroup => appGroup.form === id) : [];
	// 	// let total = 0;
	// 	// if(formGroups) {
	// 	// 	total = formGroups && formGroups.reduce((accum, item) => {
	// 	// 		let classCount = item.group ? getFormClassCount(item) : 0;
	// 	// 		return accum + item.size - classCount;
	// 	// 	}, 0);
	// 	// }


	// 	let total = 0;
	// 	for (const group of formGroups) {
	// 		let classCount = getFormClassCount(group);
	// 		total += group.size - classCount;
	// 	}

	// 	total = total < 0 ? 0 : total;
	// 	return total;
	// };

	const getTotalClassCountByForm = id => {

		const formGroups = form && form.formAppGroups && form.formAppGroups.filter(appGroup => appGroup.form === id);

		//let totalClassCount = 0;
		// if(id === '6838fda0-5407-11eb-8212-dafd2d0ae3ff'){

		// }
		const appGrpIds = formGroups.map(item => item.app_grp_id).filter(item => item)


		const size = applications && applications.customActiveApplications && applications.customActiveApplications.filter(app => {
			if ((app.class_teacher && app.class_teacher !== '')) {
				const classTeacher = app.class_teacher.split(',');
				return classTeacher.some(id => appGrpIds.includes(id)) //classTeacher.includes(group.app_grp_id)
			}
			return id === app.form;
		});

		return size ? size.length : 0
		// for (const group of formGroups) {
		// 	totalClassCount += getFormClassCount(group);
		// 	if(group.form === '6838fda0-5407-11eb-8212-dafd2d0ae3ff'){
		// 		//6838fda0-5407-11eb-8212-dafd2d0ae3ff

		// 	}

		// }
		// console.log('getTotalClassCountByForm', totalClassCount)
		//return totalClassCount;
	};

	const handleSearch = (value) => {
		setSearch(value)
		setShowArchived(true)
	}

	const handleHide = () => {
		if (isShow) {
			dispatch(requestRemoveGroupFromArchive({
				archivedGroupIds: selected
					.map(s => (archivedGroups.find(a => a.app_group_id === s.app_group_id))?.archived_group_id)
					.filter(e => e),
				vendorId: auth.user_id
			}))
		} else {
			dispatch(requestAddArchiveGroup(selected))
		}
	}
	return (
		<AttendanceSummaryStyled>
			<h2>Data</h2>
			<div id="attendance">
				{
					loading.archiveLoading ? (
						<Loading />
					) : (
						<>
							<div className='header'>
								<div className='field search-input'>
									<FontAwesomeIcon className='search-icon' icon={faSearch} />
									<input
										id='search'
										name='search'
										placeholder='Search'
										className='field-input'
										value={search || ''}
										onChange={(e) => handleSearch(e.target.value)}
									/>
									<label className='field-label' htmlFor='search'>
										Search
									</label>
								</div>
								<button
									className={`hideBtn ${selected.length === 0 ? 'disabled' : ''}`}
									disabled={selected.length === 0}
									onClick={handleHide}
								>
									<FontAwesomeIcon icon={isShow ? faEye : faEyeSlash} />
									<span>{isShow ? 'Show' : 'Hide'}</span>
								</button>
							</div>
							<div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 12, paddingBottom: 12, textDecoration: 'none' }}>
								<Link to={`/dashboard/attendance/events?vendorId=${queryParams?.vendor || selectedVendor?.id2}`}>
									Attendance Events (All)
								</Link>
							</div>
							<table id="groups">
								<tbody>
									<tr>
										<th className='checkboxTh'>
											<input
												type='checkbox'
												checked={selected.length && selected.length === (filteredGroups.length + filteredFormList.length)}
												onChange={handleSelectAll}
											/>
										</th>
										<th>Form</th>
										<th>
											<div>Class</div>
											<div>Count / Total</div>
										</th>
										<th>Attendance</th>
										<th>Grades</th>
									</tr>
									{/* <tr>
										<td></td>
										<td>Total</td>
										<td>{getTotalCount()}</td>
										<td>{getTotalAvailable()}</td>
										<td>{getTotalClassCount()}</td>
										<td></td>
									</tr> */}

									{
										searched([isLot ? 'LOT Form' : auth && auth.nickname === 'lot' ? 'LOT Form' : 'Mentoring Application', getDefaultClassCount().toString(), getDefaultTotalCount().toString(), 'All']) && (
											<tr>
												<td />
												<td>{isLot ? 'LOT Form' : auth && auth.nickname === 'lot' ? 'LOT Form' : 'Mentoring Application'}</td>
												<td>
													All
													<div>{getDefaultClassCount()} / {getDefaultTotalCount()}</div>
												</td>
												{/* <td>{getDefaultTotalAvailable()}</td> */}
												<td>
													<Link to={'/dashboard/attendance/' + selectedVendor?.id2 + '/all'}>Input</Link> /
													<Link to={`/dashboard/attendance/view/${selectedVendor?.id2}?type=all`}>View</Link> /
													<Link to={`/dashboard/attendance/events?vendorId=${selectedVendor?.id2}&attendanceType=mentoring`}>Events</Link>
												</td>
												<td>
													<Link to={`/dashboard/grades/input?group_id=${selectedVendor?.id}&group_type=bcombs&request_type=vendor&type=all&vendor=${selectedVendor?.id2}`}>Input</Link> /
													<Link to={`/dashboard/grades?group_id=${selectedVendor?.id}&group_type=bcombs&request_type=vendor&type=all&vendor=${selectedVendor?.id2}`}>View</Link>
												</td>
											</tr>
										)
									}
									{filteredFormList
										.filter(g => !archivedGroups.find(e => e.app_group_id === g?.form_id))
										.map(item => {
											let appGroupIdList = item.app_groups.map(itm => itm.app_grp_id);
											appGroupIdList = appGroupIdList.join(',')
											return searched([
												item.form_contents?.formTitle || '',
												getTotalClassCountByForm(item.form_id).toString(),
												getTotalCountByForm(item.form_id).toString()
											]) ? (
												<tr>
													<td>
														<input
															type='checkbox'
															checked={selected.find(e => e.app_group_id === item?.form_id)}
															onChange={e => handleSelect(e, {
																vendor_id: auth.user_id,
																app_group_id: item?.form_id,
																app_group_type: 'forms'
															})
															}
														/>
													</td>
													<td>{item.form_contents?.formTitle}</td>
													<td>
														All
														<div>{getTotalClassCountByForm(item.form_id)} / {getTotalCountByForm(item.form_id)}</div>
													</td>
													<td>
														<Link to={`/dashboard/attendance/${item.vendor}/custom?formId=${item.form_id}&type=all&appGroupIds=${appGroupIdList}&vendor=${selectedVendor?.id2}`}>Input</Link> /
														<Link to={`/dashboard/attendance/view/${item.vendor}?type=custom&formId=${item.form_id}&appGroupIds=${appGroupIdList}`}>View</Link> /
														<Link to={`/dashboard/attendance/events?vendorId=${selectedVendor?.id2}&attendanceType=forms&formId=${item.form_id}`}>Events</Link>
													</td>
													<td>
														<Link to={'/dashboard/grades/input?group_id=' + item?.form_id + '&group_type=forms&type=all' + `&appGroupIds=${appGroupIdList}&vendor=${selectedVendor?.id2}`}>Input</Link>/
														<Link to={'/dashboard/grades?group_id=' + item?.form_id + '&group_type=forms&type=all'}>View</Link>

														{/* <Link to={`/dashboard/grades/input?&group_id=${item.vendor}&group_type=forms&request_type=vendor`}>Input</Link> /
															<Link to={`/dashboard/grades?&group_id=${item.vendor}&group_type=forms&request_type=vendor`}>View</Link> */}
													</td>
												</tr>
											) : null
										})}
									{renderTableData()}
									{filteredFormList
										///	.filter(g => archivedGroups.find(e => e.app_group_id === g?.form_id))
										.map(item => {
											return searched([
												item.form_contents?.formTitle || '',
												getTotalClassCountByForm(item.form_id).toString(),
												getTotalCountByForm(item.form_id).toString()
											]) ? (
												<tr className={`archived_${showArchived ? 'show' : 'hide'}`}>
													<td>
														<input
															type='checkbox'
															checked={selected.find(e => e.app_group_id === item?.form_id)}
															onChange={e => handleSelect(e, {
																vendor_id: auth.user_id,
																app_group_id: item?.form_id,
																app_group_type: 'forms'
															})
															}
														/>
													</td>
													<td>{item.form_contents?.formTitle}</td>
													<td>
														All
														<div>{getTotalClassCountByForm(item.form_id)} / {getTotalCountByForm(item.form_id)}</div>
													</td>
													<td>
														<Link to={`/dashboard/attendance/${item.vendor}/custom?formId=${item.form_id}`}>Input</Link> /
														<Link to={`/dashboard/attendance/view/${item.vendor}?type=custom&formId=${item.form_id}`}>View</Link>
														<Link to={`/dashboard/attendance/events?vendorId=${selectedVendor?.id2}&attendanceType=forms&formId=${item.form_id}`}>Events</Link>
													</td>
													<td>
														<Link to={'/dashboard/grades/input?group_id=' + item?.form_id + '&group_type=forms'}>Input</Link>/
														<Link to={'/dashboard/grades?group_id=' + item?.form_id + '&group_type=forms'}>View</Link>

														{/* <Link to={`/dashboard/grades/input?&group_id=${item.vendor}&group_type=forms&request_type=vendor`}>Input</Link> /
															<Link to={`/dashboard/grades?&group_id=${item.vendor}&group_type=forms&request_type=vendor`}>View</Link> */}
													</td>
												</tr>
											) : null
										})}
									{renderTableData(true)}
								</tbody>
							</table>
							<div className='footer-action'>
								{
									(archivedGroups && archivedGroups.length > 0) && (
										<button
											className={`hideShowGroupBtn`}
											onClick={() => setShowArchived(!showArchived)}
										>
											<span>{showArchived ? 'Hide hidden groups' : 'Show hidden groups'}</span>
										</button>
									)
								}
							</div>
						</>
					)
				}
			</div>
		</AttendanceSummaryStyled>
	);
}
