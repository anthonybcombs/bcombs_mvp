import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams, redirectTo } from "@reach/router";

import { format } from "date-fns";

import { requestVendor, requestVendorById2 } from "../../../redux/actions/Vendors";
import { requestAddApplication } from "../../../redux/actions/Application";

import ChildFormStyled from "./ChildSectionForm";
import ParentFormStyled from "./ParentSectionForm";
import RelationshipToChildStyled from "./RelationshipToChildForm";
import TermsWaiverFormStyled from "../ApplicationForm/Step3TermsWaiverForm";

import SuccessApplicationModal from "../ApplicationForm/SuccessApplicationModal";

import ProfileImg from "../../../images/defaultprofile.png";

import Loading from "../../../helpers/Loading.js";

import "../ApplicationForm/ApplicationForm.css";

import { uuid } from "uuidv4";

const DaycareApplicationFormStyled = styled.div`
  padding: 20px;
  position: relative;
  display: block;

  .success-message {
    text-align: center;
    margin: 20px 0;
    font-size: 16px;
    font-weight: 600;
    font-size: 20px;
    color: #f26e21;
  }
  .pc-relationship-wrapper {
    padding: 20px;
    background-color: #ffffff;
    box-shadow: 0 0 30px #ccc;
  }
  .pc-relationship-wrapper .header {
    background: #f47b2c;
    padding: 10px 0px;
    color: white;
    text-transform: uppercase;
    font-size: 18px;
    font-weight: 600;
    border-radius: 15px;
    text-align: center;
  }

  .pc-relationship-wrapper .content {
    border: 1px solid #ccc;
    border-radius: 5px;
    min-height: 275px;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    margin-bottom: 20px;
    padding: 0px 10px;

    display: flex;
    flex-wrap: wrap;
    padding: 2rem 0;
    justify-content: center
  }

  .question-box {
    background: white;
    display: inline-block;
    padding: 10px;
    border-radius: 12px;
    margin: .5rem;
    border: 1px solid #ccc;
    width: 100%;
    max-width: 400px;
  }

  .question-box p  {
    font-size: 19px;
    font-weight: 600;
    color: #4C5157;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
  }

  .question-box strong {
    color: #f47b2c;
  }

  .question-box ul li:before {
    content: "• ";
    position: absolute;
    left: -25px;
  }

  .question-box ul li {
    color: #4C5157;
    font-size: 18px;
    margin-top: 18px;
    display: grid;
    grid-template-columns: 50% 50%;
    position: relative;
  }

  .question-box span {
    font-weight: 600;
    color: #4C5157;
    white-space: normal;
  }

  .question-box small {
    margin-left: 5px;
  }

  .question-box select {
    width: 100%;
    padding: 3px;
    font-size: 15px;
    border-color: inherit;
    height: 30px;
  }

  .question-box .select-field-wrapper:after {
    right: 8px !important;
    bottom: 8px !important;
  }

  @media (max-width: 993px) {
    .content {
      padding: 0;
    }
    .question-box {
      max-width: unset;
    }
  }
`;

