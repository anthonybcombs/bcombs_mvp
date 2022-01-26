import React, {useRef, useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint
} from "@fortawesome/free-solid-svg-icons";

import { 
  requestGetApplicationByUserId, 
  requestSaveApplication ,
  requestGetApplicationHistory,requestGetUserApplicationHistory
} from "../../../redux/actions/Application";

import DataTable from "react-data-table-component";


import ProfileImg from "../../../images/defaultprofile.png";
import ChildFormViewStyled from "../Application/view/child";
import ParentFormViewStyled from "../Application/view/parent";

import DaycareChildFormView from "../Application/daycare/child";
import RelationshipToChildStyled from "../DaycareApplicationForm/RelationshipToChildForm";
import DaycareParentFormView from "../Application/daycare/parent";

import TermsWaiverFormViewStyled from "../Application/view/waiver";
import Loading from "../../../helpers/Loading.js";
import SuccessUpdateModal from "../MyApplication/SuccessUpdateModal";


const DATE_TIME_FORMAT = "LLL dd, yyyy p";

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
  }
  @page {
    size: auto;
    margin: 5mm;
  }
`;


const ChildInformationViewStyled = styled.div`
  padding: 1em;

  .mentee-header {
    margin-bottom: 20px;
    box-shadow: 0px 0px 10px #ccc;
  }

  .mentee-title {
    background: #f26e21;
    color: white;
    border-top-left-radius: 11px;
    border-top-right-radius: 11px;
    padding: 15px;
    font-size: 1.2em;
  }

  .mentee-info {
    display: flex;
  }

  .mentee-info > div {
    background-color: #fff;
    display: block;
  }

  .mentee-info .extra-space {
    width: 25%;
  }

  .mentee-info .profile-image {
    padding: 20px;
    width: 15%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mentee-info .profile-image img {
    width: 100px;
    height: 100px;
  }

  .mentee-info .profile-info {
    width: 60%;
    padding: 20px;
  }

  .mentee-info .profile-image,
  .mentee-info .profile-info,
  .mentee-info .extra-space {
    border-bottom: solid 1px #ccc;
  }

  .mentee-info .extra-space {
    border-left: solid 1px #ccc;
  }

  .mentee-info .profile-info h1 {
    font-weight: normal;
    margin: 0;
    margin-bottom: 16px;
  }

  .mentee-info .profile-info .content {
    display: flex;
    font-size: 16px;
  }

  .mentee-info .profile-info .left,
  .mentee-info .profile-info .right {
    width: 50%;
    display: block;
  }

  .mentee-info .profile-info .label {
    color: #f26e21;
    width: 30%;
    display: inline-block;
    margin-bottom: 10px;
  }

  .mentee-info .profile-info .value {
    display: inline-block;
    width: 70%;
    margin-bottom: 10px;
  }

  .mentee-family {
    padding: 20px;
    background-color: #fff;
    border-bottom-left-radius: 11px;
    border-bottom-right-radius: 11px;
  }

  .mentee-family h1 {
    font-weight: normal;
    margin: 0;
    margin-bottom: 16px;
  }

  .mentee-family table {
    width: 50%;
  }

  .mentee-family table td {
    padding: 5px 0;
  }

  .mentee-family table td.label {
    color: #f26e21;
  }

  .mentee-body {
    margin-top: 10px;
    display: flex;
    flex-flow: row wrap;
  }

  .mentee-body .block {
    padding-left: 3px;
    padding-right: 3px;
    width: 32.9%;
  }

  .mentee-body .extra_activitybox {
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0px 0px 10px #ccc;
    padding: 10px 15px;
    margin-bottom: 10px;
  }

  .mentee-body h4 {
    border-bottom: 3px solid #f26e21;
    width: fit-content;
    margin: 0 auto;
    display: table;
    padding-bottom: 5px;
    font-size: 20px;
  }

  .mentee-body .extra_activitylist {
    margin-top: 20px;
    height: 230px;
    overflow-x: hidden;
    padding: 10px;
  }

  @media screen and (max-width: 1366px) {
    .mentee-body .block {
      width: 32.8%;
    }
  }

  @media screen and (max-width: 1080px) {
    .mentee-body .block {
      width: 49.3%;
    }
  }
`;

const AuditTrailStyled = styled.div`
  padding: 20px;
  #dataTableContainer a {
    color: #3e89fe;
    -webkit-text-decoration: none;
    text-decoration: none;
    padding: 12px;
  }
