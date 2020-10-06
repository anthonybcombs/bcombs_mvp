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
import TermsWaiverFormStyled from "../ApplicationForm/Step3TermsWaiverForm";

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

  const dispatch = useDispatch();

  const { vendors, loading, applications } = useSelector(
    ({ vendors, loading, applications }) => {
      return { vendors, loading, applications };
    }
  );

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
      pref_startdate: "",
      current_classroom: "",
      primary_language: "",
      needed_days: "",
      schedule_tour: "",
      voucher: ""
    },
    general_information: {
      is_child_tranferring: "",
      does_child_require_physical_education_service: "",
      was_suspended: 0,
      reason_suspended: "",
      history_prev_diseases: "", //start of questions
      child_currently_doctors_care: "",
      reasons_previous_hospitalizations: "",
      comments_suggestion: "",
      list_special_dietary: "",
      list_any_allergies: "",
      mental_physical_disabilities: "",
      medical_action_plan: "",
      list_fears_unique_behavior: ""
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
        if (value == "0")
          general_information = {...general_information, ["reason_suspended"]: ""};
      }

      general_information = {...general_information, [id]: value};

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

  const renderChildForm = () => {
    let items = [];

    for (let i = 1; i <= childsInformation.length; i++) {
      console.log("childsInformation", childsInformation);
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
      live_area: 0, // 1: 1 - 5 year, 2: 5 - 10 year, 3: more than 10 year
      level_education: "",
      child_importance_hs: "",
      child_importance_col: "",
      person_recommend: "",
      gender: "",
      ethinicity: "",
      birthdate: ""
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

      console.log("emergencyContacts", emergencyContacts);
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

      console.log("parentsInformation", parentsInformation);
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

  const onSubmit = () => {

  }

  const { register, handleSubmit, errors, clearError, setError } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange"
  });

  const formRef = useRef(null);

  const isFormValid = (section) => {
    return true;
  }

  return (
    <DaycareApplicationFormStyled
      id="applicationForm"
    >
      {
        loading.application ? (
          <Loading />
        )  : (
          <div className="wizard-wrapper">
            {
              vendor && vendor.id ? (
                <>
                  <div className="wizard-inner">
                    <div className="connecting-line"></div>
                    <ul className="nav-tabs">
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
                      ref={formRef}
                    >
                      <div className={(selectedStep == 1 || selectedStep == 4) ? "" : "hide"}>
                        { renderChildForm() }
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
              
                            window.scrollTo(0, 0)
      
                          }}>
                            Previous
                          </a>
                        }
                        {
                          (selectedStep == 4 ) &&
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