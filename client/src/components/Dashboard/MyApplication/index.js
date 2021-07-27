import React, { useEffect, useRef,useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "@reach/router";
import Collapsible from "react-collapsible";
import DataTable from 'react-data-table-component';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint
} from "@fortawesome/free-solid-svg-icons";

import { format } from "date-fns";
import { parse } from "query-string";

import { useReactToPrint } from "react-to-print";
import { 
  requestGetApplicationByUserId, 
  requestSaveApplication ,
  requestGetApplicationHistory
} from "../../../redux/actions/Application";

import {
  requestVendorById
} from "../../../redux/actions/Vendors";

import { requestLogout } from "../../../redux/actions/Auth";

import ProfileImg from "../../../images/defaultprofile.png";
import ChildFormViewStyled from "../Application/view/child";
import ParentFormViewStyled from "../Application/view/parent";
import DaycareChildFormView from "../Application/daycare/child";
import RelationshipToChildStyled from "../DaycareApplicationForm/RelationshipToChildForm";
import DaycareParentFormView from "../Application/daycare/parent";

import TermsWaiverFormViewStyled from "../Application/view/waiver";
import Loading from "../../../helpers/Loading.js";
import SuccessUpdateModal from "./SuccessUpdateModal";
import SetRemindersModal from "./SetRemindersModal";

import Form from '../../Dashboard/Builders/Form'
import { requestUpdateSubmittedForm, requestGetCustomApplicationHistory } from '../../../redux/actions/FormBuilder'

/*
#applicationForm .ethnicity-labels{
      white-space:none !important;
      font-size:12px !important;
      margin-top:-5px;
    }
    */

