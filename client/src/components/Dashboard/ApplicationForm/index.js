import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams, redirectTo } from "@reach/router";

import ChildFormStyled from "./Step1ChildForm";
import ParentFormStyled from "./Step2ParentForm";
import TermsWaiverFormStyled from "./Step3TermsWaiverForm";

import { format } from "date-fns";

import { requestVendor } from "../../../redux/actions/Vendors";
import { requestAddApplication } from "../../../redux/actions/Application";

import ProfileImg from "../../../images/defaultprofile.png";

import Loading from "../../../helpers/Loading.js";

import "./ApplicationForm.css";

import { uuid } from "uuidv4";

const ApplicationFormStyled = styled.div`
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
  }

  .question-box {
    background: white;
    display: inline-block;
    padding: 9px;
    border-radius: 12px;
    margin: 30px 5px;
    border: 1px solid #ccc;
    width: auto;
  }

  .question-box p  {
    font-size: 19px;
    font-weight: 600;
    color: #4C5157;
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
`;

export default function index() {

  const [vendor, setVendor] = useState({});

  const scrollToTop = (behavior) => {
    window.scrollTo({
      top: 0,
      behavior: behavior
    });
  }

  const { vendor_id } = useParams();

  const dispatch = useDispatch();

  const { vendors, loading, applications } = useSelector(
    ({ vendors, loading, applications }) => {
      return { vendors, loading, applications };
    }
  );

  if(applications.addapplication && applications.addapplication.message == "application created") {
    scrollToTop("auto");
    setTimeout(() => {
      window.location.replace(window.location.origin);
    }, 3000);
  }

  useEffect(() => {
    if(vendor_id) {
      dispatch(requestVendor(vendor_id));
    }
  }, []);

  useEffect(() => {
    console.log("vendor", vendors);
    if (vendors && vendors.length > 0) {
      setVendor(vendors[0]);
    }
  }, [vendors]);


  console.log("vendor", vendor);

  const section1BtnContainerStyle = {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginTop: 0,
    right: "15px"
  }

  const DATE_TIME_FORMAT = "yyyy-MM-dd hh:mm:ss";

  const [selectedStep, setSelectedStep] = useState(1);

  const [numChild, setNumChild] = useState(1);

  const [actCount, setActCount] = useState(1);

  const [satCount, setSatCount] = useState(1);

  const [psatCount, setPsatCount] = useState(1);

  const [showRelationshipView, setShowRelationshipView ] = useState(false);

  const handleWizardSelection = (index) => {
    setSelectedStep(index);
  }

  const handleScoresChange = (index, section, action) => {

    let childs = childsInformation;

    let general_information = childs[index].general_information;

    let actScores = general_information.act_scores;

    let satScores = general_information.sat_scores;

    let psatScores = general_information.psat_scores;

    if(section === "ACT") {
      if(action === "add") {
        let newVal = actCount + 1;
        if(newVal <= 3) {
          setActCount(newVal);
          actScores.push(scoreObj);
        }
      } else {
        let newVal = actCount - 1;
        if(newVal > 0) {
          setActCount(newVal);
          actScores.pop();
          
        }
      }
      general_information.act_scores = actScores;
    } else if (section === "SAT") {
      if(action === "add") {
        let newVal = satCount + 1;
        if(newVal <= 3) {
          setSatCount(newVal);
          satScores.push(scoreObj)
        }
      } else {
        let newVal = satCount - 1;
        if(newVal > 0) {
          setSatCount(newVal);
          satScores.pop();
        }
      }
      general_information.sat_scores = satScores;
    } else if (section === "PSAT") {
      if(action === "add") {
        let newVal = psatCount + 1;
        if(newVal <= 3) {
          setPsatCount(newVal);
          psatScores.push(scoreObj);
        }
      } else {
        let newVal = psatCount - 1;
        if(newVal > 0) {
          setPsatCount(newVal);
          psatScores.pop();
        }
      }
      general_information.psat_scores = psatScores;
    } else {
      console.log("Invalid Section");
    }
    childs[index].general_information = general_information;
    setChildsInformation([...childs]);
  }

  const maxChild = 10;
  const maxParent = 3;

  const scoreObj = {
    score: "",
    year: "",
    month: ""
  }

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
      location_site: "",
      ethinicity: [],
      program: [],
      child_lives_with: ""
    },
    general_information: {
      grade: "",
      class_rank: "",
      gpa_quarter_year: "",
      gpa_quarter_q1: "",
      gpa_quarter_q2: "",
      gpa_quarter_q3: "",
      gpa_quarter_q4: "",
      gpa_cumulative_year: "",
      gpa_cumulative_q1: "",
      gpa_cumulative_q2: "",
      gpa_cumulative_q3: "",
      gpa_cumulative_q4: "",
      act_scores: [{...scoreObj}],
      sat_scores: [{...scoreObj}],
      psat_scores: [{...scoreObj}],
      school_name: "",
      school_phone: "",
      was_suspended: null,
      reason_suspended: "",
      mentee_start_year: "",
      hobbies: "",
      life_events: "",
      career_goals: "",
      colleges: "",
      team_affiliations: "",
      awards: "",
      accomplishments: "",
      mentee_gain: ""
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

    let childs = childsInformation;
    let profile = childs[index].profile;
    let general_information = childs[index].general_information;
    let emergency_care_information = childs[index].emergency_care_information;

    if(section === "profile") {
      profile = {...profile, [id]: value};
      childs[index].profile = profile;
    } else if(section === "general_information") {

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
      childs[index].general_information = general_information;
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
      
      childInfoObject.emergency_care_information.doctor_name = childsInformation[0].emergency_care_information.doctor_name;
      childInfoObject.emergency_care_information.doctor_phone = childsInformation[0].emergency_care_information.doctor_phone;
      childInfoObject.emergency_care_information.hospital_preference = childsInformation[0].emergency_care_information.hospital_preference;
      childInfoObject.emergency_care_information.hospital_phone = childsInformation[0].emergency_care_information.hospital_phone;
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

  const renderChildform = () => {
    let items = [];

    for(let i = 1; i <= childsInformation.length; i++) {
      if(i == childsInformation.length) {
        items.push(
          <ChildFormStyled 
            handleChildFormDetailsChange={handleChildFormDetailsChange}
            childInformation={childsInformation[i - 1]} 
            counter={i} key={i}
            handleScoresChange={handleScoresChange}
            actCount={actCount}
            satCount={satCount}
            psatCount={psatCount}
            register={register}
            errors={errors}
            handleAddNumChild={handleAddNumChild}
            handleRemoveNumChild={handleRemoveNumChild}
            maxChild={maxChild}
            current={childsInformation.length}
            ProfileImg={ProfileImg}
          />
        );
      } else {
        items.push(
          <div key={i}>
            <ChildFormStyled 
              handleChildFormDetailsChange={handleChildFormDetailsChange}
              childInformation={childsInformation[i - 1]} 
              counter={i} key={i}
              handleScoresChange={handleScoresChange}
              actCount={actCount}
              satCount={satCount}
              psatCount={psatCount}
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
        );
      }
    }

    return (
      <div>
        {items}
      </div>
    )
  }

  // parent section

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
      live_area: 0, // 1: 1 - 5 year, 2: 5 - 10 year, 3: more than 10 year
      level_education: "",
      child_importance_hs: "",
      child_importance_col: "",
      person_recommend: ""
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

  const { register, handleSubmit, errors, clearError, setError } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange"
  });

  const isFormValid = (section) => {

    if(selectedStep == 4) return true;

    let isValid = true

    if(section == "1") {

      let childs = childsInformation;

      for(let i = 0; i < childsInformation.length; i++) {
        let child = childs[i];
        let profile = child.profile;
        let gi = child.general_information;


        if(!profile.first_name ||
          !profile.last_name ||
          !profile.date_of_birth ||
          !profile.gender ||
          !profile.address ||
          !profile.city ||
          !profile.state ||
          !profile.zip_code ||
          !profile.location_site ||
          !profile.child_lives_with ||
          !gi.grade ||
          !gi.school_name ||
          !gi.mentee_gain) {
            isValid = false;
            break;
          }
      }
    } else if(section == "2") {

      let parents = parentsInformation;

      for(let i = 0; i < parentsInformation.length; i++) {
        let parent = parents[i];
        let profile = parent.profile;
        
        if(!profile.first_name ||
          !profile.last_name ||
          !profile.password ||
          !profile.confirmed_password ||
          !(profile.password == profile.confirmed_password) ||
          !profile.phone_number ||
          !profile.email_address ||
          !profile.goals_parent_program ||
          !profile.goals_child_program ||
          !profile.person_recommend) {
            isValid = false;
            break;
          }
      }

      for(let i = 0; i < 2; i++) {
        if(!emergencyContacts[i].first_name ||
          !emergencyContacts[i].last_name ||
          !emergencyContacts[i].gender ||
          !emergencyContacts[i].mobile_phone ||
          !emergencyContacts[i].relationship_to_child) {
            isValid = false;
            break;
          }
      }

    } else if(section == "3") {

      if((!termsWaiver.section1.checked || !termsWaiver.section1.signature) && vendor.section1_show > 0 ||
        (!termsWaiver.section2.checked || !termsWaiver.section1.signature) && vendor.section2_show > 0 ||
        (!termsWaiver.section3.checked || !termsWaiver.section3.signature) && vendor.section3_show > 0) {
          isValid = false;
        }

      // if(!termsWaiver.section1.checked || 
      //   !termsWaiver.section1.signature ||
      //   !termsWaiver.section2.checked ||
      //   !termsWaiver.section2.signature ||
      //   !termsWaiver.section3.checked ||
      //   !termsWaiver.section3.signature) {
      //     isValid = false
      //   }
    }

    return isValid;
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

  const parseDate = (date) => {
    let today = new Date(date);
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    return today;
  }

  const getDatetime = (datetime) => {
    let today = new Date(datetime);
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + ' ' + time;

    return dateTime;
  }

  const getAge = (date_of_birth) => {
    const age = Math.floor((new Date() - date_of_birth) / 31536000000);

    return age;
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
        person_recommend: parent.profile.person_recommend
      })
    });

    return parents;
  }

  const getChildLivesWith = (childLivesWith = []) => {

    return childLivesWith.map(a => a.name).toString();
  }

  const onSubmit = () => {

    let payload = []
    for(let i = 0; i < childsInformation.length; i++) {
      //setup Application Object
      let request_params = {
        vendor: vendor.id,
        child: {
          firstname: childsInformation[i].profile.first_name,
          lastname: childsInformation[i].profile.last_name,
          age: getAge(childsInformation[i].profile.date_of_birth),
          birthdate: format(
            new Date(childsInformation[i].profile.date_of_birth),
            DATE_TIME_FORMAT),
          gender: childsInformation[i].profile.gender,
          phone_type: childsInformation[i].profile.phone_type,
          phone_number: childsInformation[i].profile.phone_number,
          email_type: childsInformation[i].profile.email_type,
          email_address: childsInformation[i].profile.email_address,
          phone_type2: childsInformation[i].profile.phone_type2,
          phone_number2: childsInformation[i].profile.phone_number2,
          email_type2: childsInformation[i].profile.email_type2,
          email_address2: childsInformation[i].profile.email_address2,
          address: childsInformation[i].profile.address,
          city: childsInformation[i].profile.city,
          state: childsInformation[i].profile.state,
          zip_code: childsInformation[i].profile.zip_code,
          location_site: childsInformation[i].profile.location_site,
          child_lives_with: getChildLivesWith(childsInformation[i].profile.child_lives_with),
          school_name: childsInformation[i].general_information.school_name,
          school_phone: childsInformation[i].general_information.school_phone,
          has_suspended: parseInt(childsInformation[i].general_information.was_suspended),
          reason_suspended: childsInformation[i].general_information.reason_suspended,
          year_taken: childsInformation[i].general_information.mentee_start_year,
          hobbies: childsInformation[i].general_information.hobbies,
          life_events: childsInformation[i].general_information.life_events,
          career_goals: childsInformation[i].general_information.career_goals,
          colleges: childsInformation[i].general_information.colleges,
          affiliations: childsInformation[i].general_information.team_affiliations,
          awards: childsInformation[i].general_information.awards,
          accomplishments: childsInformation[i].general_information.accomplishments,
          mentee_gain_program: childsInformation[i].general_information.mentee_gain,
          grade_number: childsInformation[i].general_information.grade,
          grade_desc: getGradeDesc(childsInformation[i].general_information.grade),
          class_rank: childsInformation[i].general_information.class_rank,
          gpa_quarter_year: childsInformation[i].general_information.gpa_quarter_year,
          gpa_quarter_q1: childsInformation[i].general_information.gpa_quarter_q1,
          gpa_quarter_q2: childsInformation[i].general_information.gpa_quarter_q2,
          gpa_quarter_q3: childsInformation[i].general_information.gpa_quarter_q3,
          gpa_quarter_q4: childsInformation[i].general_information.gpa_quarter_q4,
          gpa_cumulative_year: childsInformation[i].general_information.gpa_cumulative_year,
          gpa_cumulative_q1: childsInformation[i].general_information.gpa_cumulative_q1,
          gpa_cumulative_q2: childsInformation[i].general_information.gpa_cumulative_q2,
          gpa_cumulative_q3: childsInformation[i].general_information.gpa_cumulative_q3,
          gpa_cumulative_q4: childsInformation[i].general_information.gpa_cumulative_q4,
          ethnicities: "",
          programs: "",
          doctor_name: childsInformation[i].emergency_care_information.doctor_name,
          doctor_phone: childsInformation[i].emergency_care_information.doctor_phone,
          hospital_preference: childsInformation[i].emergency_care_information.hospital_preference,
          hospital_phone: childsInformation[i].emergency_care_information.hospital_phone
        },
        parents: setupParentsList(),
        section1_signature: termsWaiver.section1.signature,
        section1_date_signed: format(new Date(termsWaiver.date), DATE_TIME_FORMAT),
        section2_signature: termsWaiver.section2.signature,
        section2_date_signed: format(new Date(termsWaiver.date), DATE_TIME_FORMAT),
        section3_signature: termsWaiver.section3.signature,
        section3_date_signed: format(new Date(termsWaiver.date), DATE_TIME_FORMAT),
        section1_text: vendor.section1_text,
        section2_text: vendor.section2_text,
        section3_text: vendor.section3_text,
        section1_name: vendor.section1_name,
        section2_name: vendor.section2_name,
        section3_name: vendor.section3_name
      }

      payload.push(request_params);
    }
    console.log('Request Add Application Payload',payload)
    dispatch(requestAddApplication(payload));
  }

  const formRef = useRef(null);

  const formRef2 = useRef(null);

  const handleRelationshipEvent = (e) => {
    e.preventDefault();

    setShowRelationshipView(true);
  }

  const RELATION_TO_CHILD_OPTIONS = [
    { id: 1, value: "Mother", name: "Mother"},
    { id: 2, value: "Father", name: "Father"},
    { id: 3, value: "Grandparent", name: "Grandparent"},
    { id: 4, value: "Aunt / Uncle", name: "Aunt / Uncle"},
    { id: 5, value: "Sibling", name: "Sibling"},
    { id: 6, value: "Other Relative", name: "Other Relative"},
    { id: 7, value: "Family Friend", name: "Family Friend"},
    { id: 8, value: "Other", name: "Other"}
  ];

  const handleParentChildRelationship = () => {

  }

  return (
    <ApplicationFormStyled
      id="applicationForm">
        {
          loading.application ? (
            <Loading />
          ) : showRelationshipView ? (
            <div className="container">
              {
                applications.addapplication && applications.addapplication.message == "application created" && (
                  <div className="success-message">
                    Successfully submitted your application. Thank you!
                  </div>
                )
              }
              <form
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                ref = {formRef}
              >
                <div className="pc-relationship-wrapper">
                  <p className="header">
                    RELATIONSHIP QUESTIONNAIRE
                  </p>
                  <div className="content">
                    {
                      parentsInformation.map((parent, i) => (
                        <div key={i} className="question-box">
                          <p>What is the relation of <strong>{parent.profile.first_name}</strong> to</p>
                          {
                            <ul>
                            {
                              parentsInformation.map((otherParent, k) => (
                                parent.id != otherParent.id && (
                                  <li key={k}>
                                    <span>
                                      {otherParent.profile.first_name}
                                      <small style={{fontSize: "50%"}}>(Parent)</small>
                                    </span>
                                    
                                    <select
                                      name={"parent_parent" + i + "" + k}
                                      className="input-field"
                                      onChange={({target}) => {
                                        handleParentChildRelationship()
                                      }}
                                    >
                                      <option value="">Select</option>
                                      {
                                        RELATION_TO_CHILD_OPTIONS.map(opt => (
                                          <option key={opt.id} value={opt.name}>
                                            {opt.name}
                                          </option>
                                        ))
                                      }
                                    </select>
                                  </li>
                                )
                              ))
                            }
                            {
                              childsInformation.map((child, j) => (
                                <li key={j}>
                                  <span>
                                    {child.profile.first_name}
                                    <small style={{fontSize: "50%"}}>(Child)</small>  
                                  </span>
                                  <select
                                    name={"ch_parent" + i + "" + j}
                                    className="input-field"
                                    onChange={({target}) => {
                                      handleParentChildRelationship()
                                    }}
                                  >
                                    <option value="">Select</option>
                                    {
                                      RELATION_TO_CHILD_OPTIONS.map(opt => (
                                        <option key={opt.id} value={opt.name}>
                                          {opt.name}
                                        </option>
                                      ))
                                    }
                                  </select>
                                </li>
                              ))
                            }
                            </ul>
                          }
                        </div>
                      ))
                    }
                  </div>
                  <div className="header">
                    CHILD TO CHILD RELATIONSHIP QUESTIONNAIRE
                  </div>
                  <div className="content">
                    {
                      childsInformation.length > 1 && (
                        childsInformation.map((child, i) => (
                          <div key={i} className="question-box">
                            <p>What is the relation of <strong>{child.profile.first_name}</strong> to</p>
                            {
                              <ul>
                              {
                                childsInformation.map((otherChild, j) => (
                                  child.id != otherChild.id && (
                                    <li key={j}>
                                      <span>
                                        {otherChild.profile.first_name}
                                        <small style={{fontSize: "50%"}}>(Child)</small>  
                                      </span>
                                      <select
                                        name={"ch_ch" + i + "" + j}
                                        className="input-field"
                                        onChange={({target}) => {
                                          handleParentChildRelationship()
                                        }}
                                      >
                                        <option value="">Select</option>
                                        {
                                          RELATION_TO_CHILD_OPTIONS.map(opt => (
                                            <option key={opt.id} value={opt.name}>
                                              {opt.name}
                                            </option>
                                          ))
                                        }
                                      </select>
                                    </li>
                                  )
                                ))
                              }
                              </ul>
                            }
                          </div>
                        ))
                      )
                    }
                  </div>
                  <div className="application-btn-container">
                    <button type="submit">Submit</button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
          <div className="wizard-wrapper">
            <div className="wizard-inner">
              <div className="connecting-line"></div>
              <ul className="nav-tabs">
                <li className={selectedStep == 1 ? "active": ""}>
                  <a href="#" value="1" onClick={(e) => {
                     e.preventDefault();
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
                    <span className="round-tab-title">Terms & Waiver</span>
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
                    <span className="round-tab-title">Review</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="container">
              <form
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                ref = {formRef}
              >
                <div className={(selectedStep == 1 || selectedStep == 4) ? "" : "hide"}>
                  {
                    renderChildform()
                  }
                </div>
                {selectedStep == 4 && <hr className="style-eight"></hr>}
                <div className={(selectedStep == 2 || selectedStep == 4) ? "" : "hide"}>
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
                  />
                </div>
                {selectedStep == 4 && <hr className="style-eight"></hr>}
                <div className={(selectedStep == 3 || selectedStep == 4 ) ? "" : "hide"}>
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
                    selectedStep < 4 &&
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
          
                        //scrollToTop("smooth");

                        window.scrollTo(0, 0)

                      }}
                    >
                      Next
                    </button>
                  }
                  {
                    (selectedStep > 1 && selectedStep != 4) &&
                    <a href="#" className="left" onClick={(e) => {
                      e.preventDefault();
        
                      if(selectedStep == 3) handleWizardSelection(2);
                      else if(selectedStep == 2) handleWizardSelection(1)
        
                      scrollToTop("smooth");

                    }}>
                      Previous
                    </a>
                  }
                  {
                    (selectedStep == 4 ) &&
                    <button onClick={handleRelationshipEvent}>Submit</button>
                  }  
                </div>
              </form>
            </div>
          </div>
          )
        } 
   
      <a href="#" className="to-top"></a>
    </ApplicationFormStyled>
  );
}