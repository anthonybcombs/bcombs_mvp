import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThList,
  faFile,
  faFileSignature,
  faCogs,
  faPrint
} from "@fortawesome/free-solid-svg-icons";
import ApplicationSummaryStyled from "./summary";
import ApplicationSettingsStyled from "./settings";
import ApplicationListStyled from "./list";
import EditApplicationStyled from "./edit";
import ChildFormViewStyled from "./view/child";
import ParentFormViewStyled from "./view/parent";
import TermsWaiverFormViewStyled from "./view/waiver";
import { requestVendor } from "../../../redux/actions/Vendors";
import {
  requestGetApplications,
  requestUpdateApplication,
  requestSaveApplication
} from "../../../redux/actions/Application";
import { requestUserGroup } from "../../../redux/actions/Groups";
import Loading from "../../../helpers/Loading.js";
import ProfileImg from "../../../images/defaultprofile.png";

import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";

const ApplicationFormStyled = styled.form`
  @media all {
    .page-break {
      // display: none;
    }
  }

  @media print {
    height: initial !important;
    overflow: initial !important;
    -webkit-print-color-adjust: exact;
    padding: 40px !important;
    .page-break {
      margin-top: 1rem;
      display: block;
      page-break-before: auto;
      position: relative;
    }
    #applicationForm .form-group {
      margin-top: 30px !important;
    }

    #applicationForm .form-group.ethnicity-form {
      margin-bottom: 20px !important;
    }
  }
  @page {
    gitsize: auto;
    margin: 5mm;
  }
`;

const ApplicationStyled = styled.div`
  // padding: 1em;
  width: auto;
  max-width: 1920px;
  margin: auto;
  padding: 0rem 3em 2rem;

  .print-button {
    border: 0;
    position: absolute;
    right: 90px;
    cursor: pointer;
    font-size: 2em;
    color: #f26e21;
    background: none;
    z-index: 1;
  }

  #application {
    display: grid;
    grid-gap: 3%;
  }

  #labels {
    padding: 1em;
  }

  #labels > div,
  #labels > a {
    padding: 1em;
    font-size: 1.2em;
    cursor: pointer;
    display: block;
    color: initial;
    text-decoration: none;

    display: flex;
    align-items: center;
  }

  #labels > div > span,
  #labels > a > span {
    margin-left: 1em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  #application > div {
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }

  .selected {
    background: #f26e21;
    color: white !important;
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
    -webkit-transition: border-color ease-in-out 0.15s,
      -webkit-box-shadow ease-in-out 0.15s;
    -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box; /* Firefox, other Gecko */
    box-sizing: border-box;
  }

  .save-button {
    color: #555555;
    cursor: default;
    border: 0;
    border-bottom-color: transparent;
    text-decoration: none;
    cursor: pointer;
    background: #f26e21;
    color: white;
    border-radius: 25px;
    padding: 12px 25px;
    display: inline-block;
    font-size: 16px;
  }

  @media (min-width: 680px) {
    #application {
      grid-template-columns: 1fr 4fr;
      grid-gap: 1%;
    }
  }

  @media (max-width: 840px) {
    padding: 0rem 1rem 2rem;
  }
`;