const ApplicationFormStyled = styled.form`
  @media all {
    .page-break {
      // display: none;
    }
  }

  .form-group.ethnicity-form{
    margin-bottom:20px !important;
  }

  @media print {
    height: initial !important;
    overflow: initial !important;
    -webkit-print-color-adjust: exact;
    padding: 0px !important;
    .page-break {
      margin-top: 1rem;
      display: block;
      page-break-before: auto;
      position: relative;
    }
    #applicationForm .form-group {
      margin-top: 30px !important;
    }

    #applicationForm  .ethnicity-labels{
      white-space:none !important;
      font-size:12px !important;
      margin-top:-5px;
    }

    #applicationForm  .form-group.ethnicity-form{
      margin-bottom:20px !important;
    }
    .ch_phone_type2{
      margin-top:5px !important;
    }

    .child-info-wrapper .grid {
      display: grid;
      grid-template-columns: 31% 31% 31%;
      grid-gap: 3.33333333%;
      
    }

    .general-info-wrapper {
      padding-bottom: 30px !important;
      margin-top: 1rem;
      display: block;
      page-break-before: auto;
    }
  
    .general-info-wrapper .grid-1 {
      display: grid;
      grid-template-columns: 31% 31% 31%;
      grid-gap: 3.33333333%;
    }
  
    .general-info-wrapper .grid-2 {
      display: grid;
      grid-template-columns: 48.33% 48.33%;
      grid-gap: 3.33333333%;
    }
  
    .general-info-wrapper .grid-3 {
      display: grid;
      grid-template-columns: 31% 65.3%;
      grid-gap: 3.33333333%;
    }
  
    .general-info-wrapper .grid-4 {
      display: grid;
      grid-template-columns: 31% 21% 41%;
      grid-gap: 3.33333333%;
    }
  
    .general-info-wrapper .grid-5 {
      display: grid;
      grid-template-columns: 19.2% 19.2% 19.2% 19.2%;
      grid-gap: 8%;
    }
  
    .medical-info-wrapper .grid-2 {
      display: grid;
      grid-template-columns: 48.33% 48.33%;
      grid-gap: 3.33333333%;
    }
  
    @media (max-width: 768px) {

      #multiselectContainerReact {
        position: relative;
        top: 0;
      }
     .field-input:placeholder-shown + .field-label {
        max-width: calc(100% - 30%) !important;
      }
    }
    
    @media (max-width: 600px) {
      .medical-info-wrapper .grid-2 {
        padding: 0;
      }
    }
    

    .parent-info-wrapper .grid-1 {
      display: grid;
      grid-template-columns: 31% 31% 31%;
      grid-gap: 3.33333333%;
    }
  
    .parent-info-wrapper .grid-2 {
      display: grid;
      grid-template-columns: 48.33% 48.33%;
      grid-gap: 3.33333333%;
    }
  
    .parent-info-wrapper .grid-3 {
      display: grid;
      grid-template-columns: 31% 65.3%;
      grid-gap: 3.33333333%;
    }
  
    .parent-info-wrapper .grid-4 {
      display: grid;
      grid-template-columns: 31% 31% 31%;
      grid-gap: 3.33333333%;
    }
  
    .parent-info-wrapper .img-profile-wrapper {
      width: 17%;
      margin-bottom: 30px;
    }
  
    .parent-info-wrapper .address-wrapper {
      padding: 0;
      padding-right: 15px;
      user-select: none;
    }
  
    .parent-info-wrapper .add-address {
      margin-left: 15px;
      border: 2px solid #f26e21;
      position: relative;
      padding: 10px;
      margin-top: 20px;
      margin-bottom: 20px;
    }
  
    .parent-info-wrapper .add-address span i {
      background: #f26e21;
      width: 20px;
      height: 20px;
      line-height: 21px;
      text-align: center;
      border-radius: 50%;
      font-size: 13px;
      position: absolute;
      left: -10px;
      top: 12px;
      font-weight: normal;
      color: white;
      cursor: pointer;
    }
  
    .parent-info-wrapper .add-address span i.minus {
      background: #d33125 !important;
    }
  
    .parent-info-wrapper .add-address p {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      padding-left: 15px;
      color: #4b525a;
    }
  
    .parent-info-wrapper .address-field-wrapper {
      opacity: 0;
      visibility: hidden;
      display: none;
  
      -webkit-transition: opacity 100ms, visibility 100ms;
      transition: opacity 100ms, visibility 100ms;
    }
  
    .parent-info-wrapper .address-field-wrapper.show {
      visibility: visible;
      opacity: 1;
      display: grid;
    }
  
    @media (max-width: 768px) {
  
      #multiselectContainerReact {
        position: relative;
        top: 0;
      }
      .field-input:placeholder-shown + .field-label {
        max-width: calc(100% - 30%) !important;
      }
    }
  
    @media (max-width: 600px) {
      .parent-info-wrapper .grid-2,
      .parent-info-wrapper > div {
        padding: 0;
      }
    }
  }
  @page {
    size: auto;
    margin: 5mm;
  }
`;