`;

const SelectWrapper = styled.div`
  display: flex;
  flex: 1 1 100%;
  justify-content: flex-start;

  input {
    margin-right: auto;
    width: 100%;
    max-width: 280px;
    min-width: 200px;
  }

  .form-control {
    display: block;
    width: 100%;
    height: auto;
    padding: 6px 12px;
    font-size: 16px;
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

  select.form-control {
    height: 32px;
    width: auto;
    margin-left: 1rem;
  }
`;

const TextField = styled.input`
  box-sizing: border-box;
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
  font-size: 16px;
  m &:hover {
    cursor: pointer;
  }
`;
const CLASS_OPTIONS = [
  "Seniors",
  "Juniors",
  "Sophomores",
  "Freshmen",
  "Middle School"
];

const STUDENT_CLASS_OPTIONS = [
  { name: "In process", value: "new_applicant_in_process" },
  { name: "Accepted", value: "new_applicant_accepted" },
  { name: "Rejected", value: "new_applicant_rejected" },
  { name: "Current Student", value: "current_student" },
  { name: "Waiting List", value: "waiting_list" },
  { name: "No longer a Student", value: "no_longer_student" },
  { name: "Missed opportunity", value: "missed_opportunity" },
  { name: "Pending Resubmission", value: "pending_resubmission"}
];



const FilterComponent = ({
  onFilter,
  onClassChange,
  onStatusChange,
  onClear,
  filterText,
  classText,
  statusText
}) => (
  <>
    <SelectWrapper>
      <TextField
        id="search"
        type="text"
        placeholder="Search Name"
        value={filterText}
        onChange={onFilter}
      />
  
      {/* <select
        name="class"
        className="form-control"
        value={classText}
        onChange={onClassChange}>
        <option value="">Select Class</option>
        {CLASS_OPTIONS.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
   */}
      {/* <ClearButton type="button" onClick={onClear}>X</ClearButton> */}
    </SelectWrapper>
  </>
);

const AuditTrail = props => {
  const dispatch = useDispatch();

  const { auth, applications, loading } = useSelector(
    ({auth, applications, loading}) => {
      return {auth, applications, loading}
    }
  );

  // if(applications.updateapplication && applications.updateapplication.message == "application successfully updated") {
  //   window.location.reload(false);
  // }

  const [selectedApplication, setSelectedApplication] = useState({});

  const [showApplication, setShowApplication] = useState(false);

  const [isReadonly, setIsReadonly] = useState(true);

  const [childInformation, setChildInformation] = useState({});

  const [parentsInformation, setParentsInformation] = useState([]);

  const [appHistory, setAppHistory] = useState([])

  const [vendorName, setVendorName] = useState();

  const [tempHideForm, setTempHideForm] = useState(true);


  const [isFormHistory, setIsFormHistory] = useState(false)

  const [emergencyContacts, setEmergencyContacts] = useState([]);

  const [filterText, setFilterText] = useState("");
  const [classText, setClassText] = useState("");
  const [statusText, setStatusText] = useState("");
  const [colorText, setColorText] = useState("");

  const [defaultApplication,setDefaultApplication] = useState([])
  const [filteredData, setFilteredData] = useState([]);

  const [isLoading,setIsLoading ] = useState(true)

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true
  });

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
    console.log('AUTHHHH MY APPLCIATION', auth)
    if(auth.user_id) {
      dispatch(requestGetApplicationByUserId(auth.user_id))
    }
  }, []);



  useEffect(() => {
    
    if(applications && applications.applicationHistory) {
      let defaultData = applications.applicationHistory.sort((item1,item2 ) => new Date(item1.updated_at )- new Date(item2.updated_at)).reverse();
      setDefaultApplication(defaultData)
    }
    if(filterText !== '' && applications   &&  applications.applicationHistory) {
     
      let updatedApplication = applications ?  applications.applicationHistory.map((item,index) => {
        return {...item,index}
      }) : []
      updatedApplication = applications && updatedApplication.filter(item => {
        let application = item.details ? JSON.parse(item.details) : {}
        let name_match = true;
    
        if (filterText) {
          name_match =
            (application.child.firstname &&
              application.child.firstname
                .toLowerCase()
                .includes(filterText.toLowerCase())) ||
            (application.child.lastname &&
              application.child.lastname
                .toLowerCase()
                .includes(filterText.toLowerCase())) || 
              (application.child.vendorName  &&
                application.child.vendorName
                  .toLowerCase()
                  .includes(filterText.toLowerCase())) ||
                  (application.child.grade_desc  &&
                    application.child.grade_desc
                      .toLowerCase()
                      .includes(filterText.toLowerCase()));
          return name_match ;
                  
        }
    
        return false
      
      }).sort((item1,item2 ) => new Date(item1.updated_at )- new Date(item2.updated_at)).reverse();
     
      setFilteredData([...(updatedApplication || [])])
    
    }
    else{
      if(applications && applications.applicationHistory.length > 0) {
        let updatedApplication = applications.applicationHistory.map((item,index) => {
          return {...item,index}
        }).sort((item1,item2 )=> new Date(item1.updated_at )- new Date(item2.updated_at)).reverse();
        setFilteredData( updatedApplication|| [])
        setIsLoading(false)
      }
    }


    
  },[filterText,applications])

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {

        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onClassChange={e => setClassText(e.target.value)}
        onFilter={e => setFilterText(e.target.value)}
        onColorChange={e => setColorText(e.target.value)}
        onStatusChange={e => {
          setStatusText(e.target.value);
        }}
        onClear={handleClear}
        filterText={filterText}
        classText={classText}
        colorText={colorText}
        statusText={statusText}
      />
    );
  }, [filterText, classText, colorText, statusText]);

  let userApplications = [];

  if(applications && applications.userAllApplications.length > 0) {
    userApplications = applications.userAllApplications;
  }

  if( applications.updateapplication 
    && applications.updateapplication.message == "application successfully updated" ) {
    window.location.replace(window.location.origin);
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

  const scrollToApplicationForm = () => {
    const applicationElem = document.getElementById('userApplicationForm')
    if (applicationElem) {
      const y = applicationElem.getBoundingClientRect().top + window.scrollY;
      window.scroll({
        top: y,
        behavior: 'smooth'
      })
    }
  }

  const createHistoryViewButton = (row) => {
    return (
      <a 
        href=""
        onClick={(e) => {
          e.preventDefault();

          const application = JSON.parse(row.details);
          const childInformationObj = {
            profile: {
              image: "",
              application_date: `History Update: ${format(new Date(row.updated_at ? row.updated_at: ""), "LLL dd, yyyy p")}`,
              first_name: application.child.firstname ? application.child.firstname: "",
              last_name: application.child.lastname ? application.child.lastname:"",
              nick_name: application.child.nickname ? application.child.nickname: "",
              date_of_birth: new Date(application.child.birthdate),
              gender: application.child.gender,
              phone_type: application.child.phone_type ? application.child.phone_type: "",
              phone_number: application.child.phone_number ? application.child.phone_number:"",
              email_type: application.child.email_type ? application.child.email_type:"",
              email_address: application.child.email_address ? application.child.email_address: "",
              phone_type2: application.child.phone_type2 ? application.child.phone_type2: "",
              phone_number2: application.child.phone_number2 ? application.child.phone_number2:"",
              email_type2: application.child.email_type2 ? application.child.email_type2:"",
              email_address2: application.child.email_address2 ? application.child.email_address2: "",
              address: application.child.address ? application.child.address: "",
              city: application.child.city ? application.child.city: "",
              state: application.child.state ? application.child.state: "",
              zip_code: application.child.zip_code ? application.child.zip_code: "",
              location_site: application.child.location_site ? application.child.location_site: "",
              child_lives_with: application.child.child_lives_with ? parseArrayFormat(application.child.child_lives_with.split(",")) : [],
              program: application.child.programs ? parseArrayFormat(application.child.programs.split(",")) : [],
              ethinicity: application.child.ethnicities ? parseArrayFormat(application.child.ethnicities.split(",")) : [],
              nick_name: application.child.nickname ? application.child.nickname: ""
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
              has_suspended: application.child.has_suspended + "",
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
              phone_type: parent.phone_type ? parent.phone_type : "",
              phone_number: parent.phone_number ? parent.phone_number : "",
              phone_type2: parent.phone_type ? parent.phone_type2 : "",
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
            scrollToApplicationForm()
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
          }
          
          setTermsWaiver(termsWaiver);
        }}
      >
        View Application
      </a>
    )
  }

  const columns = [
    {
      name: "Updated At",
      selector: "updated_at",
      sortable: true,
      cell: row => {
        return format(new Date(row.updated_at), DATE_TIME_FORMAT);
      }
    },
    {
      name: "Updated By",
      selector: "updated_by",
      sortable: true,
      cell: row => {
        return row.updated_by
      }
    },
    {
      name: "Application Date",
      selector: "details",
      cell: row => {
        let application = row.details ? JSON.parse(row.details) : null;
        console.log("Applicationnnn", application);
        if (application && application.application_date) {
          return format(new Date(application.application_date), DATE_TIME_FORMAT);
        }
        return;
      }
    },
  
    {
      name: "Student Name",
      selector: "studentName",
      sortable: true,
      cell: row => {
       
         let updatedData =   defaultApplication.find(item => {
          return item.app_id === row.app_id
        })
        let application = updatedData && updatedData.details ? JSON.parse(updatedData.details) : null;
      
        if (application) {
          return (
            <a href={"menteeprofile/" + application.id}>
              <span>
                {application.child?.firstname + " " + application.child?.lastname}
              </span>
            </a>
          );
        }
        return;
      }
    },
    {
      name: "Group",
      selector: "class",
      sortable: true,
      cell: row => {
        let application = row.details ? JSON.parse(row.details) : null;

        if (application && !application.is_daycare) {
          return application.child?.grade_desc;
        }
        return;
      }
    },


    {
      name: "Vendor",
      selector: "vendor",
      sortable: true,
      cell: row => {
        let application = row.details ? JSON.parse(row.details) : null;
        if (application) {
          return application.vendorName;
        }
        return;
      }
    },

    {
      selector: 'class',
      sortable: true,
      cell: row => createViewButton(row)
    }
  ];

  const [relationships, setRelationships] = useState([]);
  const [chRelationships, setChRelationships] = useState([]);
  
  const createViewButton = (application) => {
    console.log('Create View Button Application',application)
    return (
      <a 
        href=""
        onClick={(e) => {
          e.preventDefault();
          const applicationDetails = application.details ? JSON.parse(application.details) : {};
          dispatch(requestGetApplicationHistory(application.app_id));

          const childInformationObj = {
            profile: {
              image: "",
              application_date: `Latest Update: ${format(new Date(application.updated_at || ''), "LLL dd, yyyy p")}`,
              first_name: applicationDetails.child.firstname ? applicationDetails.child.firstname: "",
              last_name: applicationDetails.child.lastname ? applicationDetails.child.lastname:"",
              nick_name: applicationDetails.child.nickname ? applicationDetails.child.nickname: "",
              date_of_birth: new Date(applicationDetails.child.birthdate),
              gender: applicationDetails.child.gender,
              phone_type: applicationDetails.child.phone_type ? applicationDetails.child.phone_type: "",
              phone_number: applicationDetails.child.phone_number ? applicationDetails.child.phone_number:"",
              email_type: applicationDetails.child.email_type ? applicationDetails.child.email_type:"",
              email_address: applicationDetails.child.email_address ? applicationDetails.child.email_address: "",
              address: applicationDetails.child.address ? applicationDetails.child.address: "",
              city: applicationDetails.child.city ? applicationDetails.child.city: "",
              state: applicationDetails.child.state ? applicationDetails.child.state: "",
              zip_code: applicationDetails.child.zip_code ? applicationDetails.child.zip_code: "",
              location_site: applicationDetails.child.location_site ? applicationDetails.child.location_site: "",
              child_lives_with: applicationDetails.child.child_lives_with ? parseArrayFormat(applicationDetails.child.child_lives_with.split(",")) : [],
              program: applicationDetails.child.programs ? parseArrayFormat(applicationDetails.child.programs.split(",")) : [],
              ethinicity: applicationDetails.child.ethnicities ? parseArrayFormat(applicationDetails.child.ethnicities.split(",")) : [],
              preffered_start_date: applicationDetails.child.preffered_start_date ? new Date(applicationDetails.child.preffered_start_date) : "",
              current_classroom: applicationDetails.child.current_classroom ? applicationDetails.child.current_classroom: "",
              primary_language: applicationDetails.child.primary_language ? applicationDetails.child.primary_language : "",
              needed_days: applicationDetails.child.needed_days ? applicationDetails.child.needed_days : "",
              schedule_tour: applicationDetails.child.schedule_tour ? applicationDetails.child.schedule_tour : "",
              voucher: applicationDetails.child.voucher ? applicationDetails.child.voucher : ""
            },
            general_information: {
              grade: applicationDetails.child.grade_number ? applicationDetails.child.grade_number: "",
              class_rank: applicationDetails.child.class_rank ? applicationDetails.child.class_rank : "",
              gpa_quarter_year: applicationDetails.child.gpa_quarter_year ? applicationDetails.child.gpa_quarter_year : "",
              gpa_quarter_q1: applicationDetails.child.gpa_quarter_q1 ? applicationDetails.child.gpa_quarter_q1 : "",
              gpa_quarter_q2: applicationDetails.child.gpa_quarter_q2 ? applicationDetails.child.gpa_quarter_q2 : "",
              gpa_quarter_q3: applicationDetails.child.gpa_quarter_q3 ? applicationDetails.child.gpa_quarter_q3 : "",
              gpa_quarter_q4: applicationDetails.child.gpa_quarter_q4 ? applicationDetails.child.gpa_quarter_q4 : "",
              gpa_cumulative_year: applicationDetails.child.gpa_cumulative_year ? applicationDetails.child.gpa_cumulative_year : "",
              gpa_cumulative_q1: applicationDetails.child.gpa_cumulative_q1 ? applicationDetails.child.gpa_cumulative_q1 : "",
              gpa_cumulative_q2: applicationDetails.child.gpa_cumulative_q2 ? applicationDetails.child.gpa_cumulative_q2 : "",
              gpa_cumulative_q3: applicationDetails.child.gpa_cumulative_q3 ? applicationDetails.child.gpa_cumulative_q3 : "",
              gpa_cumulative_q4: applicationDetails.child.gpa_cumulative_q4 ? applicationDetails.child.gpa_cumulative_q4 : "",
              act_scores: [],
              sat_scores: [],
              psat_scores: [],
              school_name: applicationDetails.child.school_name ? applicationDetails.child.school_name : "",
              school_phone: applicationDetails.child.school_phone ? applicationDetails.child.school_phone : "",
              has_suspended: applicationDetails.child.has_suspended + "",
              reason_suspended: applicationDetails.child.reason_suspended,
              mentee_start_year: applicationDetails.child.year_taken,
              hobbies: applicationDetails.child.hobbies ? applicationDetails.child.hobbies : "",
              life_events: applicationDetails.child.life_events ? applicationDetails.child.life_events : "",
              career_goals: applicationDetails.child.career_goals ? applicationDetails.child.career_goals : "",
              colleges: applicationDetails.child.colleges ? applicationDetails.child.colleges : "",
              team_affiliations: applicationDetails.child.affiliations ? applicationDetails.child.affiliations : "",
              awards: applicationDetails.child.awards ? applicationDetails.child.awards : "",
              accomplishments: applicationDetails.child.accomplishments ? applicationDetails.child.accomplishments : "",
              mentee_gain: applicationDetails.child.mentee_gain_program ? applicationDetails.child.mentee_gain_program : "",
              is_child_transferring: applicationDetails.child.is_child_transferring 
                ? applicationDetails.child.is_child_transferring 
                : "",
              does_child_require_physical_education_service: applicationDetails.child.does_child_require_physical_education_service 
                ? applicationDetails.child.does_child_require_physical_education_service 
                : "",
              history_prev_diseases: applicationDetails.child.history_prev_diseases 
                ? applicationDetails.child.history_prev_diseases 
                : "", //start of questions
              child_currently_doctors_care: applicationDetails.child.child_currently_doctors_care 
                ? applicationDetails.child.child_currently_doctors_care 
                : "",
              reasons_previous_hospitalizations: applicationDetails.child.reasons_previous_hospitalizations 
                ? applicationDetails.child.reasons_previous_hospitalizations 
                : "",
              comments_suggestion: applicationDetails.child.comments_suggestion 
                ? applicationDetails.child.comments_suggestion 
                : "",
              list_special_dietary: applicationDetails.child.list_special_dietary 
                ? applicationDetails.child.list_special_dietary 
                : "",
              list_any_allergies: applicationDetails.child.list_any_allergies 
                ? applicationDetails.child.list_any_allergies 
                : "",
              mental_physical_disabilities: applicationDetails.child.mental_physical_disabilities 
                ? applicationDetails.child.mental_physical_disabilities 
                : "",
              medical_action_plan: applicationDetails.child.medical_action_plan 
                ? applicationDetails.child.medical_action_plan 
                : "",
              list_fears_unique_behavior: applicationDetails.child.list_fears_unique_behavior 
                ? applicationDetails.child.list_fears_unique_behavior 
                : "",
              transfer_reason: applicationDetails.child.transfer_reason 
                ? applicationDetails.child.transfer_reason 
                : "",
              prev_school_phone: applicationDetails.child.prev_school_phone 
                ? applicationDetails.child.prev_school_phone 
                : "",
              prev_school_city: applicationDetails.child.prev_school_city 
                ? applicationDetails.child.prev_school_city 
                : "",
              prev_school_address: applicationDetails.child.prev_school_address 
                ? applicationDetails.child.prev_school_address 
                : "",
              prev_school_attended: applicationDetails.child.prev_school_attended 
                ? applicationDetails.child.prev_school_attended 
                : "",
              prev_school_state: applicationDetails.child.prev_school_state 
                ? applicationDetails.child.prev_school_state 
                : "",
              prev_school_zip_code: applicationDetails.child.prev_school_zip_code 
                ? applicationDetails.child.prev_school_zip_code 
                : ""
            },
            emergency_care_information: {
              doctor_name: applicationDetails.child.doctor_name ? applicationDetails.child.doctor_name : "",
              doctor_phone: applicationDetails.child.doctor_phone ? applicationDetails.child.doctor_phone : "",
              hospital_preference: applicationDetails.child.hospital_preference ? applicationDetails.child.hospital_preference : "",
              hospital_phone: applicationDetails.child.hospital_phone ? applicationDetails.child.hospital_phone : ""
            },
            ch_id: applicationDetails.child.ch_id,
            id: applicationDetails.child.ch_id
          }

          const parents = applicationDetails.parents;

          let items = []
          for(const parent of parents) {
            const profile = {
              first_name: parent.firstname ? parent.firstname : "",
              last_name: parent.lastname ? parent.lastname : "",
              phone_type: parent.phone_type ? parent.phone_type : "",
              phone_number: parent.phone_number ? parent.phone_number : "",
              phone_type2: parent.phone_type2 ? parent.phone_type2 : "",
              phone_number2: parent.phone_number2 ? parent.phone_number2 : "",
              email_type: parent.email_type ? parent.email_type : "",
              email_address: parent.email_address ? parent.email_address : "",
              email_type2: parent.email_type2 ? parent.email_type2 : "",
              email_address2: parent.email_address2 ? parent.email_address2 : "",
              address: parent.address ? parent.address : "",
              city: parent.city ? parent.city : "",
              state: parent.state ? parent.state : "",
              zip_code: parent.zip_code ? parent.zip_code : "",
              occupation: parent.occupation ? parent.occupation : "",
              employer_name: parent.employers_name ? parent.employers_name : "",
              goals_parent_program: parent.parent_goals ? parent.parent_goals : "",
              goals_child_program: parent.parent_child_goals ? parent.parent_child_goals : "",
              live_area: parent.live_area ? parent.live_area : 0, // 1: 1 - 5 year, 2: 5 - 10 year, 3: more than 10 year
              level_education: parent.level_of_education ? parent.level_of_education : "",
              child_importance_hs: parent.child_hs_grad ? parent.child_hs_grad : "",
              child_importance_col: parent.child_col_grad ? parent.child_col_grad : "",
              person_recommend: parent.person_recommend ? parent.person_recommend: "",
              ethinicity: parent.ethnicities
                ? parseArrayFormat(parent.ethnicities.split(","))
                : [],
              gender: parent.gender,
              date_of_birth: new Date(parent.birthdate)
            }
          
            items.push({profile: profile, parent_id: parent.parent_id});
          }

          if(applicationDetails && applicationDetails.vendorPrograms && applicationDetails.vendorPrograms.length > 0) {
            let app_programs = []

            for(const program of applicationDetails.vendorPrograms) {
              app_programs.push({
                id: program.id,
                name: program.name,
                label: program.name
              })
            }

            applicationDetails.vendorPrograms = app_programs;
          }

          setSelectedApplication(applicationDetails);

          if(applicationDetails.emergency_contacts) {
            setEmergencyContacts(JSON.parse(applicationDetails.emergency_contacts));
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

          setRelationships(application.relationships);
          setChRelationships(application.chRelationships);

          const termsWaiver = {
            date: new Date().toString(),
            section1: {
              checked: !!applicationDetails.section1_signature,
              signature: applicationDetails.section1_signature
            },
            section2: {
              checked: !!applicationDetails.section2_signature,
              signature: applicationDetails.section2_signature
            },
            section3: {
              checked: !!applicationDetails.section3_signature,
              signature: applicationDetails.section3_signature
            }
          }
          
          setTermsWaiver(termsWaiver);

          setTimeout(() => {
            setTempHideForm(false);
            scrollToApplicationForm()
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
      if(id === "has_suspended") {
        if (value == "0")
          general_information = {...general_information, ["reason_suspended"]: ""};
      }

      console.log("value suspended", value);

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
      signature: "",
    }
  }

  const [termsWaiver, setTermsWaiver] = useState({...termsWaiverObj});

  const handleWaiverFormDetailsChange = (section, id, value) => {

    let subTermsWaiver = termsWaiver;

    if(section === "section1") {
      subTermsWaiver.section1[id] = value;
    } else if (section === "section2") {
      subTermsWaiver.section2[id] = value;
    } else if (section === "section3") {
      subTermsWaiver.section3[id] = value;
    } else {
      console.log("Invalid Section");
    }

    setTermsWaiver({...subTermsWaiver});
  }
  useEffect(() => {
    if (auth.user_id) {
      dispatch(requestGetUserApplicationHistory(auth.user_id));
    }
  }, []);
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
        birthdate: format(
          new Date(parent.profile.date_of_birth),
          DATE_TIME_FORMAT2),
        gender: parent.profile.gender,
        age: getAge(parent.profile.date_of_birth),
        ethnicities: getArrayValue(parent.profile.ethinicity),
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

  const DATE_TIME_FORMAT2 = "MM/dd/yyyy hh:mm:ss";

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
        has_suspended: parseInt(childInformation.general_information.has_suspended),
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
        nickname: childInformation.profile.nick_name,
        is_child_transferring: childInformation.general_information.is_child_transferring,
        does_child_require_physical_education_service: childInformation.general_information.does_child_require_physical_education_service,
        history_prev_diseases: childInformation.general_information.history_prev_diseases,
        child_currently_doctors_care: childInformation.general_information.child_currently_doctors_care,
        reasons_previous_hospitalizations: childInformation.general_information.reasons_previous_hospitalizations,
        comments_suggestion: childInformation.general_information.comments_suggestion,
        list_special_dietary: childInformation.general_information.list_special_dietary,
        list_any_allergies: childInformation.general_information.list_any_allergies,
        mental_physical_disabilities: childInformation.general_information.mental_physical_disabilities,
        medical_action_plan: childInformation.general_information.medical_action_plan,
        list_fears_unique_behavior: childInformation.general_information.list_fears_unique_behavior,
        transfer_reason: childInformation.general_information.transfer_reason,
        prev_school_phone: childInformation.general_information.prev_school_phone,
        prev_school_city: childInformation.general_information.prev_school_city,
        prev_school_address: childInformation.general_information.prev_school_address,
        prev_school_attended: childInformation.general_information.prev_school_attended,
        prev_school_state: childInformation.general_information.prev_school_state,
        prev_school_zip_code: childInformation.general_information.prev_school_zip_code,
        preffered_start_date:format(
          new Date(childInformation.profile.preffered_start_date),
          DATE_TIME_FORMAT2),
        current_classroom: childInformation.profile.current_classroom,
        primary_language: childInformation.profile.primary_language,
        needed_days: childInformation.profile.needed_days,
        schedule_tour: childInformation.profile.schedule_tour,
        voucher: childInformation.profile.voucher,
        ch_id: childInformation.ch_id
      },
      parents: setupParentsList(),
      emergency_contacts: JSON.stringify(emergencyContacts),
      section1_signature: termsWaiver.section1.signature,
      section1_date_signed: format(new Date(termsWaiver.date), DATE_TIME_FORMAT2),
      section2_signature: termsWaiver.section2.signature,
      section2_date_signed: format(new Date(termsWaiver.date), DATE_TIME_FORMAT2),
      section3_signature: termsWaiver.section3.signature,
      section3_date_signed: format(new Date(termsWaiver.date), DATE_TIME_FORMAT2),
      section1_text: selectedApplication.section1_text,
      section2_text: selectedApplication.section2_text,
      section3_text: selectedApplication.section3_text,
      section1_name: selectedApplication.section1_name,
      section2_name: selectedApplication.section2_name,
      section3_name: selectedApplication.section3_name,
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

    let tempTermsWaiver = termsWaiver
    if(isReadonly) {
      tempTermsWaiver.section1.signature = "";
      tempTermsWaiver.section2.signature = "";
      tempTermsWaiver.section3.signature = "";

      tempTermsWaiver.section1.checked = false;
      tempTermsWaiver.section2.checked = false;
      tempTermsWaiver.section3.checked = false;
    } else {
      tempTermsWaiver.section1.signature = selectedApplication.section1_signature;
      tempTermsWaiver.section2.signature = selectedApplication.section2_signature;
      tempTermsWaiver.section3.signature = selectedApplication.section3_signature;

      tempTermsWaiver.section1.checked = !!selectedApplication.section1_signature;
      tempTermsWaiver.section2.checked = !!selectedApplication.section2_signature;
      tempTermsWaiver.section3.checked = !!selectedApplication.section3_signature;
    }

    setTermsWaiver(tempTermsWaiver);

    setTimeout(() => {
      setIsReadonly(!isReadonly);
    }, 100);
  }
 

  console.log('filteredData223333',filteredData)
  return (
    <AuditTrailStyled>
      <div id="dataTableContainer">
        {
          <DataTable
            columns={columns}
            data={filteredData || []}
            keyField={'index'}
            pagination={true}
            paginationPerPage={10}
            noHeader={true}
            striped={true}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            progressPending={isLoading}
          />
        }
        {
          loading.application ? (
            <Loading />
          ) : (
            !tempHideForm && (
              <>
              <ApplicationFormStyled
                ref={componentRef}
                autoComplete="off"
                onSubmit={handleSubmit(onSubmitSaveApplication)}
              >
                {
                  selectedApplication &&
                  selectedApplication.is_daycare ? (
                    <>
                    <DaycareChildFormView
                      isFormHistory={true}
                      isVendorView={true}
                      childInformation={childInformation}
                      vendor={{name: vendorName}}
                      ProfileImg={ProfileImg}
                      isReadonly={isReadonly}
                      handleChangeToEdit={handleChangeToEdit}
                      errors={errors}
                      register={register}
                      handleChildFormDetailsChange={handleChildFormDetailsChange}
                      isFormHistory={isFormHistory}
                    />
                    <hr className="style-eight"></hr>
                    <DaycareParentFormView
                      parents={parentsInformation}
                      vendor={{name: vendorName}}
                      ProfileImg={ProfileImg}
                      handleParentFormDetailsChange={handleParentFormDetailsChange}
                      isReadonly={isReadonly}
                      isUpdate={true}
                      emergencyContacts={emergencyContacts}
                      errors={errors}
                      childProfile={selectedApplication?.child}
                    />
                    <hr className="style-eight"></hr>
                    <RelationshipToChildStyled
                      handleParentChildRelationship={()=> {}}
                      parents={parentsInformation}
                      childs={[{...childInformation}]}
                      errors={errors}
                      register={register}
                      isReadonly={isReadonly}
                      relationships={relationships}
                      chRelationships={chRelationships}
                      isReadView={true}
                    />
                    <hr className="style-eight"></hr>
                    <TermsWaiverFormViewStyled
                      application={selectedApplication}
                      isReadonly={isReadonly}
                      register={register}
                      errors={errors}
                      handleWaiverFormDetailsChange={handleWaiverFormDetailsChange}
                      termsWaiver={termsWaiver}
                    />
                    </>
                  ) : (
                    <>
                    <ChildFormViewStyled
                      isFormHistory={true}
                      isVendorView={true}
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
                      selectedApplication={selectedApplication}
                    />
                    <hr className="style-eight"></hr>
                    <TermsWaiverFormViewStyled
                      application={selectedApplication}
                      isReadonly={isReadonly}
                      register={register}
                      errors={errors}
                      handleWaiverFormDetailsChange={handleWaiverFormDetailsChange}
                      termsWaiver={termsWaiver}
                    />
                    </>
                  )
                }

                {
                  !isReadonly && (
                    <div style={{textAlign: "center", marginBottom: "20px"}}>
                      <button className="save-button" type="Submit">Save</button>
                    </div>
                  )
                }
              </ApplicationFormStyled>
              </>
            )
          )
        }
      </div>


 
    </AuditTrailStyled>
  );
};

export default AuditTrail;