export default function index() {
  const [selectedLabel, setSelectedLabel] = useState("Application Status");

  const [updateApplication, setUpdateApplication] = useState({});

  const [selectNonMenuOption, setSelectNonMenuOption] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState({});

  const [emergencyContacts, setEmergencyContacts] = useState([]);

  const [view, setView] = useState("");

  const dispatch = useDispatch();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true
  });

  const { groups, auth, vendors, applications, loading } = useSelector(
    ({ groups, auth, vendors, applications, loading }) => {
      return { groups, auth, vendors, applications, loading };
    }
  );

  if (
    applications.updateapplication &&
    applications.updateapplication.message == "application updated"
  ) {
    window.location.reload(false);
  }

  if (
    applications.archivedapplication &&
    applications.archivedapplication.message == "application archived"
  ) {
    window.location.reload(false);
  }

  if (
    applications.updateapplication &&
    applications.updateapplication.message == "application successfully updated"
  ) {
    window.location.reload(false);
  }

  useEffect(() => {
    if (auth.user_id) {
      dispatch(requestUserGroup(auth.email));
      dispatch(requestVendor(auth.user_id));
    }
  }, []);

  useEffect(() => {
    if (vendors && vendors.length > 0 && vendors[0].id) {
      dispatch(requestGetApplications(vendors[0].id));
    }
  }, [vendors]);

  console.log("vendor", vendors);

  const handleSelectedLabel = value => {
    setSelectedLabel(value);
    setSelectNonMenuOption(false);
    setSelectedApplication({});
    setView("");
  };

  const parseArrayFormat = items => {
    let newItems = [];
    if (!Array.isArray(items)) return [];

    items.forEach((item, index) => {
      console.log(item);
      console.log(index);
      const newItem = {
        id: index,
        label: item,
        name: item
      };
      newItems.push(newItem);
    });

    return newItems;
  };

  const handleSelectedApplication = (application, view) => {
    setSelectedApplication(application);
    setSelectNonMenuOption(true);
    setView(view);

    const temp = {
      app_id: application.app_id,
      verification: application.verification,
      student_status: application.student_status,
      color_designation: application.color_designation
        ? application.color_designation
        : "",
      notes: application.notes ? application.notes : "",
      class_teacher: application.class_teacher
        ? application.class_teacher
        : application?.child?.grade_desc
    };

    console.log("application", application);

    const childInformationObj = {
      profile: {
        image: "",
        first_name: application.child.firstname
          ? application.child.firstname
          : "",
        last_name: application.child.lastname ? application.child.lastname : "",
        nick_name: application.child.nickname ? application.child.nickname : "",
        date_of_birth: new Date(application.child.birthdate),
        gender: application.child.gender,
        phone_type: application.child.phone_type
          ? application.child.phone_type
          : "",
        phone_number: application.child.phone_number
          ? application.child.phone_number
          : "",
        email_type: application.child.email_type
          ? application.child.email_type
          : "",
        email_address: application.child.email_address
          ? application.child.email_address
          : "",
        address: application.child.address
          ? application.child.address
          : isReadonly
          ? "-"
          : "",
        city: application.child.city ? application.child.city : "",
        state: application.child.state ? application.child.state : "",
        zip_code: application.child.zip_code ? application.child.zip_code : "",
        location_site: application.child.location_site
          ? application.child.location_site
          : "",
        child_lives_with: application.child.child_lives_with
          ? parseArrayFormat(application.child.child_lives_with.split(","))
          : [],
        program: application.child.programs
          ? parseArrayFormat(application.child.programs.split(","))
          : [],
        ethinicity: application.child.ethnicities
          ? parseArrayFormat(application.child.ethnicities.split(","))
          : []
      },
      general_information: {
        grade: application.child.grade_number
          ? application.child.grade_number
          : "",
        class_rank: application.child.class_rank
          ? application.child.class_rank
          : "",
        gpa_quarter_year: application.child.gpa_quarter_year
          ? application.child.gpa_quarter_year
          : "",
        gpa_quarter_q1: application.child.gpa_quarter_q1
          ? application.child.gpa_quarter_q1
          : "",
        gpa_quarter_q2: application.child.gpa_quarter_q2
          ? application.child.gpa_quarter_q2
          : "",
        gpa_quarter_q3: application.child.gpa_quarter_q3
          ? application.child.gpa_quarter_q3
          : "",
        gpa_quarter_q4: application.child.gpa_quarter_q4
          ? application.child.gpa_quarter_q4
          : "",
        gpa_cumulative_year: application.child.gpa_cumulative_year
          ? application.child.gpa_cumulative_year
          : "",
        gpa_cumulative_q1: application.child.gpa_cumulative_q1
          ? application.child.gpa_cumulative_q1
          : "",
        gpa_cumulative_q2: application.child.gpa_cumulative_q2
          ? application.child.gpa_cumulative_q2
          : "",
        gpa_cumulative_q3: application.child.gpa_cumulative_q3
          ? application.child.gpa_cumulative_q3
          : "",
        gpa_cumulative_q4: application.child.gpa_cumulative_q4
          ? application.child.gpa_cumulative_q4
          : "",
        act_scores: [],
        sat_scores: [],
        psat_scores: [],
        school_name: application.child.school_name
          ? application.child.school_name
          : "",
        school_phone: application.child.school_phone
          ? application.child.school_phone
          : "",
        was_suspended: !!application.child.has_suspended,
        reason_suspended: application.child.reason_suspended,
        mentee_start_year: application.child.year_taken,
        hobbies: application.child.hobbies ? application.child.hobbies : "",
        life_events: application.child.life_events
          ? application.child.life_events
          : "",
        career_goals: application.child.career_goals
          ? application.child.career_goals
          : "",
        colleges: application.child.colleges ? application.child.colleges : "",
        team_affiliations: application.child.affiliations
          ? application.child.affiliations
          : "",
        awards: application.child.awards ? application.child.awards : "",
        accomplishments: application.child.accomplishments
          ? application.child.accomplishments
          : "",
        mentee_gain: application.child.mentee_gain_program
          ? application.child.mentee_gain_program
          : ""
      },
      emergency_care_information: {
        doctor_name: application.child.doctor_name
          ? application.child.doctor_name
          : "",
        doctor_phone: application.child.doctor_phone
          ? application.child.doctor_phone
          : "",
        hospital_preference: application.child.hospital_preference
          ? application.child.hospital_preference
          : "",
        hospital_phone: application.child.hospital_phone
          ? application.child.hospital_phone
          : ""
      },
      ch_id: application.child.ch_id
    };

    const parents = application.parents;

    let items = [];
    for (const parent of parents) {
      const profile = {
        first_name: parent.firstname ? parent.firstname : "",
        last_name: parent.lastname ? parent.lastname : "",
        phone_type: parent.phont_type ? parent.phone_type : "",
        phone_number: parent.phone_number ? parent.phone_number : "",
        phone_type2: parent.phont_type2 ? parent.phone_type2 : "",
        phone_number2: parent.phone_number2 ? parent.phone_number2 : "",
        email_type: parent.email_type ? parent.email_type : "",
        email_address: parent.email_address ? parent.email_address : "",
        email_type2: parent.email_type2 ? parent.email_type2 : "",
        email_address2: parent.email_address2 ? parent.email_address2 : "",
        address: parent.address ? parent.address : "",
        city: parent.city ? parent.city : "",
        state: parent.state ? parent.state : "",
        zip_code: parent.zip_code ? parent.zip_code : "",
        occupation: parent.zip_code ? parent.zip_code : "",
        employer_name: parent.employer_name ? parent.employer_name : "",
        goals_parent_program: parent.parent_goals ? parent.parent_goals : "",
        goals_child_program: parent.parent_child_goals
          ? parent.parent_child_goals
          : "",
        live_area: parent.live_area ? parent.live_area : 0, // 1: 1 - 5 year, 2: 5 - 10 year, 3: more than 10 year
        level_education: parent.level_of_education
          ? parent.level_of_education
          : "",
        child_importance_hs: parent.child_hs_grad ? parent.child_hs_grad : "",
        child_importance_col: parent.child_col_grad
          ? parent.child_col_grad
          : "",
        person_recommend: parent.person_recommend ? parent.person_recommend : ""
      };

      items.push({ profile: profile, parent_id: parent.parent_id });
    }

    if (application.emergency_contacts) {
      setEmergencyContacts(JSON.parse(application.emergency_contacts));
    } else {
      setEmergencyContacts(emergency_contacts);
    }

    setChildInformation(childInformationObj);

    setParentsInformation(items);

    setUpdateApplication({ ...temp });

    const termsWaiver = {
      date: new Date().toString(),
      section1: {
        checked: !!application.section1_signature,
        signature: application.section1_signature
      },
      section2: {
        checked: !!application.section2_signature,
        signature: application.section2_signature
      },
      section3: {
        checked: !!application.section3_signature,
        signature: application.section3_signature
      }
    };

    setTermsWaiver(termsWaiver);
  };

  const childEmergencyContact = {
    first_name: "",
    last_name: "",
    gender: "",
    mobile_phone: "",
    work_phone: "",
    relationship_to_child: ""
  };

  const emergency_contacts = [
    { ...childEmergencyContact },
    { ...childEmergencyContact },
    { ...childEmergencyContact },
    { ...childEmergencyContact }
  ];

  const handleUpdateOnchange = (id, value) => {
    setUpdateApplication({ ...updateApplication, [id]: value });
  };

  const getAge = date_of_birth => {
    const age = Math.floor((new Date() - date_of_birth) / 31536000000);

    return age;
  };

  const getArrayValue = (items = []) => {
    return items.map(a => a.name).toString();
  };

  const getGradeDesc = grade => {
    if (grade == 12) {
      return "Seniors";
    } else if (grade == 11) {
      return "Juniors";
    } else if (grade == 10) {
      return "Sophomores";
    } else if (grade == 9) {
      return "Freshmen";
    } else if (grade < 9 && grade > 4) {
      return "Middle School";
    } else {
      return "Grade School";
    }
  };

  const setupParentsList = () => {
    let parents = [];

    parentsInformation.map(parent => {
      parents.push({
        firstname: parent.profile.first_name,
        lastname: parent.profile.last_name,
        phone_type: parent.profile.phone_type,
        phone_number: parent.profile.phone_number,
        email_type: parent.profile.email_type,
        email_address: parent.profile.email_address,
        phone_type2: parent.profile.phone_type2,
        phone_number2: parent.profile.phone_number2,
        email_type2: parent.profile.email_type2,
        email_address2: parent.profile.email_address2,
        password: parent.profile.password,
        occupation: parent.profile.occupation,
        employers_name: parent.profile.employer_name,
        parent_goals: parent.profile.goals_parent_program,
        parent_child_goals: parent.profile.goals_child_program,
        live_area: parseInt(parent.profile.live_area),
        level_of_education: parent.profile.level_education,
        child_hs_grad: parent.profile.child_importance_hs,
        child_col_grad: parent.profile.child_importance_col,
        address: parent.profile.address,
        city: parent.profile.city,
        state: parent.profile.state,
        zip_code: parent.profile.zip_code,
        person_recommend: parent.profile.person_recommend,
        parent_id: parent.parent_id
      });
    });

    return parents;
  };

  const onSubmit = () => {
    dispatch(requestUpdateApplication(updateApplication));
  };

  const [isReadonly, setIsReadonly] = useState(true);

  const handleChangeToEdit = e => {
    e.preventDefault();
    setIsReadonly(!isReadonly);
  };

  const { register, handleSubmit, errors, clearError, setError } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange"
  });

  const DATE_TIME_FORMAT = "yyyy-MM-dd hh:mm:ss";

  const onSubmitSaveApplication = () => {
    console.log("Click Save Application");

    const payload = {
      app_id: selectedApplication.app_id,
      child: {
        firstname: childInformation.profile.first_name,
        lastname: childInformation.profile.last_name,
        age: getAge(childInformation.profile.date_of_birth),
        birthdate: format(
          new Date(childInformation.profile.date_of_birth),
          DATE_TIME_FORMAT
        ),
        gender: childInformation.profile.gender,
        phone_type: childInformation.profile.phone_type,
        phone_number: childInformation.profile.phone_number,
        email_type: childInformation.profile.email_type,
        email_address: childInformation.profile.email_address,
        phone_type2: childInformation.profile.phone_type2,
        phone_number2: childInformation.profile.phone_number2,
        email_type2: childInformation.profile.email_type2,
        email_address2: childInformation.profile.email_address2,
        address: childInformation.profile.address,
        city: childInformation.profile.city,
        state: childInformation.profile.state,
        zip_code: childInformation.profile.zip_code,
        location_site: childInformation.profile.location_site,
        child_lives_with: getArrayValue(
          childInformation.profile.child_lives_with
        ),
        school_name: childInformation.general_information.school_name,
        school_phone: childInformation.general_information.school_phone,
        has_suspended: parseInt(
          childInformation.general_information.was_suspended
        ),
        reason_suspended: childInformation.general_information.reason_suspended,
        year_taken: childInformation.general_information.mentee_start_year,
        hobbies: childInformation.general_information.hobbies,
        life_events: childInformation.general_information.life_events,
        career_goals: childInformation.general_information.career_goals,
        colleges: childInformation.general_information.colleges,
        affiliations: childInformation.general_information.team_affiliations,
        awards: childInformation.general_information.awards,
        accomplishments: childInformation.general_information.accomplishments,
        mentee_gain_program: childInformation.general_information.mentee_gain,
        grade_number: childInformation.general_information.grade,
        grade_desc: getGradeDesc(childInformation.general_information.grade),
        class_rank: childInformation.general_information.class_rank,
        gpa_quarter_year: childInformation.general_information.gpa_quarter_year,
        gpa_quarter_q1: childInformation.general_information.gpa_quarter_q1,
        gpa_quarter_q2: childInformation.general_information.gpa_quarter_q2,
        gpa_quarter_q3: childInformation.general_information.gpa_quarter_q3,
        gpa_quarter_q4: childInformation.general_information.gpa_quarter_q4,
        gpa_cumulative_year:
          childInformation.general_information.gpa_cumulative_year,
        gpa_cumulative_q1:
          childInformation.general_information.gpa_cumulative_q1,
        gpa_cumulative_q2:
          childInformation.general_information.gpa_cumulative_q2,
        gpa_cumulative_q3:
          childInformation.general_information.gpa_cumulative_q3,
        gpa_cumulative_q4:
          childInformation.general_information.gpa_cumulative_q4,
        ethnicities: getArrayValue(childInformation.profile.ethinicity),
        programs: getArrayValue(childInformation.profile.program),
        doctor_name: childInformation.emergency_care_information.doctor_name,
        doctor_phone: childInformation.emergency_care_information.doctor_phone,
        hospital_preference:
          childInformation.emergency_care_information.hospital_preference,
        hospital_phone:
          childInformation.emergency_care_information.hospital_phone,
        nickname: childInformation.profile.nick_name,
        ch_id: childInformation.ch_id
      },
      parents: setupParentsList(),
      emergency_contacts: JSON.stringify(emergencyContacts),
      updated_by: auth.name
    };

    console.log("Submit update application", payload);

    dispatch(requestSaveApplication(payload));
  };

  const [childInformation, setChildInformation] = useState({});

  const [parentsInformation, setParentsInformation] = useState([]);

  const termsWaiverObj = {
    date: new Date().toString(),
    section1: {
      checked: false,
      signature: ""
    },
    section2: {
      checked: false,
      signature: ""
    },
    section3: {
      checked: false,
      signature: ""
    }
  };

  const [termsWaiver, setTermsWaiver] = useState({ ...termsWaiverObj });

  const handleChildFormDetailsChange = (index, section, id, value) => {
    let child = childInformation;
    let profile = child.profile;
    let general_information = child.general_information;
    let emergency_care_information = child.emergency_care_information;

    console.log("profile", profile);

    if (section === "profile") {
      if (id == "child_lives_with") {
        console.log("value", value);
        console.log("id", id);
        profile.child_lives_with = value;
      } else {
        profile = { ...profile, [id]: value };
      }

      child.profile = profile;
    } else if (section === "general_information") {
      if(id === "was_suspended") {
        if (value == "0")
          general_information = {...general_information, ["reason_suspended"]: ""};
      }

      if (id.includes("act_scores")) {
        let x = id.split("-");
        general_information.act_scores[x[1]][x[2]] = value;
      } else if (id.includes("sat_scores")) {
        let x = id.split("-");
        if (x[0] === "psat_scores") {
          general_information.psat_scores[x[1]][x[2]] = value;
        } else {
          general_information.sat_scores[x[1]][x[2]] = value;
        }
      } else {
        general_information = { ...general_information, [id]: value };
      }
      child.general_information = general_information;
    } else {
      emergency_care_information = {
        ...emergency_care_information,
        [id]: value
      };
      child.emergency_care_information = emergency_care_information;
    }

    console.log("Child profile", child.profile);
    setChildInformation({ ...child });
  };

  const handleParentFormDetailsChange = (index, section, id, value) => {
    if (section === "profile") {
      let parents = parentsInformation;
      let profile = parents[index].profile;

      profile = { ...profile, [id]: value };
      parents[index].profile = profile;
      setParentsInformation([...parents]);
    } else if (section === "emergency_contacts") {
      let emergency_contacts = emergencyContacts;
      let x = id.split("-");
      emergency_contacts[index][id] = value;
      setEmergencyContacts([...emergencyContacts]);
    }

    console.log("parentsInformation update", parentsInformation);
  };

  return (
    <ApplicationStyled>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2>Application</h2>
        {vendors && vendors.length > 0 && (
          <div>
            <select className="form-control" style={{ marginLeft: "20px" }}>
              {vendors.map(vendor => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div id="application">
        <div>
          <div id="labels">
            <a
              href={`/application/${
                vendors && vendors.length > 0 ? vendors[0]?.user : ""
              }`}
              target="_blank">
              <FontAwesomeIcon icon={faFileSignature} />
              <span>Application</span>
            </a>

            <div
              className={`${
                selectedLabel === "Application Status" ? "selected" : ""
              }`}
              onClick={() => {
                handleSelectedLabel("Application Status");
              }}>
              <FontAwesomeIcon icon={faThList} />
              <span>Application Status</span>
            </div>

            <div
              className={`${
                selectedLabel === "Form Settings" ? "selected" : ""
              }`}
              onClick={() => {
                handleSelectedLabel("Form Settings");
              }}>
              <FontAwesomeIcon icon={faCogs} />
              <span>Form Settings</span>
            </div>

            <a href={`/dashboard/myapplication`}>
              <FontAwesomeIcon icon={faFile} />
              <span>My Application</span>
            </a>
          </div>
        </div>
        <div>
          {selectedLabel === "Application Status" && !selectNonMenuOption && (
            <ApplicationSummaryStyled
              appGroups={
                groups && groups.application_groups
                  ? groups.application_groups
                  : []
              }
              applications={applications.activeapplications}
              vendor={vendors && vendors.length > 0 ? vendors[0] : null}
            />
          )}
          {selectedLabel === "Form Settings" && !selectNonMenuOption && (
            <ApplicationSettingsStyled
              vendor={vendors && vendors.length > 0 ? vendors[0] : null}
              formSettingsLoading={loading.form_settings}
            />
          )}
          {selectNonMenuOption && view == "application" && (
            <EditApplicationStyled
              application={selectedApplication}
              vendor={vendors && vendors.length > 0 ? vendors[0] : null}
              appGroups={
                groups && groups.application_groups
                  ? groups.application_groups
                  : []
              }
              onSubmit={onSubmit}
              handleUpdateOnchange={handleUpdateOnchange}
              updateLoading={loading.application}
            />
          )}
        </div>
      </div>
      {selectedLabel === "Application Status" && !selectNonMenuOption && (
        <ApplicationListStyled
          applications={applications.activeapplications}
          handleSelectedApplication={handleSelectedApplication}
          listApplicationLoading={loading.application}
          vendor={vendors && vendors.length > 0 ? vendors[0] : null}
          appGroups={
            groups && groups.application_groups ? groups.application_groups : []
          }
        />
      )}
      {!loading.application && selectNonMenuOption && view == "application" && (
        <button type="button" className="print-button" onClick={handlePrint}>
          {" "}
          <FontAwesomeIcon icon={faPrint} />
        </button>
      )}
      {loading.application ? (
        <Loading />
      ) : (
        <ApplicationFormStyled
          className="print-container"
          ref={componentRef}
          autoComplete="off"
          onSubmit={handleSubmit(onSubmitSaveApplication)}>
          {selectNonMenuOption && view == "application" && (
            <ChildFormViewStyled
              childInformation={childInformation}
              vendor={vendors && vendors.length > 0 ? vendors[0] : null}
              ProfileImg={ProfileImg}
              isReadonly={isReadonly}
              handleChangeToEdit={handleChangeToEdit}
              errors={errors}
              register={register}
              handleChildFormDetailsChange={handleChildFormDetailsChange}
              location_sites={
                vendors && vendors.length > 0 ? vendors[0].location_sites : []
              }
              app_programs={
                vendors && vendors.length > 0 ? vendors[0].app_programs : []
              }
              isVendorView={true}
            />
          )}

          {selectNonMenuOption && view == "application" && (
            <hr className="style-eight"></hr>
          )}
          <br />
          {selectNonMenuOption && view == "application" && (
            <ParentFormViewStyled
              parents={parentsInformation}
              vendor={vendors && vendors.length > 0 ? vendors[0] : null}
              ProfileImg={ProfileImg}
              handleParentFormDetailsChange={handleParentFormDetailsChange}
              isReadonly={isReadonly}
              isUpdate={true}
              emergencyContacts={emergencyContacts}
              isVendorView={true}
            />
          )}
          {selectNonMenuOption && view == "application" && (
            <hr className="style-eight"></hr>
          )}
          {selectNonMenuOption && view == "application" && (
            <TermsWaiverFormViewStyled
              className="page-break"
              application={selectedApplication}
              isReadonly={true}
              register={register}
              errors={errors}
              termsWaiver={termsWaiver}
              isVendorView={true}
            />
          )}

          {selectNonMenuOption && view == "application" && !isReadonly && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <button className="save-button" type="Submit">
                Save
              </button>
            </div>
          )}
        </ApplicationFormStyled>
      )}
    </ApplicationStyled>
  );
}