export default function index() {
  
  const [vendor, setVendor] = useState({});
  const [selectedStep, setSelectedStep] = useState(1);
  const [isParentAddressRequired,setIsParentAddressRequired] = useState(false)
  const dispatch = useDispatch();

  const { vendors, loading, applications, auth } = useSelector(
    ({ vendors, loading, applications, auth }) => {
      return { vendors, loading, applications, auth };
    }
  );

  const DATE_TIME_FORMAT = "MM/dd/yyyy hh:mm:ss";
  const SAVE_DATE_FORMAT = "yyyy-MM-dd";

  const BIRTHDATE_FORMAT = "yyyy-MM-dd";

  const DB_DATE_TIME_FORMAT = "yyyy-MM-dd hh:mm:ss";

  const { vendor_id } = useParams();

  useEffect(() => {
    if(vendor_id) {
      dispatch(requestVendorById2(vendor_id));
      //dispatch(requestVendor(vendor_id));
    }
  }, []);

  useEffect(() => {
    if (vendors && vendors.length > 0) {
      setVendor(vendors[0]);
    }
  }, [vendors]);

  useEffect(() => {
    console.log('form auth', auth);

    if(auth.status == 'SIGNED_IN') {
      console.log('parentsInformation', parentsInformation);

      let newParentsInformation = [...parentsInformation];

      console.log('new Date(auth.user.birth_date)', auth.user.birth_date);

      newParentsInformation[0].profile.address = auth.user.address ? 
        auth.user.address : newParentsInformation[0].profile.address;
      
      newParentsInformation[0].profile.date_of_birth = auth.user.birth_date ? 
        new Date(parseInt(auth.user.birth_date)) : newParentsInformation[0].profile.date_of_birth;

      newParentsInformation[0].profile.email_address = auth.user.email ? 
        auth.user.email : newParentsInformation[0].profile.email_address;

      newParentsInformation[0].profile.first_name = auth.user.first_name ? 
        auth.user.first_name : newParentsInformation[0].profile.first_name;

      newParentsInformation[0].profile.last_name = auth.user.last_name ? 
        auth.user.last_name : newParentsInformation[0].profile.last_name;

      newParentsInformation[0].profile.gender = auth.user.gender ? 
        auth.user.gender : newParentsInformation[0].profile.gender;

      const gender = auth.user.gender + "";
      newParentsInformation[0].profile.gender = auth.user.gender ? 
        gender.charAt(0).toUpperCase() + gender.slice(1) : newParentsInformation[0].profile.gender;
    }
  }, [auth])

  if(vendor && vendor.id) {
    if(!vendor.is_daycare) {
      window.location.replace(`/application/${vendor_id}`);
    }
  }

  const maxChild = 10;
  const maxParent = 3;

  // child section
  const childInfoObject = {
    id: uuid(),
    profile: {
      image: "",
      first_name: "",
      last_name: "",
      nick_name: "",
      date_of_birth: "",
      gender: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      ethinicity: [],
      program: [],
      child_lives_with: "",
      preffered_start_date: "",
      current_classroom: "",
      primary_language: "",
      needed_days: "",
      schedule_tour: "",
      voucher: ""
    },
    general_information: {
      has_suspended: "",
      reason_suspended: "",
      is_child_transferring: "",
      does_child_require_physical_education_service: "",
      history_prev_diseases: "", //start of questions
      child_currently_doctors_care: "",
      reasons_previous_hospitalizations: "",
      comments_suggestion: "",
      list_special_dietary: "",
      list_any_allergies: "",
      mental_physical_disabilities: "",
      medical_action_plan: "",
      list_fears_unique_behavior: "",
      transfer_reason: "",
      prev_school_phone: "",
      prev_school_city: "",
      prev_school_address: "",
      prev_school_attended: "",
      prev_school_state: "",
      prev_school_zip_code: ""
    },
    emergency_care_information: {
      doctor_name: "",
      doctor_phone: "",
      hospital_preference: "",
      hospital_phone: ""
    }
  };

  const [childsInformation, setChildsInformation] = useState([{...childInfoObject}]);

  const handleChildFormDetailsChange = (index, section, id, value) => {
    console.log('handleChildFormDetailsChange section', section)
    console.log('handleChildFormDetailsChange id', id)
    console.log('handleChildFormDetailsChange value', value)
    let childs = childsInformation;
    let profile = childs[index].profile;
    let general_information = childs[index].general_information;
    let emergency_care_information = childs[index]?.emergency_care_information;

    if(section === "profile") {
      profile = {...profile, [id]: value};
      childs[index].profile = profile;
    } else if(section === "general_information") {

      if(id === "has_suspended") {
        if (value == "Yes")
          general_information = {...general_information, ["reason_suspended"]: ""};
      }

      general_information = {...general_information, [id]: value};
      console.log('general_information',general_information)

      childs[index].general_information = general_information;
      console.log('general_information  childs[index]', childs[index])
    } else if(section === "emergency_care_information") {
      emergency_care_information = {...emergency_care_information, [id]: value};
      childs[index].emergency_care_information = emergency_care_information;
    }

    setChildsInformation([...childs]);
  }

  const handleAddNumChild = () => {
    if(childsInformation.length < maxChild) {
      childInfoObject.profile.address = childsInformation[0].profile.address;
      childInfoObject.profile.city = childsInformation[0].profile.city;
      childInfoObject.profile.state = childsInformation[0].profile.state;
      childInfoObject.profile.zip_code = childsInformation[0].profile.zip_code;
      childInfoObject.profile.location_site = childsInformation[0].profile.location_site;

      childInfoObject.profile.ethinicity = childsInformation[0].profile.ethinicity;
      childInfoObject.profile.program = childsInformation[0].profile.program;
      
      childInfoObject.emergency_care_information.doctor_name = childsInformation[0]?.emergency_care_information?.doctor_name;
      childInfoObject.emergency_care_information.doctor_phone = childsInformation[0]?.emergency_care_information?.doctor_phone;
      childInfoObject.emergency_care_information.hospital_preference = childsInformation[0]?.emergency_care_information?.hospital_preference;
      childInfoObject.emergency_care_information.hospital_phone = childsInformation[0]?.emergency_care_information?.hospital_phone;
      setChildsInformation([...childsInformation, childInfoObject]);
    }
  }

  const handleRemoveNumChild = (index) => {
    if(childsInformation.length > 1) {
      let tempChildsInformation = childsInformation;
      tempChildsInformation.splice( index, 1 )
      setChildsInformation([...tempChildsInformation]);
    }
  }

  const renderChildForm = () => {
    let items = [];

    for (let i = 1; i <= childsInformation.length; i++) {
      if (i == childsInformation.length) {
        items.push(
          <ChildFormStyled 
            handleChildFormDetailsChange={handleChildFormDetailsChange}
            childInformation={childsInformation[i - 1]} 
            counter={i} key={i}
            register={register}
            errors={errors}
            handleAddNumChild={handleAddNumChild}
            handleRemoveNumChild={handleRemoveNumChild}
            maxChild={maxChild}
            current={childsInformation.length}
            ProfileImg={ProfileImg}
          />
        )
      } else {
        items.push(
          <div key={i}>
          <ChildFormStyled 
            handleChildFormDetailsChange={handleChildFormDetailsChange}
            childInformation={childsInformation[i - 1]} 
            counter={i} key={i}
            register={register}
            errors={errors}
            handleAddNumChild={handleAddNumChild}
            handleRemoveNumChild={handleRemoveNumChild}
            maxChild={maxChild}
            current={childsInformation.length}
            ProfileImg={ProfileImg}
          />
          <hr className="style-eight"></hr>
        </div>
        )
      }
    }

    return (
      <div>
        {items}
      </div>
    )
  }

  // Parent Section

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

  const parentInfoObject = {
    id: uuid(),
    profile: {
      image: "",
      first_name: "",
      last_name: "",
      password: "",
      confirmed_password: "",
      gender: "",
      phone_type: "",
      phone_number: "",
      email_type: "",
      email_address: "",
      phone_type2: "",
      phone_number2: "",
      email_type2: "",
      email_address2: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      occupation: "",
      employer_name: "",
      goals_parent_program: "",
      goals_child_program: "",
      // live_area: 0, // 1: 1 - 5 year, 2: 5 - 10 year, 3: more than 10 year
      // level_education: "",
      // child_importance_hs: "",
      // child_importance_col: "",
      // person_recommend: "",
      gender: "",
      ethinicity: [],
      date_of_birth: ""
    }
  };
  
  const [parentsInformation, setParentsInformation] = useState([{...parentInfoObject}]);

  const [emergencyContacts, setEmergencyContacts] = useState([...emergency_contacts]);
  const handleParentFormDetailsChange = (index, section, id, value) => {
    if(section === "profile") {
      let parents = parentsInformation;
      let profile = parents[index].profile;

      profile = {...profile, [id]: value};
      parents[index].profile = profile;
      console.log('parents', parents);
      setParentsInformation([...parents]);
    } else if(section === "emergency_contacts") {
      let emergency_contacts = emergencyContacts;
      let x = id.split("-");
      emergency_contacts[index][id] = value;
      setEmergencyContacts([...emergencyContacts]);
    }

  
  }

  const handleAddParent = () => {
    if(parentsInformation.length < maxParent) {
      setParentsInformation([...parentsInformation, parentInfoObject]);
    }
  }

  const handleRemoveParent = (index) => {
    if(parentsInformation.length > 1) {
      let tempParentsInformation = parentsInformation;
      tempParentsInformation.splice( index, 1 )
      setParentsInformation([...tempParentsInformation]);
    }
  }

  //terms and waiver section

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


  const getNavItemClass = (step) => {
    let tempClass = "";
    tempClass += (step == selectedStep) ? "active": "";
    tempClass += " ";

    if(step > 1)  {
      for(let i = 1; i < step; i++) {
        if(!isFormValid(i)) {
          tempClass += "disabled";
          break;
        }
      }
    }

    return tempClass;
  }

  const handleWizardSelection = (index) => {
    setSelectedStep(index);
  }

  const section1BtnContainerStyle = {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginTop: 0,
    right: "15px"
  }

  const setupParentsList = (childProfile) => {
    let parents = [];

    parentsInformation.map((parent) => {
      parents.push({
        parent_id: parent.id,
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
        address: parent.profile.address,
        city: parent.profile.city,
        state: parent.profile.state,
        zip_code: parent.profile.zip_code !== '' ? parent.profile.zip_code : childProfile.zip_code,
        birthdate: format(
          new Date(parent.profile.date_of_birth),
          BIRTHDATE_FORMAT),
        gender: parent.profile.gender,
        age: getAge(parent.profile.date_of_birth),
        ethnicities: getAppEtnicities(parent.profile.ethinicity),
        image: parent.profile.image,
      })
    });

    return parents;
  }

  const getChildLivesWith = (childLivesWith = []) => {

    return childLivesWith.map(a => a.name).toString();
  }

  const getAppPrograms = (programs = []) => {
    return programs.map(a => a.name).toString();
  }

  const getAppEtnicities = (ethnicities = []) => {
    return ethnicities.map(a => a.name).toString();
  }

  const getAge = (date_of_birth) => {
    const age = Math.floor((new Date() - date_of_birth) / 31536000000);

    return age;
  }

  const onSubmit = () => {
    let payload = {};
    let applications = [];

    for(let i = 0; i < childsInformation.length; i++) {
      //setup Application Object
      let request_params = {
        vendor: vendor.id,
        is_daycare: 1,
        child: {
          ch_id: childsInformation[i].id,
          firstname: childsInformation[i].profile.first_name,
          lastname: childsInformation[i].profile.last_name,
          nickname: childsInformation[i].profile.nick_name,
          age: getAge(childsInformation[i].profile.date_of_birth),
          birthdate: format(
            new Date(childsInformation[i].profile.date_of_birth),
            BIRTHDATE_FORMAT),
          image: childsInformation[i].profile.image,
          gender: childsInformation[i].profile.gender,
          address: childsInformation[i].profile.address,
          city: childsInformation[i].profile.city,
          state: childsInformation[i].profile.state,
          zip_code: childsInformation[i].profile.zip_code,
          child_lives_with: getChildLivesWith(childsInformation[i].profile.child_lives_with),
          preffered_start_date:format(
            new Date(childsInformation[i].profile.preffered_start_date),
            BIRTHDATE_FORMAT),
          current_classroom: childsInformation[i].profile.current_classroom,
          primary_language: childsInformation[i].profile.primary_language,
          needed_days: childsInformation[i].profile.needed_days,
          schedule_tour: childsInformation[i].profile.schedule_tour,
          voucher: childsInformation[i].profile.voucher,
          has_suspended: childsInformation[i].general_information.has_suspended == "Yes" ? 1 : 0,
          reason_suspended: childsInformation[i].general_information.reason_suspended,
          ethnicities: getAppEtnicities(childsInformation[i].profile.ethinicity),
          programs: getAppPrograms(childsInformation[i].profile.program),
          doctor_name: childsInformation[i].emergency_care_information.doctor_name,
          doctor_phone: childsInformation[i].emergency_care_information.doctor_phone,
          hospital_preference: childsInformation[i].emergency_care_information.hospital_preference,
          hospital_phone: childsInformation[i].emergency_care_information.hospital_phone,
          is_child_transferring: childsInformation[i].general_information.is_child_transferring,
          does_child_require_physical_education_service: childsInformation[i].general_information.does_child_require_physical_education_service,
          history_prev_diseases: childsInformation[i].general_information.history_prev_diseases,
          child_currently_doctors_care: childsInformation[i].general_information.child_currently_doctors_care,
          reasons_previous_hospitalizations: childsInformation[i].general_information.reasons_previous_hospitalizations,
          comments_suggestion: childsInformation[i].general_information.comments_suggestion,
          list_special_dietary: childsInformation[i].general_information.list_special_dietary,
          list_any_allergies: childsInformation[i].general_information.list_any_allergies,
          mental_physical_disabilities: childsInformation[i].general_information.mental_physical_disabilities,
          medical_action_plan: childsInformation[i].general_information.medical_action_plan,
          list_fears_unique_behavior: childsInformation[i].general_information.list_fears_unique_behavior,
          transfer_reason: childsInformation[i].general_information.transfer_reason,
          prev_school_phone: childsInformation[i].general_information.prev_school_phone,
          prev_school_city: childsInformation[i].general_information.prev_school_city,
          prev_school_address: childsInformation[i].general_information.prev_school_address,
          prev_school_attended: childsInformation[i].general_information.prev_school_attended,
          prev_school_state: childsInformation[i].general_information.prev_school_state,
          prev_school_zip_code: childsInformation[i].general_information.prev_school_zip_code
        },
        parents: setupParentsList( childsInformation[i].profile),
        section1_signature: termsWaiver.section1.signature,
        section1_date_signed: format(new Date(termsWaiver.date), DB_DATE_TIME_FORMAT),
        section2_signature: termsWaiver.section2.signature,
        section2_date_signed: format(new Date(termsWaiver.date), DB_DATE_TIME_FORMAT),
        section3_signature: termsWaiver.section3.signature,
        section3_date_signed: format(new Date(termsWaiver.date), DB_DATE_TIME_FORMAT),
        section1_text: vendor.section1_text,
        section2_text: vendor.section2_text,
        section3_text: vendor.section3_text,
        section1_name: vendor.section1_name,
        section2_name: vendor.section2_name,
        section3_name: vendor.section3_name,
        emergency_contacts: JSON.stringify(emergencyContacts)
      }

      applications.push(request_params);
    }

    payload = {
      applications: applications,
      relationships: relationships,
      chRelationships: chRelationships,
      is_daycare: true
    };

    console.log('PAYLOADDDDDD', payload)
    dispatch(requestAddApplication(payload));
  }

  const { register, handleSubmit, errors, clearError, setError } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange"
  });

  const formRef = useRef(null);

  const isFormValid = (section) => {
    
    if(selectedStep == "5") return true;
    
    let isValid = true

    if(section == "1") {

      let childs = childsInformation;

      for(let i = 0; i < childsInformation.length; i++) {
        let child = childs[i];
        let profile = child.profile;
        let gi = child.general_information;

        console.log("gi.transfer_reason", gi.transfer_reason);

        
        if(!profile.first_name ||
          !profile.last_name ||
          !profile.date_of_birth ||
          !profile.gender ||
          !profile.address ||
          !profile.city ||
          !profile.state ||
          !profile.zip_code ||
          (profile.zip_code !== '' && profile.zip_code.length < 5) || 
          !profile.child_lives_with ||
          !profile.preffered_start_date ||
          !profile.current_classroom ||
          !profile.primary_language ||
          !profile.needed_days ||
          !profile.voucher ||
          !gi.is_child_transferring ||
          !gi.list_any_allergies ||
          (childsInformation[i].emergency_care_information !== '' &&  childsInformation[i].emergency_care_information.doctor_phone.includes('_')) || 
          (childsInformation[i].emergency_care_information  !== '' &&  childsInformation[i].emergency_care_information.hospital_phone.includes('_')) 
          ) {

            isValid = false;
            break;
          }

          if(gi.is_child_transferring == "Yes") {
           
            if(!gi.transfer_reason ||
              !gi.prev_school_phone ||
              !gi.prev_school_city ||
              !gi.prev_school_address ||
              !gi.prev_school_attended ||
              !gi.prev_school_state ||
              !gi.prev_school_zip_code || 
              (gi.prev_school_zip_code && gi.prev_school_zip_code.length < 5)) {
                isValid = false;
                break;
              }
          }
      }
    } else if(section == "2") {

      console.log('isParentAddressRequired',isParentAddressRequired)
      let parents = parentsInformation;
      console.log('PAARENTTTT', parentsInformation)
      console.log('PAARENTTTT emergencyContacts', emergencyContacts)
      for(let i = 0; i < parentsInformation.length; i++) {
        let parent = parents[i];
        let profile = parent.profile;

        if(profile.first_name  === '' || profile.last_name  === '') {
          isValid = false;
          break;
        }
        
        if(!profile.first_name ||
          !profile.last_name ||
          !profile.password ||
          !profile.confirmed_password ||
          !(profile.password == profile.confirmed_password) ||
          !profile.phone_number ||
          profile.phone_number.includes('_') || 
          !profile.email_address ||
          !profile.email_address.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) || 
          !profile.goals_parent_program ||
          !profile.goals_child_program ||
          !profile.gender ||
          !profile.date_of_birth ||
          (isParentAddressRequired && (!profile.address ||( !profile.zip_code || (profile.zip_code && profile.zip_code.length < 5)) || !profile.state || !profile.city))
          ) {
            isValid = false;
            break;
          }
      }

      for(let i = 0; i < 2; i++) {
        if(!emergencyContacts[i].first_name ||
          !emergencyContacts[i].last_name ||
          !emergencyContacts[i].gender ||
          !emergencyContacts[i].mobile_phone ||
          (emergencyContacts[i].mobile_phone && emergencyContacts[i].mobile_phone.includes('_')) ||
          (emergencyContacts[i].work_phone && emergencyContacts[i].work_phone.includes('_')  )||
          !emergencyContacts[i].relationship_to_child) {
            isValid = false;
            break;
          }
      }

    } else if(section == "3") {

      for(const item of relationships) {
        if(!item.relationship || !item.parent || !item.child) {
          isValid = false;
          break;
        }
      } 

    } else if(section == "4") {

      if((!termsWaiver.section1.checked || !termsWaiver.section1.signature) && vendor.section1_show > 0 ||
        (!termsWaiver.section2.checked || !termsWaiver.section1.signature) && vendor.section2_show > 0 ||
        (!termsWaiver.section3.checked || !termsWaiver.section3.signature) && vendor.section3_show > 0) {
          isValid = false;
        }
    }

    return isValid;
  }

  const handleParentChildRelationship = (parent, child, relationship) => {

    let exists = false;

    console.log("relationships", relationships)

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

  const handleChildChildRelationship = (child, child2, relationship) => {
    let exists = false;

    console.log("relationships", chRelationships)

    for(const [index, item] of chRelationships.entries()) {
      if(item.child == child && item.child2 == child2) {
        let tempRelationships = chRelationships;
        tempRelationships[index].child = child;
        tempRelationships[index].child2 = child2;
        tempRelationships[index].relationship = relationship;

        exists = true;
        setChRelationships([...tempRelationships]);
        break;
      }
    }

    if(!exists) {
      setChRelationships([...chRelationships, {
        child: child,
        child2: child2,
        relationship: relationship
      }])
    }
  }

  const handleRedirectToOrigin = () => {
    window.location.replace(window.location.origin);
  }

  console.log("errors", errors);

  const relationshipObj = {
    parent: parentsInformation[0].id,
    child: childsInformation[0].id,
    relationship: ""
  }

  const chRelationshipObj = {
    child: "",
    child2: "",
    relationship: ""
  }

  const [relationships, setRelationships] = useState([{...relationshipObj}]);

  const [chRelationships, setChRelationships] = useState([]);
  console.log('isParentAddressRequired',isParentAddressRequired)
  return (
    <DaycareApplicationFormStyled
      id="applicationForm"
    >
      {
        loading.application ? (
          <Loading />
        )  : applications.addapplication && applications.addapplication.message == "daycare application created" ? (
          <div className="container">
            <SuccessApplicationModal
              onRedirect={handleRedirectToOrigin}
            />
          </div>
        ) : (
          <div className="wizard-wrapper">
            {
              vendor && vendor.id ? (
                <>
                  <div className="wizard-inner">
                    <div className="connecting-line"></div>
                    <ul id="daycare-ul" className="nav-tabs">
                      <li className={selectedStep == 1 ? "active": ""}>
                        <a 
                          href="#" 
                          value="1"
                          onClick={(e) => {
                            e.preventDefault()
                            handleWizardSelection(1)
                          }}>
                            <span className="round-tab">1</span>
                            <span className="round-tab-title">Child</span>
                        </a>
                      </li>
                      <li 
                        className={getNavItemClass(2)}
                      >
                        <a href="#" onClick={(e) => {
                          e.preventDefault();
      
                          if(getNavItemClass(2).includes("disabled")) return;
      
                          handleWizardSelection(2)
                        }}>
                          <span className="round-tab">2</span>
                          <span className="round-tab-title">Parent</span>
                        </a>
                      </li>
                      <li
                        className={getNavItemClass(3)}
                      >
                        <a href="#" onClick={(e) => {
                          e.preventDefault();
      
                          if(getNavItemClass(3).includes("disabled")) return;
                          handleWizardSelection(3)
                        }}>
                          <span className="round-tab">3</span>
                          <span className="round-tab-title">Relationship to Child</span>
                        </a>
                      </li>
                      <li
                        className={getNavItemClass(4)}
                      >
                        <a href="#" onClick={(e) => {
                          e.preventDefault();
      
                          if(getNavItemClass(4).includes("disabled")) return;
                          handleWizardSelection(4)
                        }}>
                          <span className="round-tab">4</span>
                          <span className="round-tab-title">Terms & Waiver</span>
                        </a>
                      </li>
                      <li
                        className={getNavItemClass(5)}
                      >
                        <a href="#" onClick={(e) => {
                          e.preventDefault();
      
                          if(getNavItemClass(5).includes("disabled")) return;
                          handleWizardSelection(5)
                        }}>
                          <span className="round-tab">5</span>
                          <span className="round-tab-title">Review</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="container">
                    <form
                      autoComplete="off"
                      onSubmit={handleSubmit(onSubmit)}
                      ref={formRef}
                    >
                      <div className={(selectedStep == 1 || selectedStep == 5) ? "" : "hide"}>
                        { renderChildForm() }
                      </div>
                      {selectedStep == 5 && <hr className="style-eight"></hr>}
                      <div className={(selectedStep == 2 || selectedStep == 5) ? "" : "hide"}>
                        <ParentFormStyled
                          handleParentFormDetailsChange={handleParentFormDetailsChange}
                          parentsInformation={parentsInformation}
                          handleAddParent={handleAddParent}
                          handleRemoveParent={handleRemoveParent}
                          maxParent={maxParent}
                          current={parentsInformation.length}
                          register={register}
                          errors={errors}
                          emergencyContacts={emergencyContacts}
                          ProfileImg={ProfileImg}
                          setIsParentAddressRequired={setIsParentAddressRequired}
                        />
                      </div>
                      {selectedStep == 5 && <hr className="style-eight"></hr>}
                      <div className={(selectedStep == 3 || selectedStep == 5 ) ? "" : "hide"}>
                        <RelationshipToChildStyled
                          handleParentChildRelationship={handleParentChildRelationship}
                          handleChildChildRelationship={handleChildChildRelationship}
                          parents={parentsInformation}
                          childs={childsInformation}
                          errors={errors}
                          register={register}
                        />
                      </div>
                      {selectedStep == 5 && <hr className="style-eight"></hr>}
                      <div className={(selectedStep == 4 || selectedStep == 5 ) ? "" : "hide"}>
                        <TermsWaiverFormStyled
                          handleWaiverFormDetailsChange={handleWaiverFormDetailsChange}
                          termsWaiver={termsWaiver}
                          register={register}
                          errors={errors}
                          vendor={vendor}
                        />
                      </div>
                      <div className="application-btn-container" style={(selectedStep == 1) ? section1BtnContainerStyle: {}}>
                        {
                          (selectedStep < 5 ) &&
                          <button
                            type="button"
                            className="right"
                            onClick={(e) => {
                              e.preventDefault();
      
                              if(!isFormValid(selectedStep)) {
                                formRef.current.dispatchEvent(new Event("submit", { cancelable: true }));
                                e.preventDefault();
                                return;
                              };
                              clearError();
                              if(selectedStep == 1) handleWizardSelection(2);
                              else if(selectedStep == 2) handleWizardSelection(3)
                              else if (selectedStep == 3) handleWizardSelection(4)
                              else if (selectedStep == 4) handleWizardSelection(5)
                              //scrollToTop("smooth");
      
                              window.scrollTo(0, 0)
      
                            }}
                          >
                            Next
                          </button>
                        }
                        {
                          (selectedStep > 1 && selectedStep != 5) &&
                          <a href="#" className="left" onClick={(e) => {
                            e.preventDefault();
                            console.log(';Handle Wizard Selection', selectedStep)
                            if(selectedStep == 4) handleWizardSelection(3)
                            else if(selectedStep == 3) handleWizardSelection(2);
                            else if(selectedStep == 2) handleWizardSelection(1)
                           
              
                            window.scrollTo(0, 0)
      
                          }}>
                            Previous
                          </a>
                        }
                        {
                          (selectedStep == 5 ) &&
                          <button>Submit</button>
                        }  
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <Loading />
              )
            }
          </div>
        )
      }
      <a href="#" className="to-top"></a>
    </DaycareApplicationFormStyled>
  )
}