const MyApplicationStyled = styled.div`
  padding: 1em;


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

  const { auth, applications, loading, vendors, form: { updateSubmittedForm, customApplicationHistory } } = useSelector(
    ({auth, applications, loading, vendors, form}) => {
      return {auth, applications, loading, vendors, form}
    }
  );

  
  if (updateSubmittedForm.message === 'successfully update your application form') {
    window.location.reload()
  }

  if(applications.updateapplication && applications.updateapplication.message == "application successfully updated") {
    window.location.reload(false);
  }

  const [selectedVendor, setSelectedVendor] = useState({});

  const location = useLocation();
  const queryParams = parse(location.search);

  useEffect(() => {
    console.log('queryParams', queryParams);

    if(auth.user_id) {
      dispatch(requestGetApplicationByUserId(auth.user_id))
    }

    if(queryParams && queryParams.action && queryParams.action == 'update') {
      console.log('this is update');
      setIsReadonly(false);
    }
  }, [])

  useEffect(() => {
    if (vendors && vendors.length > 0) {
      setSelectedVendor(vendors[0]);
    }
  }, [vendors]);

  const [userApplications, setuserApplications] = useState([])

  useEffect(() => {
    console.log('trigger userAllApplications');
    setuserApplications(applications.userAllApplications);

    let uApplications = applications.userAllApplications;

    console.log('uApplications', uApplications);

    if(queryParams && queryParams.appId && uApplications.length > 0) {
      const qappId = queryParams.appId;
      let sApplication = uApplications.filter((a) => {
        return a.app_id == qappId
      });

      sApplication = sApplication?.length > 0 ? sApplication[0] : {};

      console.log('sApplication', sApplication);

      if(sApplication && sApplication.app_id);
        initializeApplication(sApplication);
    }

    const hasSetReminders = uApplications.some(ua => ua.received_reminder);

    console.log('hasSetReminders', hasSetReminders);

    if(queryParams && queryParams?.action != 'update') {
      setShowReminder(hasSetReminders);
      setReminderApplications(uApplications.filter(ua => !!ua.received_reminder));
    }

  }, [applications.userAllApplications])

  const [showReminder, setShowReminder] = useState(false);

  const [reminderApplications, setReminderApplications] = useState([]);

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

  const [applicationFormKey, setApplicationFormKey] = useState(new Date().toISOString());
  const [selectedCustomFormHistory, setSelectedCustomFormHistory] = useState({});
  
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true,
    pageStyle:`
    #applicationForm  .highlights{

      border-top: none !important;
      border-left: none !important;
      border-right: none !important;
      border-bottom: 2px solid #ccc !important;
  
      background: none !important ;
      color: #555 !important;
    }
    #applicationForm .highlights-textarea {
      border: 2px solid #ccc !important;
      background: none !important ;
      color: #555 !important;
    }
    
    `
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

  if( applications.updateapplication 
    && applications.updateapplication.message == "application successfully updated" ) {
    //window.location.replace(window.location.origin);
    window.location.reload();
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
    if (view === 'builderForm') {
      const detailsObj = row.details ? JSON.parse(row.details) : {}
      row = {
        ...row,
        ...detailsObj
      }

      return (
        <a 
          href=""
          onClick={(e) => {
            e.preventDefault()
            setApplicationFormKey(new Date().toISOString());
            setSelectedCustomFormHistory(row)
            setIsReadonly(true)
            setIsFormHistory(true)
          }}
        >
          View Application
        </a>
      )
    }
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
              preffered_start_date: new Date(application.child.preffered_start_date),
              current_classroom: application.child.current_classroom ? application.child.current_classroom: "",
              primary_language: application.child.primary_language ? application.child.primary_language : "",
              needed_days: application.child.needed_days ? application.child.needed_days : "",
              schedule_tour: application.child.schedule_tour ? application.child.schedule_tour : "",
              voucher: application.child.voucher ? application.child.voucher : ""
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
              has_suspended: application.child.has_suspended ? 1 : 0,
              reason_suspended: application.child.reason_suspended,
              mentee_start_year: application.child.year_taken,
              hobbies: application.child.hobbies ? application.child.hobbies : "",
              life_events: application.child.life_events ? application.child.life_events : "",
              career_goals: application.child.career_goals ? application.child.career_goals : "",
              colleges: application.child.colleges ? application.child.colleges : "",
              team_affiliations: application.child.affiliations ? application.child.affiliations : "",
              awards: application.child.awards ? application.child.awards : "",
              accomplishments: application.child.accomplishments ? application.child.accomplishments : "",
              mentee_gain: application.child.mentee_gain_program ? application.child.mentee_gain_program : "",
              is_child_transferring: application.child.is_child_transferring 
                ? application.child.is_child_transferring 
                : "",
              does_child_require_physical_education_service: application.child.does_child_require_physical_education_service 
                ? application.child.does_child_require_physical_education_service 
                : "",
              history_prev_diseases: application.child.history_prev_diseases 
                ? application.child.history_prev_diseases 
                : "", //start of questions
              child_currently_doctors_care: application.child.child_currently_doctors_care 
                ? application.child.child_currently_doctors_care 
                : "",
              reasons_previous_hospitalizations: application.child.reasons_previous_hospitalizations 
                ? application.child.reasons_previous_hospitalizations 
                : "",
              comments_suggestion: application.child.comments_suggestion 
                ? application.child.comments_suggestion 
                : "",
              list_special_dietary: application.child.list_special_dietary 
                ? application.child.list_special_dietary 
                : "",
              list_any_allergies: application.child.list_any_allergies 
              ? application.child.list_any_allergies 
              : "",
              mental_physical_disabilities: application.child.mental_physical_disabilities 
              ? application.child.mental_physical_disabilities 
              : "",
              medical_action_plan: application.child.medical_action_plan 
              ? application.child.medical_action_plan 
              : "",
              list_fears_unique_behavior: application.child.list_fears_unique_behavior 
              ? application.child.list_fears_unique_behavior 
              : "",
              transfer_reason: application.child.transfer_reason 
              ? application.child.transfer_reason 
              : "",
              prev_school_phone: application.child.prev_school_phone 
              ? application.child.prev_school_phone 
              : "",
              prev_school_city: application.child.prev_school_city 
              ? application.child.prev_school_city 
              : "",
              prev_school_address: application.child.prev_school_address 
              ? application.child.prev_school_address 
              : "",
              prev_school_attended: application.child.prev_school_attended 
              ? application.child.prev_school_attended 
              : "",
              prev_school_state: application.child.prev_school_state 
              ? application.child.prev_school_state 
              : "",
              prev_school_zip_code: application.child.prev_school_zip_code 
              ? application.child.prev_school_zip_code 
              : ""
            },
            emergency_care_information: {
              doctor_name: application.child.doctor_name ? application.child.doctor_name : "",
              doctor_phone: application.child.doctor_phone ? application.child.doctor_phone : "",
              hospital_preference: application.child.hospital_preference ? application.child.hospital_preference : "",
              hospital_phone: application.child.hospital_phone ? application.child.hospital_phone : ""
            },
            ch_id: application.child.ch_id,
            id: application.child.ch_id
          }

          const parents = application.parents;

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
              occupation: parent.zip_code ? parent.occupation : "",
              employer_name: parent.employer_name ? parent.employer_name : "",
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

            items.push({profile: profile, id: parent.parent_id, parent_id: parent.parent_id});
            
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

  const initializeApplication = (application) => {
    setSelectedVendor({});
    setView('bcombsform')
    if(application && application.form) {

    } else {

      dispatch(requestGetApplicationHistory(application.app_id));
      dispatch(requestVendorById(application.vendor));

      const childInformationObj = {
        profile: {
          image: "",
          application_date: 'Most Up to date Application',
          first_name: application.child.firstname ? application.child.firstname: "",
          last_name: application.child.lastname ? application.child.lastname:"",
          nick_name: application.child.nickname ? application.child.nickname: "",
          date_of_birth: application.child.birthdate ? new Date(application.child.birthdate) : "",
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
          ethinicity: application.child.ethnicities ? parseArrayFormat(application.child.ethnicities.split(",")) : [],
          nick_name: application.child.nickname ? application.child.nickname: "",
          preffered_start_date: new Date(application.child.preffered_start_date),
          current_classroom: application.child.current_classroom ? application.child.current_classroom: "",
          primary_language: application.child.primary_language ? application.child.primary_language : "",
          needed_days: application.child.needed_days ? application.child.needed_days : "",
          schedule_tour: application.child.schedule_tour ? application.child.schedule_tour : "",
          voucher: application.child.voucher ? application.child.voucher : ""
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
          was_suspended: application.child.has_suspended + "",
          reason_suspended: application.child.reason_suspended,
          mentee_start_year: application.child.year_taken,
          hobbies: application.child.hobbies ? application.child.hobbies : "",
          life_events: application.child.life_events ? application.child.life_events : "",
          career_goals: application.child.career_goals ? application.child.career_goals : "",
          colleges: application.child.colleges ? application.child.colleges : "",
          team_affiliations: application.child.affiliations ? application.child.affiliations : "",
          awards: application.child.awards ? application.child.awards : "",
          accomplishments: application.child.accomplishments ? application.child.accomplishments : "",
          mentee_gain: application.child.mentee_gain_program ? application.child.mentee_gain_program : "",
          is_child_transferring: application.child.is_child_transferring 
            ? application.child.is_child_transferring 
            : "",
          does_child_require_physical_education_service: application.child.does_child_require_physical_education_service 
            ? application.child.does_child_require_physical_education_service 
            : "",
          history_prev_diseases: application.child.history_prev_diseases 
            ? application.child.history_prev_diseases 
            : "", //start of questions
          child_currently_doctors_care: application.child.child_currently_doctors_care 
            ? application.child.child_currently_doctors_care 
            : "",
          reasons_previous_hospitalizations: application.child.reasons_previous_hospitalizations 
            ? application.child.reasons_previous_hospitalizations 
            : "",
          comments_suggestion: application.child.comments_suggestion 
            ? application.child.comments_suggestion 
            : "",
          list_special_dietary: application.child.list_special_dietary 
            ? application.child.list_special_dietary 
            : "",
          list_any_allergies: application.child.list_any_allergies 
          ? application.child.list_any_allergies 
          : "",
          mental_physical_disabilities: application.child.mental_physical_disabilities 
          ? application.child.mental_physical_disabilities 
          : "",
          medical_action_plan: application.child.medical_action_plan 
          ? application.child.medical_action_plan 
          : "",
          list_fears_unique_behavior: application.child.list_fears_unique_behavior 
          ? application.child.list_fears_unique_behavior 
          : "",
          transfer_reason: application.child.transfer_reason 
          ? application.child.transfer_reason 
          : "",
          prev_school_phone: application.child.prev_school_phone 
          ? application.child.prev_school_phone 
          : "",
          prev_school_city: application.child.prev_school_city 
          ? application.child.prev_school_city 
          : "",
          prev_school_address: application.child.prev_school_address 
          ? application.child.prev_school_address 
          : "",
          prev_school_attended: application.child.prev_school_attended 
          ? application.child.prev_school_attended 
          : "",
          prev_school_state: application.child.prev_school_state 
          ? application.child.prev_school_state 
          : "",
          prev_school_zip_code: application.child.prev_school_zip_code 
          ? application.child.prev_school_zip_code 
          : ""
        },
        emergency_care_information: {
          doctor_name: application.child.doctor_name ? application.child.doctor_name : "",
          doctor_phone: application.child.doctor_phone ? application.child.doctor_phone : "",
          hospital_preference: application.child.hospital_preference ? application.child.hospital_preference : "",
          hospital_phone: application.child.hospital_phone ? application.child.hospital_phone : ""
        },
        ch_id: application.child.ch_id,
        id: application.child.ch_id
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
          date_of_birth: parent.birthdate ? new Date(parent.birthdate) : ""
        }
      
        items.push({profile: profile, id: parent.parent_id, parent_id: parent.parent_id});
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

      // const relationshipObj = {
      //   parent: items[0].parent_id,
      //   child: childInformationObj.ch_id,
      //   relationship: ""
      // }

      setRelationships(application.relationships);
      setChRelationships(application.chRelationships);
      
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
    }

    setTimeout(() => {
      setTempHideForm(false);
      scrollToApplicationForm()
    }, 200);
  }

  const [relationships, setRelationships] = useState([]);
  const [chRelationships, setChRelationships] = useState([]);
  const [view, setView] = useState('')
  const createViewButton = (application) => {
    console.log('selected application', application);
    if (application.form_contents) {
     return (<a
        href=""
        onClick={(e) => {
          e.preventDefault();
          //window.history.replaceState("","","?appId=" + application.app_id);
          // setShowApplication(true);
          setView('builderForm')
          dispatch(requestGetCustomApplicationHistory(application.app_id))
          setSelectedApplication(application)
        }}
      >
        View Application
      </a>)
    }
    return (
      <a 
        href=""
        onClick={(e) => {
          e.preventDefault();

          window.history.replaceState("","","?appId=" + application.app_id);
          
          initializeApplication(application);
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

  const columns = [
    {
      name: 'Application Date',
      selector: 'status',
      sortable: true,
      cell: row => format(new Date(row.application_date), DATE_TIME_FORMAT)
    },
    {
      name: 'Student Name',
      selector: 'studentName',
      sortable: true,
      // cell: row => <a target="_blank" href={"menteeprofile/" + row.id}><span>{row.child?.firstname + " " + row.child?.lastname}</span></a>
      cell: row => (row.child?.firstname && row.child?.lastname) ? row.child?.firstname + " " + row.child?.lastname : ""
    },
    {
      name: 'Form',
      selector: 'vendor',
      sortable: true,
      cell: row => row.vendorName ? row.vendorName + " Bcombs Form" : row?.form_contents?.formTitle ? row?.form_contents?.formTitle : ""
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

  // const handleRedirectToOrigin = () => {
  //   dispatch(requestLogout());
  //   setTimeout(() => {
  //     window.location.replace(window.location.origin);
  //   }, 500);
  // }

  const closeReminderModal = () => {
    setShowReminder(false);
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

  const DATE_TIME_FORMAT2 = "yyyy-MM-dd";

  const onSubmitSaveApplication = () => {

    let payload = {
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
        has_suspended: childInformation.general_information.has_suspended == "Yes" || childInformation.general_information.has_suspended == 1 ? 1 : 0,
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

    payload = {
      ...payload,
      relationships: relationships,
      received_reminder: !!selectedApplication?.received_reminder
    };
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

  const handleParentChildRelationship = (parent, child, relationship) => {

    let exists = false;

    for(const [index, item] of relationships.entries()) {
      if(item.parent == parent && item.child == child) {
        let tempRelationships = relationships;
        tempRelationships[index].parent = parent;
        tempRelationships[index].child = child;
        tempRelationships[index].relationship = relationship;

        exists = true;
        setRelationships([...tempRelationships]);
        break;
      }
    }

    if(!exists) {
      setRelationships([...relationships, {
        parent: parent,
        child: child,
        relationship: relationship
      }])
    }
  }
  return (
    <MyApplicationStyled>
      {
        /* userApplications.length > 0 */
        !loading.userAllApplications && userApplications?
        (
          <>
          {/* {
            applications.updateapplication && 
            applications.updateapplication.message == "application successfully updated" && (
              <SuccessUpdateModal
                onRedirect={handleRedirectToOrigin}
              />
            )
          } */}
          {
            showReminder && (
              <SetRemindersModal
                applications={reminderApplications}
                closeReminderModal={closeReminderModal}
              />
            )
          }
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
            (showApplication && view !== 'builderForm') && (
              <div>
                <Collapsible trigger={<h3>Application History</h3>} open lazyRender>
                  <div id="dataTableContainer">
                    {
                      (
                        <DataTable 
                          columns={columnsAppHistory}
                          data={applications.applicationHistory}
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
                      <>
                      <button className="print-button" onClick={handlePrint}>
                        {" "}
                        <FontAwesomeIcon icon={faPrint} />
                      </button>
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
                                childInformation={childInformation}
                                vendor={selectedVendor}
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
                                vendor={selectedVendor}
                                ProfileImg={ProfileImg}
                                handleParentFormDetailsChange={handleParentFormDetailsChange}
                                isReadonly={isReadonly}
                                isUpdate={true}
                                emergencyContacts={emergencyContacts}
                                selectedApplication={selectedApplication?.child}
                                childProfile={childInformation?.profile}
                              />
                              <hr className="style-eight"></hr>
                              <RelationshipToChildStyled
                                selectedApplication={selectedApplication}
                                handleParentChildRelationship={handleParentChildRelationship}
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
                                vendor={selectedVendor}
                              />
                            </>
                          ) : (
                            <>
                            <ChildFormViewStyled
                              childInformation={childInformation}
                              vendor={selectedVendor}
                              ProfileImg={ProfileImg}
                              isReadonly={isReadonly}
                              handleChangeToEdit={handleChangeToEdit}
                              errors={errors}
                              register={register}
                              handleChildFormDetailsChange={handleChildFormDetailsChange}
                              isFormHistory={isFormHistory}
                              location_sites={
                                vendors && vendors.length > 0 ? vendors[0].location_sites : []
                              }
                              app_programs={
                                vendors && vendors.length > 0 ? vendors[0].app_programs : []
                              }
                            />
                            <hr className="style-eight"></hr>
                            <ParentFormViewStyled
                              parents={parentsInformation}
                              vendor={selectedVendor}
                              ProfileImg={ProfileImg}
                              handleParentFormDetailsChange={handleParentFormDetailsChange}
                              isReadonly={isReadonly}
                              isUpdate={true}
                              emergencyContacts={emergencyContacts}
                              errors={errors}
                              selectedApplication={selectedApplication}
                              childProfile={childInformation}
                            />
                            <hr className="style-eight"></hr>
                            <TermsWaiverFormViewStyled
                              application={selectedApplication}
                              isReadonly={isReadonly}
                              register={register}
                              errors={errors}
                              handleWaiverFormDetailsChange={handleWaiverFormDetailsChange}
                              termsWaiver={termsWaiver}
                              vendor={selectedVendor}
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
            )
          }
          {
            view === 'builderForm' && (
              loading.updateForm ? (
                <Loading />
              ) : (
                <>
                  <Collapsible trigger={<h3>Application History</h3>} open lazyRender>
                    <div id="dataTableContainer">
                      {
                        (
                          <DataTable 
                            columns={columnsAppHistory}
                            data={customApplicationHistory}
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
                  <Form
                    historyList={customApplicationHistory}
                    key={applicationFormKey}
                    { ...(isFormHistory ? selectedCustomFormHistory : selectedApplication) }
                    application_date={
                      isFormHistory
                        ? `History Update: ${format(new Date(selectedCustomFormHistory.updated_at ? selectedCustomFormHistory.updated_at: ""), "LLL dd, yyyy p")}`
                        : 'Most Up to date Application'
                    }
                    isReadOnly={isReadonly}
                    isFormHistory={isFormHistory}
                    onChangeToEdit={handleChangeToEdit}
                    onGetUpdatedApplication={(form_contents) => setSelectedApplication({
                      ...selectedApplication,
                      form_contents
                    })}
                    onSubmitApplication={(form_contents) => {
                      dispatch(requestUpdateSubmittedForm({
                        updated_by: auth.email,
                        vendor: selectedApplication.vendor,
                        form: selectedApplication.form,
                        app_id: selectedApplication.app_id,
                        form_contents,
                        class_teacher: selectedApplication.class_teacher,
                        color_designation: selectedApplication.color_designation,
                        verification: selectedApplication.verification,
                        student_status: selectedApplication.student_status,
                        notes: selectedApplication.notes
                      }))
                    }}
                    onSelectLatest={() => {
                      setIsFormHistory(false)
                      setApplicationFormKey(new Date().toISOString())
                    }}
                  />
                </>
              )
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