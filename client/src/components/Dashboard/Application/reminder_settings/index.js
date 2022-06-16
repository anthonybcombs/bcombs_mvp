import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import ErrorMessage from "../../../../helpers/ErrorMessage";
import Loading from "../../../../helpers/Loading.js";

import { uuid } from "uuidv4";

import { Multiselect } from "multiselect-react-dropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';

import moment from 'moment';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { format } from "date-fns";

const ReminderSettingsStyled = styled.div`
  .reminder-settings {
    padding: 1.2em 1em;
  }

  .reminder-settings .left {
    max-width: 50%
  }

  .reminder-settings .left > div {
    margin: 0px 0px 20px !important;
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

  .select-field-wrapper {
    position: relative;
  }

  .select-field-wrapper:after {
    content: "\f078";
    position: absolute;
    right: 0;
    bottom: 18px;
    font-size: 12px;
    color: #555 !important;
    font-family: "fontawesome";
    pointer-events: none;
  }

  .select-field-wrapper select {
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
  }

  .react-datepicker__day--highlighted{
		background-color: #f26e21 !important;
	}
	.react-datepicker__day--disabled {
		color: #ccc !important;
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

  .form-fields-list {
    display: grid;
    grid-template-columns: 4fr 4fr;
  }

  .formsettings-btn-container {
    margin-top: 40px;
    text-align: right;
  }

  .formsettings-btn-container button {
    color: #555555;
    cursor: default;
    border: 0;
    border-bottom-color: transparent;
    -webkit-text-decoration: none;
    text-decoration: none;
    cursor: pointer;
    background: #f26e21;
    color: white;
    border-radius: 25px;
    padding: 12px 25px;
    display: inline-block;
    font-size: 16px;
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
      {label}
    </label>
    <FontAwesomeIcon icon={faCalendar} className="calendar-icon" />
  </div>
);

const CustomRangePicker = ({
  onChange,
  placeholder,
  selected,
  customInput = null,
  highlightDates = [],
  minDate = null,
  maxDate = null
}) => {

  return (
    <DatePicker
      minDate={minDate ? minDate : null}
      maxDate={maxDate ? maxDate : null}
      dateFormat={DISPLAY_DATE_FORMAT}
      readOnly={false}
      style={{ marginTop: 24 }}
      highlightDates={highlightDates.length ? highlightDates.map(date => {
        return typeof date === 'string' ? parseDate(date) : date
      }) : []}
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
            display: 'none',
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
      customInput={customInput ? customInput : <DateCustomInput label={placeholder} className={'field-input date-field'} />}
      selected={selected}
    />
  );
};

const DATE_FORMAT = "yyyy-MM-dd";
const DATE_KEY_FORMAT = 'MM_dd_yyyy';
//const DATE_KEY_FORMAT = 'yyyy-MM-dd';
const DISPLAY_DATE_FORMAT = 'MM/dd/yyyy';

export default function index({
  vendor,
  appGroups = [],
  formList = [],
  reminderList = [],
  handleCreateGroupReminder,
  isLot = false }) {

  const cFields = [{
    id: uuid(),
    name: 'First Name',
    value: 'firstname',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Last Name',
    value: 'lastname',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Nick Name',
    value: 'nickname',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Date of Birth',
    value: 'dateofbirth',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Gender',
    value: 'gender',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Ethinicity',
    value: 'ethinicity',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Phone Type',
    value: 'phonetype',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Phone Number',
    value: 'phonenumber',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Email Type',
    value: 'emailtype',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Email Address',
    value: 'emailaddress',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Address',
    value: 'address',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'City',
    value: 'city',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'State',
    value: 'state',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Zip Code',
    value: 'zipcode',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Location Site',
    value: 'locationsite',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Program',
    value: 'program',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Child Lives With',
    value: 'childliveswith',
    cat: 'Child Information'
  }, {
    id: uuid(),
    name: 'Grade',
    value: 'grade',
    cat: 'General Information'
  }, {
    id: uuid(),
    name: 'School Name',
    value: 'schoolname',
    cat: 'General Information'
  }, {
    id: uuid(),
    name: 'School Number',
    value: 'schoolnumber',
    cat: 'General Information'
  }, {
    id: uuid(),
    name: 'Are there currently any problems with your child either at home or at school?',
    value: 'childproblems',
    cat: 'General Information'
  }, {
    id: uuid(),
    name: 'Year Started as Mentee',
    value: 'yearstartedmentee',
    cat: 'General Information'
  }, {
    id: uuid(),
    name: 'Hobbies/Personal Interests',
    value: 'hobbies',
    cat: 'General Information'
  }, {
    id: uuid(),
    name: 'Life Events',
    value: 'lifeevents',
    cat: 'General Information'
  }, {
    id: uuid(),
    name: 'Career Goals',
    value: 'careergoals',
    cat: 'General Information'
  }, {
    id: uuid(),
    name: 'List of Colleges',
    value: 'listcolleges',
    cat: 'General Information'
  }, {
    id: uuid(),
    name: 'Group and Other Affiliations',
    value: 'groupaffiliations',
    cat: 'General Information'
  }, {
    id: uuid(),
    name: 'List of Awards',
    value: 'listofawards',
    cat: 'General Information'
  }, {
    id: uuid(),
    name: 'List of Accomplishments',
    value: 'listofaccomplishments',
    cat: 'General Information'
  }, {
    id: uuid(),
    name: 'What does the mentee hope to gain from the program?',
    value: 'menteehopegain',
    cat: 'General Information'
  }, {
    id: uuid(),
    name: 'Doctor Name',
    value: 'doctorname',
    cat: 'Emergency Medical Care Information'
  }, {
    id: uuid(),
    name: 'Doctor Phone',
    value: 'doctorphone',
    cat: 'Emergency Medical Care Information'
  }, {
    id: uuid(),
    name: 'Hospital Preference',
    value: 'hospitalpreference',
    cat: 'Emergency Medical Care Information'
  }, {
    id: uuid(),
    name: 'Hospitall Phone',
    value: 'hospitalphone',
    cat: 'Emergency Medical Care Information'
  }];

  const pFields = [{
    id: uuid(),
    name: 'First Name',
    value: 'firstname',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'Last Name',
    value: 'lastname',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'Date of Birth',
    value: 'dateofbirth',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'Gender',
    value: 'gender',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'Ethinicity',
    value: 'ethinicity',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'Phone Type',
    value: 'phonetype',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'Phone Number',
    value: 'phonenumber',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'Email Type',
    value: 'emailtype',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'Email Address',
    value: 'emailaddress',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'Address',
    value: 'address',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'City',
    value: 'city',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'State',
    value: 'state',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'Zip Code',
    value: 'zipcode',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'Occupation',
    value: 'occupation',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: "Employer's Name",
    value: 'employersname',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'What are some of your expectations from the Mentoring Program?',
    value: 'expectationsmentoringprogram',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'Why are you referring your child to our program?',
    value: 'parentreason',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'How long have you lived in this area?',
    value: 'livedinarea',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'What is your highest level of education?',
    value: 'levelofeducation',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'How important is it to you that your child graduates from high school?',
    value: 'childimportancetograduate',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'How important is it to you that your child attends college?',
    value: 'childimportancetocollege',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'How did you find us?',
    value: 'howdidyoufindus',
    cat: 'Family Information'
  }, {
    id: uuid(),
    name: 'First Name',
    value: 'ecfirstname',
    cat: 'Emergency Contact'
  }, {
    id: uuid(),
    name: 'Last Name',
    value: 'eclastname',
    cat: 'Emergency Contact'
  }, {
    id: uuid(),
    name: 'Gender',
    value: 'ecgender',
    cat: 'Emergency Contact'
  }, {
    id: uuid(),
    name: 'Mobile Phone',
    value: 'ecmobilephone',
    cat: 'Emergency Contact'
  }, {
    id: uuid(),
    name: 'Work Phone',
    value: 'ecworkphone',
    cat: 'Emergency Contact'
  }, {
    id: uuid(),
    name: 'Relationship To Child',
    value: 'ecrelationshiptochild',
    cat: 'Emergency Contact'
  }];

  useEffect(() => {

    setFAppGroups(setAppGroupSelect(appGroups));
  }, [appGroups])

  useEffect(() => {

    setChildFieldList([...cFields]);
    setParentFieldList([...pFields]);


    console.log('new vendor', vendor);
  }, [vendor])

  const setAppGroupSelect = (appGroups) => {
    let x = [];
    appGroups.map((ap) => {
      x.push({
        id: ap.id,
        name: ap.name,
        value: ap.app_grp_id
      })
    })
    x.unshift({
      id: 'all',
      name: 'All',
      value: 'all'
    })

    return x;
  }

  const [fAppGroups, setFAppGroups] = useState([])
  const [selectedForm, setSelectedForm] = useState("default");
  const [selectedFormName, setSelectedFormName] = useState(isLot ? "LOT® Form" : "Bcombs Form");
  const [childFieldList, setChildFieldList] = useState([]);
  const [parentFieldList, setParentFieldList] = useState([]);

  const [selectedDate, setSelectedDate] = useState(moment().toDate());
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [selectedFields1, setSelectedFields1] = useState([]);
  const [selectedFields2, setSelectedFields2] = useState([]);

  const [showSucessMessage, setShowSuccessMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();

    console.log('selectedDate', selectedDate);
    console.log('selectedGroups', selectedGroups);
    console.log('selectedForm', selectedForm);
    console.log('selectedFields1', selectedFields1);
    console.log('selectedFields2', selectedFields2);

    const isAllSelected = selectedGroups.some(x => x.value == 'all');

    console.log('isAllSelected', isAllSelected);

    let payload;

    if (selectedForm == 'default') {
      payload = {
        date: format(
          new Date(selectedDate),
          DATE_FORMAT),
        vendor_id: vendor.id,
        app_groups: isAllSelected ? appGroups.map(x => x.app_grp_id) : selectedGroups.map(x => x.value),
        form: selectedForm,
        is_customForm: false,
        form_fields: {
          fields1: selectedFields1.map(x => x.value),
          fields2: selectedFields2.map(x => x.value)
        },
        form_name: selectedFormName
      }
    } else {
      payload = {
        date: format(
          new Date(selectedDate),
          DATE_FORMAT),
        vendor_id: vendor.id,
        app_groups: isAllSelected ? appGroups.map(x => x.app_grp_id) : selectedGroups.map(x => x.value),
        form: selectedForm,
        is_customForm: true,
        custom_fields: JSON.stringify(selectedFields1),
        form_name: selectedFormName
      }
    }

    console.log('selectedFields1', selectedFields1);

    console.log('set reminder payload', payload);

    handleCreateGroupReminder(payload);

    setTimeout(() => {
      setShowSuccessMessage(true);
    }, 7000)
  }

  console.log('formList', formList);

  const getCustomFields = (formId) => {

    const INVALID_TYPES = ['login', 'pageBreak', 'file', 'sectionBreak'];

    const selectedForm = formList.filter((form) => {
      return form.form_id === formId;
    })[0];

    let formData = selectedForm?.form_contents?.formData?.length > 0 ?
      selectedForm.form_contents.formData
      :
      [];

    formData = formData.filter(x => {
      return !INVALID_TYPES.includes(x.type);
    });

    console.log("formData", formData);

    let formattedFields = [];

    formData.map((fd) => {
      if (fd?.fields.length > 0) {
        const fields = fd.fields;
        fields.map((f) => {
          formattedFields.push({
            cat: fields.length > 1 ? fd.label : '',
            fdId: fd.id,
            name: fields.length > 1 ? f.label : fd.label,
            value: f.id
          })
        })
      }
    });

    console.log('formattedFields', formattedFields);

    return formattedFields;
  }

  console.log('reminderList', reminderList);

  console.log('vendorrrrrrrrrrr',vendor)
  return (
    <ReminderSettingsStyled>
      <div className="reminder-settings">
        <div className="left">
          <div>
            <div className="field custom-range-picker">
              <CustomRangePicker
                selected={selectedDate}
                onChange={value => {
                  //handleLeftCustomRangeDatePickerChange('start', value);
                  console.log('value', value);

                  setSelectedDate(moment(value).toDate());
                }}

                placeholder="Date"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="field select-field-wrapper">
              <select className="field-input"
                onChange={({ target }) => {
                  setSelectedForm(target.value);
                  console.log("target.innerText", target.innerText);

                  if (target.value === 'default') {
                    setChildFieldList([...cFields]);
                    setParentFieldList([...pFields]);

                    setSelectedFormName(isLot ? 'LOT® Form' : 'Bcombs Form');
                    setFAppGroups(setAppGroupSelect(appGroups));
                  } else {
                    const formattedFields = getCustomFields(target.value);
                    setChildFieldList(formattedFields);
                    setParentFieldList([]);

                    let form = formList.filter(f => f.form_id == target.value);

                    form = form.length > 0 ? form[0] : {};

                    setFAppGroups(setAppGroupSelect(form.app_groups));
                    setSelectedFormName(form?.form_contents?.formTitle);
                  }

                  setSelectedFields1([]);
                  setSelectedFields2([]);
                }}
              >
                <option key={vendor.id} value="default">
                  {vendor.is_daycare === 1 && !isLot ? `Daycare ` : isLot ? 'LOT® ' : `Bcombs `}Form
                </option>
                {
                  formList.map(form => (
                    <option key={form.form_id} value={form?.form_id}>
                      {form?.form_contents?.formTitle}
                    </option>
                  ))
                }
              </select>
              <label className="field-label">
                Form
              </label>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="field">
            Select a field to be reset and updated
          </div>
        </div>
        {
          selectedForm == 'default' ? (
            <div className="form-fields-list">
              <div className="form-group">
                <div className="field">
                  <Multiselect
                    className="field-input"
                    options={childFieldList}
                    placeholder="Choose Multiple"
                    displayValue="name"
                    closeIcon="cancel"
                    closeOnSelect={false}
                    showCheckbox={true}
                    groupBy="cat"
                    selectedValues={selectedFields1}
                    onSelect={selectedList => {
                      setSelectedFields1(selectedList);
                    }}
                    onRemove={selectedList => {
                      setSelectedFields1(selectedList);
                    }}
                  />
                  <label className="field-label">
                    Child Fields
                  </label>
                </div>
                <div style={{ paddingLeft: 10 }}>
                  <input
                    type="checkbox"
                    name="child_field_select_all"
                    onChange={e => {

                      if (e.target.checked) {
                        setSelectedFields1(childFieldList)
                      }
                      else {
                        setSelectedFields1([])
                      }
                    }}

                  /> Select All
                </div>
              </div>
              <div className="form-group">
                <div className="field">
                  <Multiselect
                    className="field-input"
                    options={parentFieldList}
                    placeholder="Choose Multiple"
                    displayValue="name"
                    closeIcon="cancel"
                    closeOnSelect={false}
                    showCheckbox={true}
                    groupBy="cat"
                    selectedValues={selectedFields2}
                    onSelect={selectedList => {
                      setSelectedFields2(selectedList);
                    }}
                    onRemove={selectedList => {
                      setSelectedFields2(selectedList);
                    }}
                  />
                  <label className="field-label">
                    Parent Fields
                  </label>
                </div>
                <div style={{ paddingLeft: 10 }}>
                  <input
                    type="checkbox"
                    name="parent_field_select_all"
                    onChange={e => {

                      if (e.target.checked) {
                        setSelectedFields2(parentFieldList)
                      }
                      else {
                        setSelectedFields2([])
                      }
                    }}

                  /> Select All
                </div>
              </div>
            </div>
          ) : (
            <div className="form-fields-list">
              <div className="form-group">
                <div className="field">
                  <Multiselect
                    className="field-input"
                    options={childFieldList}
                    placeholder="Choose Multiple"
                    displayValue="name"
                    closeIcon="cancel"
                    closeOnSelect={false}
                    showCheckbox={true}
                    groupBy="cat"
                    selectedValues={selectedFields1}
                    onSelect={selectedList => {
                      setSelectedFields1(selectedList);
                    }}
                    onRemove={selectedList => {
                      setSelectedFields1(selectedList);
                    }}
                  />
                  <label className="field-label">
                    Custom Fields 1
                  </label>
                </div>
                <div style={{ paddingLeft: 10 }}>
                  <input
                    type="checkbox"
                    name="custom_field_select_all"
                    onChange={e => {

                      if (e.target.checked) {
                        setSelectedFields1(childFieldList)
                      }
                      else {
                        setSelectedFields1([])
                      }
                    }}

                  /> Select All
                </div>
              </div>
            </div>
          )
        }
        <div className="form-group">
          <div className="field">
            <Multiselect
              className="field-input"
              options={fAppGroups}
              placeholder="Choose Multiple"
              displayValue="name"
              closeIcon="cancel"
              closeOnSelect={false}
              showCheckbox={true}
              selectedValues={selectedGroups}
              onSelect={selectedList => {
                setSelectedGroups(selectedList);
              }}
              onRemove={selectedList => {
                setSelectedGroups(selectedList);
              }}
            />
            <label className="field-label">
              Group
            </label>
          </div>
          <div style={{ paddingLeft: 10 }}>
            <input
              type="checkbox"
              name="group_field_select_all"
              onChange={e => {
                console.log('fAppGroups',fAppGroups)
                if (e.target.checked) {
                  setSelectedGroups(fAppGroups);
                }
                else {
                  setSelectedGroups([])
                }
              }}

            /> Select All
          </div>
        </div>
        <div className="form-fields-list">
          {
            showSucessMessage ? (
              <div style={{
                "marginTop": "40px",
                "color": "limegreen",
                "fontWeight": "bold",
                "textAlign": "center"
              }}>
                Application Reminder Created
              </div>
            ) : (
              <div></div>
            )
          }

          <div className="formsettings-btn-container">
            <button
              type="submit"
              onClick={handleSave}
            >Save</button>
          </div>
        </div>
      </div>
    </ReminderSettingsStyled>
  );
}
