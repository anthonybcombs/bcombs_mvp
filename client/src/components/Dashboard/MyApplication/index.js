import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Collapsible from "react-collapsible";
import DataTable from 'react-data-table-component';
import { format } from "date-fns";

import { 
  requestGetApplicationByUserId, 
  requestSaveApplication 
} from "../../../redux/actions/Application";
import ProfileImg from "../../../images/defaultprofile.png";
import ChildFormViewStyled from "../Application/view/child";
import ParentFormViewStyled from "../Application/view/parent";
import TermsWaiverFormViewStyled from "../Application/view/waiver";
import Loading from "../../../helpers/Loading.js";

const MyApplicationStyled = styled.div`
  padding: 1em;

  .Collapsible__trigger {
    cursor: pointer;
  }

  .is-closed h3:after {
    content: "↓";
    font-size: 1em;
    color: black;
    margin-left: 0.5em;
  }

  .is-open h3:after {
    content: "↑";
    font-size: 1em;
    color: black;
    margin-left: 0.5em;
  }

  #dataTableContainer a {
    color: #3e89fe;
    -webkit-text-decoration: none;
    text-decoration: none;
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
`;

export default function index() {

  const dispatch = useDispatch();

  const { auth, applications, loading } = useSelector(
    ({auth, applications, loading}) => {
      return {auth, applications, loading}
    }
  );

  if(applications.updateapplication && applications.updateapplication.message == "application successfully updated") {
    window.location.reload(false);
  }

  const [selectedApplication, setSelectedApplication] = useState({});

  const [showApplication, setShowApplication] = useState(false);

  const [isReadonly, setIsReadonly] = useState(true);

  const [childInformation, setChildInformation] = useState({});

  const [parentsInformation, setParentsInformation] = useState([]);

  const [appHistory, setAppHistory] = useState([])

  const [vendorName, setVendorName] = useState();

  const [tempHideForm, setTempHideForm] = useState(false);

  const [isFormHistory, setIsFormHistory] = useState(false)

  const [emergencyContacts, setEmergencyContacts] = useState([]);

  const childEmergencyContact = {
    first_name: "",
    last_name: "",
    gender: "",
    mobile_phone: "",
    work_phone: "",
    relationship_to_child: ""
  }

  const emergency_contacts = [
    {...childEmergencyContact},
    {...childEmergencyContact},
    {...childEmergencyContact},
    {...childEmergencyContact}
  ]

  useEffect(() => {
    if(auth.user_id) {
      dispatch(requestGetApplicationByUserId(auth.user_id))
    }
  }, [])

  let userApplications = [];

  if(applications && applications.userAllApplications.length > 0) {
    userApplications = applications.userAllApplications;
  }

  const DATE_FORMAT = "LLL dd, yyyy";

  const DATE_TIME_FORMAT = "LLL dd, yyyy p";

  const parseArrayFormat = (items) => {
    let newItems = []
    if(!Array.isArray(items)) return [];

    items.forEach((item, index) => {
      const newItem = {
        id: index,
        label: item,
        name: item
      }
      newItems.push(newItem);
    });

    return newItems;
  }

  const createHistoryViewButton = (row) => {
    return (
      <a 
        href=""
        target="_blank" 
        onClick={(e) => {
          e.preventDefault();

          const application = JSON.parse(row.details);

          const childInformationObj = {
            profile: {
              image: "",
              first_name: application.child.firstname ? application.child.firstname: "",
              last_name: application.child.lastname ? application.child.lastname:"",
              nick_name: application.child.nickname ? application.child.nickname: "",
              date_of_birth: new Date(application.child.birthdate),
              gender: application.child.gender,
              phone_type: application.child.phone_type ? application.child.phone_type: "",
              phone_number: application.child.phone_number ? application.child.phone_number:"",
              email_type: application.child.email_type ? application.child.email_type:"",
              email_address: application.child.email_address ? application.child.email_address: "",
              address: application.child.address ? application.child.address: "",
              city: application.child.city ? application.child.city: "",
              state: application.child.state ? application.child.state: "",
              zip_code: application.child.zip_code ? application.child.zip_code: "",
              location_site: application.child.location_site ? application.child.location_site: "",
              child_lives_with: application.child.child_lives_with ? parseArrayFormat(application.child.child_lives_with.split(",")) : [],
              program: application.child.programs ? parseArrayFormat(application.child.programs.split(",")) : [],
              ethinicity: application.child.ethnicities ? parseArrayFormat(application.child.ethnicities.split(",")) : []
            },
            general_information: {
              grade: application.child.grade_number ? application.child.grade_number: "",
              class_rank: application.child.class_rank ? application.child.class_rank : "",
              gpa_quarter_year: application.child.gpa_quarter_year ? application.child.gpa_quarter_year : "",
              gpa_quarter_q1: application.child.gpa_quarter_q1 ? application.child.gpa_quarter_q1 : "",
              gpa_quarter_q2: application.child.gpa_quarter_q2 ? application.child.gpa_quarter_q2 : "",
              gpa_quarter_q3: application.child.gpa_quarter_q3 ? application.child.gpa_quarter_q3 : "",
              gpa_quarter_q4: application.child.gpa_quarter_q4 ? application.child.gpa_quarter_q4 : "",
              gpa_cumulative_year: application.child.gpa_cumulative_year ? application.child.gpa_cumulative_year : "",
              gpa_cumulative_q1: application.child.gpa_cumulative_q1 ? application.child.gpa_cumulative_q1 : "",
              gpa_cumulative_q2: application.child.gpa_cumulative_q2 ? application.child.gpa_cumulative_q2 : "",
              gpa_cumulative_q3: application.child.gpa_cumulative_q3 ? application.child.gpa_cumulative_q3 : "",
              gpa_cumulative_q4: application.child.gpa_cumulative_q4 ? application.child.gpa_cumulative_q4 : "",
              act_scores: [],
              sat_scores: [],
              psat_scores: [],
              school_name: application.child.school_name ? application.child.school_name : "",
              school_phone: application.child.school_phone ? application.child.school_phone : "",
              was_suspended: !!application.child.has_suspended,
              reason_suspended: application.child.reason_suspended,
              mentee_start_year: application.child.year_taken,
              hobbies: application.child.hobbies ? application.child.hobbies : "",
              life_events: application.child.life_events ? application.child.life_events : "",
              career_goals: application.child.career_goals ? application.child.career_goals : "",
              colleges: application.child.colleges ? application.child.colleges : "",
              team_affiliations: application.child.affiliations ? application.child.affiliations : "",
              awards: application.child.awards ? application.child.awards : "",
              accomplishments: application.child.accomplishments ? application.child.accomplishments : "",
              mentee_gain: application.child.mentee_gain_program ? application.child.mentee_gain_program : ""
            },
            emergency_care_information: {
              doctor_name: application.child.doctor_name ? application.child.doctor_name : "",
              doctor_phone: application.child.doctor_phone ? application.child.doctor_phone : "",
              hospital_preference: application.child.hospital_preference ? application.child.hospital_preference : "",
              hospital_phone: application.child.hospital_phone ? application.child.hospital_phone : ""
            },
            ch_id: application.child.ch_id
          }

          const parents = application.parents;

          let items = []
          for(const parent of parents) {
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
              goals_child_program: parent.parent_child_goals ? parent.parent_child_goals : "",
              live_area: parent.live_area ? parent.live_area : 0, // 1: 1 - 5 year, 2: 5 - 10 year, 3: more than 10 year
              level_education: parent.level_of_education ? parent.level_of_education : "",
              child_importance_hs: parent.child_hs_grad ? parent.child_hs_grad : "",
              child_importance_col: parent.child_col_grad ? parent.child_col_grad : "",
              person_recommend: parent.person_recommend ? parent.person_recommend: ""
            }

            items.push({profile: profile, parent_id: parent.parent_id});
          }

          setTempHideForm(true);

          setTimeout(() => {
            setTempHideForm(false);
          }, 200)
          setChildInformation(childInformationObj);
          setParentsInformation(items);
          setIsFormHistory(true);
          setIsReadonly(true);

          if(application.emergency_contacts) {
            setEmergencyContacts(JSON.parse(application.emergency_contacts));
          } else {
            setEmergencyContacts(emergency_contacts);
          }
          
        }}
      >
        View Application
      </a>
    )
  }
  const createViewButton = (application) => {
    return (
      <a 
        href=""
        target="_blank" 
        onClick={(e) => {
          e.preventDefault()

          const childInformationObj = {
            profile: {
              image: "",
              first_name: application.child.firstname ? application.child.firstname: "",
              last_name: application.child.lastname ? application.child.lastname:"",
              nick_name: application.child.nickname ? application.child.nickname: "",
              date_of_birth: new Date(application.child.birthdate),
              gender: application.child.gender,
              phone_type: application.child.phone_type ? application.child.phone_type: "",
              phone_number: application.child.phone_number ? application.child.phone_number:"",
              email_type: application.child.email_type ? application.child.email_type:"",
              email_address: application.child.email_address ? application.child.email_address: "",
              address: application.child.address ? application.child.address: "",
              city: application.child.city ? application.child.city: "",
              state: application.child.state ? application.child.state: "",
              zip_code: application.child.zip_code ? application.child.zip_code: "",
              location_site: application.child.location_site ? application.child.location_site: "",
              child_lives_with: application.child.child_lives_with ? parseArrayFormat(application.child.child_lives_with.split(",")) : [],
              program: application.child.programs ? parseArrayFormat(application.child.programs.split(",")) : [],
              ethinicity: application.child.ethnicities ? parseArrayFormat(application.child.ethnicities.split(",")) : []
            },
            general_information: {
              grade: application.child.grade_number ? application.child.grade_number: "",
              class_rank: application.child.class_rank ? application.child.class_rank : "",
              gpa_quarter_year: application.child.gpa_quarter_year ? application.child.gpa_quarter_year : "",
              gpa_quarter_q1: application.child.gpa_quarter_q1 ? application.child.gpa_quarter_q1 : "",
              gpa_quarter_q2: application.child.gpa_quarter_q2 ? application.child.gpa_quarter_q2 : "",
              gpa_quarter_q3: application.child.gpa_quarter_q3 ? application.child.gpa_quarter_q3 : "",
              gpa_quarter_q4: application.child.gpa_quarter_q4 ? application.child.gpa_quarter_q4 : "",
              gpa_cumulative_year: application.child.gpa_cumulative_year ? application.child.gpa_cumulative_year : "",
              gpa_cumulative_q1: application.child.gpa_cumulative_q1 ? application.child.gpa_cumulative_q1 : "",
              gpa_cumulative_q2: application.child.gpa_cumulative_q2 ? application.child.gpa_cumulative_q2 : "",
              gpa_cumulative_q3: application.child.gpa_cumulative_q3 ? application.child.gpa_cumulative_q3 : "",
              gpa_cumulative_q4: application.child.gpa_cumulative_q4 ? application.child.gpa_cumulative_q4 : "",
              act_scores: [],
              sat_scores: [],
              psat_scores: [],
              school_name: application.child.school_name ? application.child.school_name : "",
              school_phone: application.child.school_phone ? application.child.school_phone : "",
              was_suspended: !!application.child.has_suspended,
              reason_suspended: application.child.reason_suspended,
              mentee_start_year: application.child.year_taken,
              hobbies: application.child.hobbies ? application.child.hobbies : "",
              life_events: application.child.life_events ? application.child.life_events : "",
              career_goals: application.child.career_goals ? application.child.career_goals : "",
              colleges: application.child.colleges ? application.child.colleges : "",
              team_affiliations: application.child.affiliations ? application.child.affiliations : "",
              awards: application.child.awards ? application.child.awards : "",
              accomplishments: application.child.accomplishments ? application.child.accomplishments : "",
              mentee_gain: application.child.mentee_gain_program ? application.child.mentee_gain_program : ""
            },
            emergency_care_information: {
              doctor_name: application.child.doctor_name ? application.child.doctor_name : "",
              doctor_phone: application.child.doctor_phone ? application.child.doctor_phone : "",
              hospital_preference: application.child.hospital_preference ? application.child.hospital_preference : "",
              hospital_phone: application.child.hospital_phone ? application.child.hospital_phone : ""
            },
            ch_id: application.child.ch_id
          }

          const parents = application.parents;

          let items = []
          for(const parent of parents) {
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
              goals_child_program: parent.parent_child_goals ? parent.parent_child_goals : "",
              live_area: parent.live_area ? parent.live_area : 0, // 1: 1 - 5 year, 2: 5 - 10 year, 3: more than 10 year
              level_education: parent.level_of_education ? parent.level_of_education : "",
              child_importance_hs: parent.child_hs_grad ? parent.child_hs_grad : "",
              child_importance_col: parent.child_col_grad ? parent.child_col_grad : "",
              person_recommend: parent.person_recommend ? parent.person_recommend: ""
            }
          
            items.push({profile: profile, parent_id: parent.parent_id});
          }

          if(application && application.vendorPrograms && application.vendorPrograms.length > 0) {
            let app_programs = []

            for(const program of application.vendorPrograms) {
              app_programs.push({
                id: program.id,
                name: program.name,
                label: program.name
              })
            }

            application.vendorPrograms = app_programs;
          }

          setSelectedApplication(application);

          if(application.emergency_contacts) {
            setEmergencyContacts(JSON.parse(application.emergency_contacts));
          } else {
            setEmergencyContacts(emergency_contacts);
          }

          setChildInformation(childInformationObj);
          setParentsInformation(items);

          setAppHistory(application.app_histories);

          setVendorName(application.vendorName);
          setShowApplication(true);

          setTempHideForm(true);
          setIsFormHistory(false);

          setTimeout(() => {
            setTempHideForm(false);
          }, 200)
          
        }}
      >
        View Application
      </a>
    )
  }

  const handleChildFormDetailsChange = (index, section, id, value) => {

    let child = childInformation;
    let profile = child.profile;
    let general_information = child.general_information;
    let emergency_care_information = child.emergency_care_information;

    if(section === "profile") {
      profile = {...profile, [id]: value}
      child.profile = profile;
    } else if (section === "general_information") {
      if(id === "was_suspended") {
        value = (value === "true");
        if (!value)
          general_information = {...general_information, ["reason_suspended"]: ""};
      }

      if(id.includes("act_scores")) {
        let x = id.split("-");
        general_information.act_scores[x[1]][x[2]] = value;
      } else if (id.includes("sat_scores")) {
        let x = id.split("-");
        if(x[0] === "psat_scores") {
          general_information.psat_scores[x[1]][x[2]] = value;
        } else {
          general_information.sat_scores[x[1]][x[2]] = value;
        }
      } else {
        general_information = {...general_information, [id]: value};
      }
      child.general_information = general_information
    } else {
      emergency_care_information = {...emergency_care_information, [id]: value};
      child.emergency_care_information = emergency_care_information;
    }
    setChildInformation({...child})
  }

  const handleParentFormDetailsChange = (index, section, id, value) => {
      
    if(section === "profile") {
      let parents = parentsInformation;
      let profile = parents[index].profile;

      profile = {...profile, [id]: value};
      parents[index].profile = profile;
      setParentsInformation([...parents]);
    } else if(section === "emergency_contacts") {
      let emergency_contacts = emergencyContacts;
      let x = id.split("-");
      emergency_contacts[index][id] = value;
      setEmergencyContacts([...emergencyContacts]);
    }
  }

  const columns = [
    {
      name: 'Application Date',
      selector: 'status',
      sortable: true,
      cell: row => format(new Date(row.application_date), DATE_FORMAT)
    },
    {
      name: 'Student Name',
      selector: 'studentName',
      sortable: true,
      cell: row => <a target="_blank" href={"menteeprofile/" + row.id}><span>{row.child?.firstname + " " + row.child?.lastname}</span></a>
    },
    {
      name: 'Vendor',
      selector: 'vendor',
      sortable: true,
      cell: row => row.vendorName
    },
    {
      selector: 'class',
      sortable: true,
      cell: row => createViewButton(row)
    }
  ];

  const columnsAppHistory = [
    {
      name: 'Updated At',
      selector: 'status',
      sortable: true,
      cell: row => format(new Date(row.updated_at), DATE_TIME_FORMAT)
    },
    {
      name: 'Updated By',
      selector: 'studentName',
      sortable: true,
      cell: row => row.updated_by
    },
    {
      selector: 'class',
      sortable: true,
      cell: row => createHistoryViewButton(row)
    }
  ];

  const paginationRowsPerPageOptions = [10, 25, 50, 100];
  const paginationComponentOptions = {
    rowsPerPageText: 'Rows per page:', 
    rangeSeparatorText: 'of', 
    noRowsPerPage: false,
    selectAllRowsItem: true, 
    selectAllRowsItemText: 'All'
  }

  const customStyles = {
    header: {
      style: {
        minHeight: '70px'
      }
    },
    subHeader: {
      style: {
        marginBottom: '12px',
      }
    },
    headRow: {
      style: {
        background: '#f26e21',
        minHeight: '39px',
        borderColor: '#fff'
      }
    },
    headCells: {
      style: {
        fontSize: '16px',
        color: '#fff'
      }
    },
    cells: {
      style: {
        fontSize: '16px',
        padding: '10px'
      }
    },
    rows: {
      style: {
        '&:not(:last-of-type)': {
          borderColor: "#eaedf1"
        },
        minHeight: "35px"
      }
    }
  }

  const setupParentsList = () => {
    let parents = [];

    parentsInformation.map((parent) => {
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
      })
    });

    return parents;
  }

  const getAge = (date_of_birth) => {
    const age = Math.floor((new Date() - date_of_birth) / 31536000000);

    return age;
  }

  const getArrayValue = (items = []) => {

    return items.map(a => a.name).toString();
  }

  const getGradeDesc = (grade) => {
    if(grade == 12) {
      return "Seniors";
    } else if (grade == 11) {
      return "Juniors";
    } else if (grade == 10) {
      return "Sophomores";
    } else if (grade == 9) {
      return "Freshmen"
    } else if (grade < 9 && grade > 4) {
      return "Middle School"
    } else {
      return "Grade School"
    }
  }

  const DATE_TIME_FORMAT2 = "yyyy-MM-dd hh:mm:ss";

  const onSubmitSaveApplication = () => {

    const payload = {
      app_id: selectedApplication.app_id,
      child: {
        firstname: childInformation.profile.first_name,
        lastname: childInformation.profile.last_name,
        age: getAge(childInformation.profile.date_of_birth),
        birthdate: format(
          new Date(childInformation.profile.date_of_birth),
          DATE_TIME_FORMAT2),
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
        child_lives_with: getArrayValue(childInformation.profile.child_lives_with),
        school_name: childInformation.general_information.school_name,
        school_phone: childInformation.general_information.school_phone,
        has_suspended: parseInt(childInformation.general_information.was_suspended),
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
        gpa_cumulative_year: childInformation.general_information.gpa_cumulative_year,
        gpa_cumulative_q1: childInformation.general_information.gpa_cumulative_q1,
        gpa_cumulative_q2: childInformation.general_information.gpa_cumulative_q2,
        gpa_cumulative_q3: childInformation.general_information.gpa_cumulative_q3,
        gpa_cumulative_q4: childInformation.general_information.gpa_cumulative_q4,
        ethnicities: getArrayValue(childInformation.profile.ethinicity),
        programs: getArrayValue(childInformation.profile.program),
        doctor_name: childInformation.emergency_care_information.doctor_name,
        doctor_phone: childInformation.emergency_care_information.doctor_phone,
        hospital_preference: childInformation.emergency_care_information.hospital_preference,
        hospital_phone: childInformation.emergency_care_information.hospital_phone,
        ch_id: childInformation.ch_id
      },
      parents: setupParentsList(),
      emergency_contacts: JSON.stringify(emergencyContacts),
      updated_by: auth.name
    }

    dispatch(requestSaveApplication(payload));
  }

  const { register, handleSubmit, errors, clearError, setError } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange"
  });

  const handleChangeToEdit = (e) => {
    e.preventDefault();
    setIsReadonly(!isReadonly);
  }

  console.log("loading", loading);

  return (
    <MyApplicationStyled>

      {
        !loading.userAllApplications && userApplications.length > 0 ?
        (
          <>
          <Collapsible trigger={<h3>Applications</h3>} open lazyRender>
            <div id="dataTableContainer">
              {
                (
                  <DataTable 
                    columns={columns}
                    data={userApplications}
                    pagination
                    noHeader={true}
                    striped={true}
                    customStyles={customStyles}
                    paginationRowsPerPageOptions={paginationRowsPerPageOptions}
                    paginationComponentOptions={paginationComponentOptions}
                  />
                )
              }
            </div>
          </Collapsible>
          {
            showApplication && (
              <div>
                <Collapsible trigger={<h3>Application History</h3>} open lazyRender>
                  <div id="dataTableContainer">
                    {
                      (
                        <DataTable 
                          columns={columnsAppHistory}
                          data={appHistory}
                          pagination
                          noHeader={true}
                          striped={true}
                          customStyles={customStyles}
                          paginationRowsPerPageOptions={paginationRowsPerPageOptions}
                          paginationComponentOptions={paginationComponentOptions}
                        />
                      )
                    }
                  </div>
                </Collapsible>
                {
                  loading.application ? (
                    <Loading />
                  ) : (
                    !tempHideForm && (
                      <form
                        autoComplete="off"
                        onSubmit={handleSubmit(onSubmitSaveApplication)}
                      >
                        <ChildFormViewStyled
                          childInformation={childInformation}
                          vendor={{name: vendorName}}
                          ProfileImg={ProfileImg}
                          isReadonly={isReadonly}
                          handleChangeToEdit={handleChangeToEdit}
                          errors={errors}
                          register={register}
                          handleChildFormDetailsChange={handleChildFormDetailsChange}
                          isFormHistory={isFormHistory}
                          app_programs={selectedApplication.vendorPrograms}
                          location_sites={selectedApplication.vendorLocationSites}
                        />
                        <hr className="style-eight"></hr>
                        <ParentFormViewStyled
                          parents={parentsInformation}
                          vendor={{name: vendorName}}
                          ProfileImg={ProfileImg}
                          handleParentFormDetailsChange={handleParentFormDetailsChange}
                          isReadonly={isReadonly}
                          isUpdate={true}
                          emergencyContacts={emergencyContacts}
                          errors={errors}
                        />
                        <TermsWaiverFormViewStyled
                          application={selectedApplication}
                        />
                        {
                          !isReadonly && (
                            <div style={{textAlign: "center", marginBottom: "20px"}}>
                              <button className="save-button" type="Submit">Save</button>
                            </div>
                          )
                        }
                      </form>
                    )
                  )
                }
              </div>
            )
          }
          </>
        ) : (
          <Loading />
        )
      }
    </MyApplicationStyled>
  );
}