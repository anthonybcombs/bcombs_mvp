import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "@reach/router";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapsible from "react-collapsible";
import DataTable from 'react-data-table-component';
import {
  faThList,
  faFile,
  faFileAlt,
  faFileSignature,
  faCogs,
  faCalendar,
  faPrint,
  faHistory,
  faLink,
  faCopy,
  faAngleLeft
} from "@fortawesome/free-solid-svg-icons";
import DefaultVendorSummaryStyled from "./default_vendor_summary";
import ApplicationSummaryStyled from "./summary";
import ApplicationSettingsStyled from "./settings";
import Logo from "./logo"
import ReminderSettingsStyled from "./reminder_settings"
import ApplicationListStyled from "./list";
import EditApplicationStyled from "./edit";
import ChildFormViewStyled from "./view/child";
import DaycareChildFormView from "./daycare/child";
import ParentFormViewStyled from "./view/parent";
import DaycareParentFormView from "./daycare/parent";
import RelationshipToChildStyled from "../DaycareApplicationForm/RelationshipToChildForm";
import CopyApplicationLinkModal from "./copylink";

import ImportExportApplication from './import_export_application';

import TermsWaiverFormViewStyled from "./view/waiver";
import {
  requestVendor,
  requestGetFormAppGroup,
  requestCreateGroupReminder,
  requestGetVendorReminders,
  requestCreateVendor,
  requestSelectedVendor,
  setDefaultVendor,
  setDefaultVendorForms
} from "../../../redux/actions/Vendors";

import {
  requestGetApplications,
  requestUpdateApplication,
  requestSaveApplication,
  requestGetApplicationHistory,
  requestGetCustomApplications,
} from "../../../redux/actions/Application";
import {
  requestGetForms,
  requestUpdateSubmittedForm,
  requestGetCustomApplicationHistory,
  requestAddForm
} from '../../../redux/actions/FormBuilder'

import Loading from "../../../helpers/Loading.js";
import ProfileImg from "../../../images/defaultprofile.png";

import { add, format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { parse } from "query-string";

import Form from '../../Dashboard/Builders/Form'

import AdminFormStyled from '../Admin/form/index';
import AdminFormModal from '../Admin/modal/index';
import { REQUEST_CUSTOM_APPLICATION_HISTORY_COMPLETED } from "../../../redux/actions/Constant";


import QRCodePReviewModal from '../Grades/TestInput/QRCodePReviewModal';


import { DEFAULT_VENDOR } from "../../../constants/vendors";

import { ASSESSMENT_FORM_IDS } from '../../../constants/forms';

import { getPageQrCode } from '../../../helpers/Forms';
import { isUUID } from '../../../helpers/Applications';
import form from "../../Calendar/big-calendar/search/form.js";



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
      position: relative;
      page-break-before: auto;
    }
    
    #applicationForm .form-group {
      margin-top: 30px !important;
    }

    #applicationForm .form-group.ethnicity-form {
      margin-bottom: 20px !important;
    }

    #userApplicationForm {
      margin-bottom: 4rem;
    }

    .printpage-break {
      padding: 0;
      page-break-after: always;
    }
    
    .printpage-break.parent-information #applicationForm >div {
      page-break-after: always;
    }

    .printpage-break.waiver-information #applicationForm >br {
      display: none;
    }

    .printpage-break.waiver-information #applicationForm >div {
      page-break-inside: avoid;
      margin-bottom: 4rem;
    }

    .child-info-wrapper,
    .general-info-wrapper,
    .medical-info-wrapper,
    .emergency-contact-wrapper,
    .waiver-wrapper,
    .relationship-wrapper,
    .parent-info-wrapper {
      box-shadow: none;
      padding: 0;
      margin-top: 0;
    }

    .style-eight {
      display: none;
    }
    
    

    .child-info-wrapper .grid {
      display: grid;
      grid-template-columns: 31% 31% 31%;
      grid-gap: 3.33333333%;

      page-break-inside: avoid;
    }

    .general-info-wrapper {
      padding-bottom: 30px !important;
      margin-top: 1rem;
      display: block;
      page-break-before: auto;
    }

    .general-info-wrapper >div {
      page-break-inside: avoid;
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
    
    .parent-info-wrapper >div {
      page-break-inside: avoid;
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

    .emergency-contact-wrapper {
      margin-top: 30px;
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

  #qrCodeButton {
    background-color: #f26e21;
    border-color: #f26e21;
    padding: 10px 32px;

    display: block;
    color: white;
    border-radius: 5px;

    margin: 0 15px;
    text-decoration: none;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: pre;
}


  .copy-vendor-btn {
    margin-left: 20px;
  }

  .copy-vendor-btn svg {
    color: gray;
    padding: 10px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 100px;
  }

  .copy-vendor-btn svg:hover {
    background: rgb(239 239 239 / 55%);
    transition: all .25s ease-in-out
  }
  .copy-vendor-btn svg.copy-icon:hover {
    color: #ffffff;
    background: #f5812f;
    box-shadow: 0 3px 6px #ddd;
    transition: all .15s ease-in-out
  }

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

  #dataTableContainer a {
    color: #3e89fe;
    -webkit-text-decoration: none;
    text-decoration: none;
  }

  .is-open h3:after {
    content: "↑";
    font-size: 1em;
    color: black;
    margin-left: 0.5em;
  }

  .is-closed h3:after {
    content: "↓";
    font-size: 1em;
    color: black;
    margin-left: 0.5em;
  }

  #labels {
    padding: 1em;
  }

  #labels > div,
  #labels > a,
  #labels .copy-application-link > a {
    padding: 1em;
    font-size: 1.2em;
    cursor: pointer;
    display: block;
    color: initial;
    text-decoration: none;

    display: flex;
    align-items: center;
  }
  #labels .copy-application-link > a {
    padding: 0;
  }

  #labels > div > span,
  #labels > a > span,
  #labels .copy-application-link > a > span {
    margin-left: 1em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  #labels .copy-application-link >svg.fa-link {
    position: relative;
    right: -15px;
    color: #3e89fe;
    margin-left: auto;
  }

  #application > div {
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }

  .a_settings {
    display: block !important
  }

  .a_settings .Collapsible__trigger {
    margin-left: 0 !important;
  }

  .a_settings .Collapsible__contentInner > div {
    margin-top: 1em;
    padding: 5px;
    margin-left: 2em;
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

  .save-button, .latest-button {
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

  const [selectedCustomFormHistory, setSelectedCustomFormHistory] = useState({});

  const [emergencyContacts, setEmergencyContacts] = useState([]);

  const [showApplication, setShowApplication] = useState(false);

  const [applicationFormKey, setApplicationFormKey] = useState(new Date().toISOString());

  const [view, setView] = useState("");

  const [selectedVendor, setSelectedVendor] = useState({});

  // const isLot = selectedVendor && selectedVendor.name === 'LOT® Form'

  const [selectedForm, setSelectedForm] = useState("default");


  const [renderForms, setRenderForms] = useState([]);

  const [isCopyApplicationLinkModal, setCopyApplicationLinkModal] = useState(false);

  const [currentCopyLink, setCurrentCopyLink] = useState(null);

  const [showAdminForm, setShowAdminForm] = useState(false);

  const [isNbmbaa, setIsNbmbaa] = useState(false);

  const [isSettingDefaultVendorLoading, setIsSettingDefaultVendorLoading] = useState(false);

  const [qrCode, setQrCode] = useState('');
  const [qrTargetUrl, setQrTargetUrl] = useState('');
  const [isQRCodePreviewModalVisible, setIsQRCodePreviewModalVisible] = useState(false);



  console.log('selectedVendor', selectedVendor)
  const dispatch = useDispatch();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true,
    pageStyle: `
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

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = parse(location.search);


  const { groups, auth, vendors,
    applications, loading, vendor,
    form: { formList = [], updateSubmittedForm, customApplicationHistory, formAppGroups, addForm },
    appReminders: { reminders = [] } } = useSelector(
      ({ groups, auth, vendors, vendor, applications, loading, form, appReminders }) => {
        return { groups, auth, vendors, vendor, applications, loading, form, appReminders };
      }
    );

  console.log('groups', groups)
  if (updateSubmittedForm.message === 'successfully update your application form') {
    window.location.reload()
  }

  if (
    applications.updateapplication &&
    applications.updateapplication.message == "application updated"
  ) {
    window.location.reload()
  }

  if (
    applications.archivedapplication &&
    applications.archivedapplication.message == "application archived"
  ) {
    window.location.reload()
  }

  if (
    applications.updateapplication &&
    applications.updateapplication.message == "application successfully updated"
  ) {
    window.location.reload()
  }

  const [appGroups, setAppGroups] = useState([]);
  const [exportFilename, setExportFilename] = useState("");
  const [currentForm, setCurrentForm] = useState(null);

  // const defaultVendor = vendors && vendors[0];
  useEffect(() => {
    const triggerGetQrCode = async () => {
      try {
        const response = await getPageQrCode();
        setQrCode(response?.qr_code || '');
        setQrTargetUrl(response?.target_url || '')
      } catch (err) {
        console.log('triggerGetQrCode err', err)
      }
    };

    triggerGetQrCode();
  }, []);


  useEffect(() => {
    if (auth.user_id) {
      //dispatch(requestUserGroup(auth.email));

      dispatch(requestVendor(auth.user_id));

      console.log('queryParams.form', queryParams.form)
      if (queryParams && queryParams.form) {
        dispatch(requestGetCustomApplications(queryParams.form));
      }

      if (queryParams && queryParams.opt) {
        const opt = queryParams.opt;

        if (opt === 'set-reminder') {
          handleSelectedLabel({ value: 'Set Reminder', opt: 'set-reminder' })
        } else if (opt === 'termsconditions') {
          handleSelectedLabel({ value: 'Form Settings', opt: 'termsconditions' });
        }
        else if (opt === 'logo') {
          handleSelectedLabel({ value: 'Logo', opt: 'logo' });
        }
        else {
          handleSelectedLabel({ value: 'Application Status', opt: 'applicationstatus' });
        }
      }


      const isNbmbaa = auth && auth.name && auth.name.includes('nbmbaa');
      setIsNbmbaa(isNbmbaa);
    }
  }, []);

  useEffect(() => {
    if (applications.selectedbuilderapplication) {
      setSelectedApplication(applications.selectedbuilderapplication)
    }
  }, [applications.selectedbuilderapplication])

  useEffect(() => {


    if (vendor.newVendor?.id) {
      setShowAdminForm(true);
    }

  }, [vendor.newVendor]);

  useEffect(() => {

    if (addForm.form?.id) {
      setShowAdminForm(true);
      setRenderForms([...renderForms, { ...addForm }]);
    }

  }, [addForm])

  useEffect(() => {

    if (vendors && vendors.length > 0 && vendors[0].id) {
      if (queryParams && queryParams.vendor) {
        const newDefaultVendor = vendors.filter((vendor) => {
          return vendor.id2 == queryParams.vendor
        });


        setSelectedVendor(newDefaultVendor[0]);

        if (newDefaultVendor[0] && newDefaultVendor[0]?.name.includes('LOT')) {
          setSelectedForm('lot');
        }

        if (queryParams && queryParams.form) {
          dispatch(requestGetFormAppGroup(queryParams.form));
        } else {
          setAppGroups(newDefaultVendor[0].app_groups);
        }

        //dispatch(requestGetApplications(newDefaultVendor[0].id));
        dispatch(requestGetForms({
          vendor: newDefaultVendor[0].id || '',
          currentUser: auth.user_id,
          isOwner: !!(auth.user_id == newDefaultVendor[0].user),
          categories: []
        }))

        dispatch(requestGetVendorReminders({ vendor: newDefaultVendor[0]?.id }));
      } else {

        // setSelectedVendor(vendors[0]);


        let defaultVendor = null;
        console.log('vendorzxczxczxcs',vendors)
        const hasDefaultVendor = vendors.find(item => item.is_default);


        if (auth && auth?.nickname === 'lot') {
          defaultVendor = vendors[vendors.length - 1]
          setSelectedVendor(defaultVendor);
          setSelectedForm('lot');
        }
        else if (hasDefaultVendor) {
          defaultVendor = hasDefaultVendor;
          setSelectedVendor(hasDefaultVendor);
          setAppGroups(hasDefaultVendor?.app_groups);
        }
        else {
          const hasLot = vendors.some(item => item.is_lot)
          if (hasLot) {
            defaultVendor = vendors.find(item => item.is_lot);
            setSelectedVendor(defaultVendor);
          }
          else {
            defaultVendor = vendors.find(item => !item.is_lot);
            setSelectedVendor(defaultVendor);
          }
        }

        // if(hasDefaultVendor?.default_form ) {
        //   // setSelectedForm(hasDefaultVendor?.default_form || 'default');

        // }


        // if(vendors[0] && vendors[0].name.includes('LOT')) {
        //   setSelectedForm('lot');
        // }

        if (queryParams && queryParams.form) {
          dispatch(requestGetFormAppGroup(queryParams.form));
        } else if (!hasDefaultVendor) {
          setAppGroups(defaultVendor?.app_groups);

        }
        dispatch(requestGetForms({
          vendor: defaultVendor?.id || '',
          currentUser: auth.user_id,
          isOwner: !!(auth.user_id == defaultVendor?.user),
          categories: []
        }))

        if (defaultVendor) {
          if (defaultVendor?.default_form && defaultVendor?.default_form !== 'default') {
            dispatch(requestGetCustomApplications(defaultVendor?.default_form));
          }
          else {
            dispatch(requestGetApplications(defaultVendor?.id));
          }

          dispatch(requestGetVendorReminders({ vendor: defaultVendor?.id }));
        }

      }


      //get vendors reminders


    }
  }, [vendors, queryParams?.vendor, queryParams?.form]);


  const handleRefreshApplication = () => {

    if (selectedForm !== 'default') {
      dispatch(requestGetCustomApplications(selectedForm));
    }
    else {
      dispatch(requestGetApplications(selectedVendor?.id || ''));
    }
  }

  useEffect(() => {
    //dispatch(requestGetApplications(selectedVendor.id));

    setRenderForms(formList);


    if (queryParams && queryParams.form) {
      setSelectedForm(queryParams.form);

      const tempForm = formList.filter((form) => {
        return form.form_id == queryParams.form;
      });


      if (tempForm && tempForm.length > 0) {
        setExportFilename(tempForm[0]?.form_contents?.formTitle);
        setCurrentForm(tempForm[0])
      }
      // dispatch(requestGetCustomApplications(queryParams.form));
    } else {
      setExportFilename(selectedVendor?.name);

      if(isUUID(selectedForm)) {

        const tempForm = formList.find((form) => {
          return form.form_id == selectedForm;
        });
        setCurrentForm(tempForm);
  
      }
      else {
        if (selectedVendor?.default_form && selectedVendor?.default_form !== 'default') {
          dispatch(requestGetCustomApplications(selectedVendor?.default_form || ''));
        }
        else {
          dispatch(requestGetApplications(selectedVendor?.id || ''));
        }
      }
  

    }


  }, [formList]);

  useEffect(() => {

    if (selectedVendor) {

      const isLot = (selectedVendor && selectedVendor?.name && selectedVendor.name.includes('LOT')) || (auth && auth.nickname === 'lot');
      console.log('selectedVendor', selectedVendor)

      if (selectedVendor?.default_form && selectedVendor?.default_form !== 'default') {

        setSelectedForm(selectedVendor?.default_form);
        // window.history.replaceState("", "", "?form=" + selectedVendor?.default_form);
      }
      else {
        setSelectedForm(isLot ? "lot" : 'default')
      }
    }

  }, [selectedVendor])


  useEffect(() => {
    setAppGroups(formAppGroups);
  }, [formAppGroups])


  const handleWaiverFormDetailsChange = (section, id, value) => {

    let subTermsWaiver = termsWaiver;

    if (section === "section1") {
      subTermsWaiver.section1[id] = value;
    } else if (section === "section2") {
      subTermsWaiver.section2[id] = value;
    } else if (section === "section3") {
      subTermsWaiver.section3[id] = value;
    } else {
      console.log("Invalid Section");
    }

    setTermsWaiver({ ...subTermsWaiver });
  }



  const handleSelectedLabel = ({ value, opt }) => {
    setView("");
    setSelectedLabel(value);
    setSelectNonMenuOption(false);
    setSelectedApplication({});
    window.history.replaceState("", "", "?opt=" + opt`${queryParams.vendor ? '&vendor=' + queryParams.vendor : ''}`);

  };

  const parseArrayFormat = items => {
    let newItems = [];
    if (!Array.isArray(items)) return [];

    items.forEach((item, index) => {


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
    if (view === 'builderForm') {
      setView(view)
      setSelectedApplication(application)
      // dispatch(requestGetCustomFormApplicantById(application.app_id))
      setShowApplication(true);
      dispatch(requestGetCustomApplicationHistory(application.app_id))
      return
    }
    setSelectedApplication(application);
    setSelectNonMenuOption(true);
    setView(view);
    setShowApplication(true);
    dispatch(requestGetApplicationHistory(application.app_id));

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



    const childInformationObj = {
      profile: {
        image: application?.child?.image ? application.child.image : "",
        application_date: 'Most Up to date Application',
        first_name: application?.child?.firstname
          ? application.child.firstname
          : "",
        last_name: application?.child?.lastname ? application.child.lastname : "",
        nick_name: application?.child?.nickname ? application.child.nickname : "",
        date_of_birth: application?.child?.birthdate ? new Date(application?.child?.birthdate) : '',
        gender: application?.child?.gender,
        phone_type: application?.child?.phone_type
          ? application.child.phone_type
          : "",
        phone_number: application?.child?.phone_number
          ? application.child.phone_number
          : "",
        email_type: application?.child?.email_type
          ? application.child.email_type
          : "",
        email_address: application?.child?.email_address
          ? application.child.email_address
          : "",
        address: application?.child?.address
          ? application.child.address
          : isReadonly
            ? "-"
            : "",
        city: application?.child?.city ? application.child.city : "",
        state: application?.child?.state ? application.child.state : "",
        zip_code: application?.child?.zip_code ? application.child.zip_code : "",
        location_site: application?.child?.location_site
          ? application.child.location_site
          : "",
        child_lives_with: application?.child?.child_lives_with
          ? parseArrayFormat(application.child.child_lives_with.split(","))
          : [],
        program: application?.child?.programs
          ? parseArrayFormat(application.child.programs.split(","))
          : [],
        ethinicity: application?.child?.ethnicities
          ? parseArrayFormat(application.child.ethnicities.split(","))
          : [],
        preffered_start_date: application?.child?.preffered_start_date ?
          new Date(application.child.preffered_start_date) : '',
        current_classroom: application?.child?.current_classroom ? application.child.current_classroom : "",
        primary_language: application?.child?.primary_language ? application.child.primary_language : "",
        needed_days: application?.child?.needed_days ? application.child.needed_days : "",
        schedule_tour: application?.child?.schedule_tour ? application.child.schedule_tour : "",
        voucher: application?.child?.voucher ? application.child.voucher : "",
        new_childId: application?.child?.new_childId

      },
      general_information: {
        grade: application?.child?.grade_number
          ? application.child.grade_number
          : "",
        class_rank: application?.child?.class_rank
          ? application.child.class_rank
          : "",
        gpa_quarter_year: application?.child?.gpa_quarter_year
          ? application.child.gpa_quarter_year
          : "",
        gpa_quarter_q1: application?.child?.gpa_quarter_q1
          ? application.child.gpa_quarter_q1
          : "",
        gpa_quarter_q2: application?.child?.gpa_quarter_q2
          ? application.child.gpa_quarter_q2
          : "",
        gpa_quarter_q3: application?.child?.gpa_quarter_q3
          ? application.child.gpa_quarter_q3
          : "",
        gpa_quarter_q4: application?.child?.gpa_quarter_q4
          ? application.child.gpa_quarter_q4
          : "",
        gpa_cumulative_year: application?.child?.gpa_cumulative_year
          ? application.child.gpa_cumulative_year
          : "",
        gpa_cumulative_q1: application?.child?.gpa_cumulative_q1
          ? application.child.gpa_cumulative_q1
          : "",
        gpa_cumulative_q2: application?.child?.gpa_cumulative_q2
          ? application.child.gpa_cumulative_q2
          : "",
        gpa_cumulative_q3: application?.child?.gpa_cumulative_q3
          ? application.child.gpa_cumulative_q3
          : "",
        gpa_cumulative_q4: application?.child?.gpa_cumulative_q4
          ? application.child.gpa_cumulative_q4
          : "",
        act_scores: [],
        sat_scores: [],
        psat_scores: [],
        school_name: application?.child?.school_name
          ? application.child.school_name
          : "",
        school_phone: application?.child?.school_phone
          ? application.child.school_phone
          : "",
        has_suspended: !!application?.child?.has_suspended ? 1 : 0,
        reason_suspended: application?.child?.reason_suspended,
        mentee_start_year: application?.child?.year_taken,
        hobbies: application?.child?.hobbies ? application.child.hobbies : "",
        life_events: application?.child?.life_events
          ? application.child.life_events
          : "",
        career_goals: application?.child?.career_goals
          ? application.child.career_goals
          : "",
        colleges: application?.child?.colleges ? application.child.colleges : "",
        team_affiliations: application?.child?.affiliations
          ? application.child.affiliations
          : "",
        awards: application?.child?.awards ? application.child.awards : "",
        accomplishments: application?.child?.accomplishments
          ? application.child.accomplishments
          : "",
        mentee_gain: application?.child?.mentee_gain_program
          ? application.child.mentee_gain_program
          : "",
        is_child_transferring: application?.child?.is_child_transferring
          ? application.child.is_child_transferring
          : "",
        does_child_require_physical_education_service: application?.child?.does_child_require_physical_education_service
          ? application.child.does_child_require_physical_education_service
          : "",
        history_prev_diseases: application?.child?.history_prev_diseases
          ? application.child.history_prev_diseases
          : "", //start of questions
        child_currently_doctors_care: application?.child?.child_currently_doctors_care
          ? application.child.child_currently_doctors_care
          : "",
        reasons_previous_hospitalizations: application?.child?.reasons_previous_hospitalizations
          ? application.child.reasons_previous_hospitalizations
          : "",
        comments_suggestion: application?.child?.comments_suggestion
          ? application.child.comments_suggestion
          : "",
        list_special_dietary: application?.child?.list_special_dietary
          ? application.child.list_special_dietary
          : "",
        list_any_allergies: application?.child?.list_any_allergies
          ? application.child.list_any_allergies
          : "",
        mental_physical_disabilities: application?.child?.mental_physical_disabilities
          ? application.child.mental_physical_disabilities
          : "",
        medical_action_plan: application?.child?.medical_action_plan
          ? application.child.medical_action_plan
          : "",
        list_fears_unique_behavior: application?.child?.list_fears_unique_behavior
          ? application.child.list_fears_unique_behavior
          : "",
        transfer_reason: application?.child?.transfer_reason
          ? application.child.transfer_reason
          : "",
        prev_school_phone: application?.child?.prev_school_phone
          ? application.child.prev_school_phone
          : "",
        prev_school_city: application?.child?.prev_school_city
          ? application.child.prev_school_city
          : "",
        prev_school_address: application?.child?.prev_school_address
          ? application.child.prev_school_address
          : "",
        prev_school_attended: application?.child?.prev_school_attended
          ? application.child.prev_school_attended
          : "",
        prev_school_state: application?.child?.prev_school_state
          ? application.child.prev_school_state
          : "",
        prev_school_zip_code: application?.child?.prev_school_zip_code
          ? application.child.prev_school_zip_code
          : "",
        is_entrepreneur: application?.child?.is_entrepreneur
          ? application.child.is_entrepreneur
          : 0,
        include_in_directory: application?.child?.include_in_directory
          ? application.child.include_in_directory
          : "",
        business_name: application?.child?.business_name
          ? application.child.business_name
          : "",
        business_website: application?.child?.business_website
          ? application.child.business_website
          : "",
        business_phone: application?.child?.business_phone
          ? application.child.business_phone
          : "",
        business_email: application?.child?.business_email
          ? application.child.business_email
          : "",
        business_industry: application?.child?.business_industry
          ? application.child.business_industry
          : "",
        business_address: application?.child?.business_address
          ? application.child.business_address
          : "",
        business_description: application?.child?.business_description
          ? application.child.business_description
          : "",
        employment_status: application?.child?.employment_status
          ? application.child.employment_status
          : "",
        allergies_to_medicine: application?.child?.allergies_to_medicine
          ? application.child.allergies_to_medicine
          : "",
        food_allergies: application?.child?.food_allergies
          ? application.child.food_allergies
          : "",
        insect_allergies: application?.child?.insect_allergies
          ? application.child.insect_allergies
          : "",
        other_allergies: application?.child?.other_allergies
          ? application.child.other_allergies
          : "",
        current_medications: application?.child?.current_medications
          ? application.child.current_medications
          : "",
        health_insurance_information: application?.child?.health_insurance_information
          ? application.child.health_insurance_information
          : "",
      },
      emergency_care_information: {
        doctor_name: application?.child?.doctor_name
          ? application.child.doctor_name
          : "",
        doctor_phone: application?.child?.doctor_phone
          ? application.child.doctor_phone
          : "",
        hospital_preference: application?.child?.hospital_preference
          ? application.child.hospital_preference
          : "",
        hospital_phone: application?.child?.hospital_phone
          ? application.child.hospital_phone
          : ""
      },
      ch_id: application?.child?.ch_id,
      id: application?.child?.ch_id
    };

    const parents = application.parents;

    let items = [];
    for (const parent of parents) {
      const profile = {
        image: parent.image ? parent.image : "",
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
        person_recommend: parent.person_recommend ? parent.person_recommend : "",
        ethinicity: parent?.ethnicities
          ? parseArrayFormat(parent.ethnicities.split(","))
          : [],
        gender: parent?.gender,
        date_of_birth: parent.birthdate ? new Date(parent.birthdate) : null
      };

      items.push({ profile: profile, id: parent.parent_id, parent_id: parent.parent_id });

    }

    if (application.emergency_contacts) {
      setEmergencyContacts(JSON.parse(application.emergency_contacts));
    } else {
      setEmergencyContacts(emergency_contacts);
    }

    setChildInformation(childInformationObj);

    setParentsInformation(items);

    setUpdateApplication({ ...temp });

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
    };

    setTermsWaiver(termsWaiver);
  };

  const [chRelationships, setChRelationships] = useState([]);

  const [relationships, setRelationships] = useState([]);

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
        birthdate: format(
          new Date(parent.profile.date_of_birth),
          DATE_FORMAT),
        gender: parent.profile.gender,
        age: getAge(parent.profile.date_of_birth),
        ethnicities: getArrayValue(parent.profile.ethinicity),
        parent_id: parent.parent_id,
        image: parent.profile.image || '',
      });
    });

    return parents;
  };

  const onSubmit = () => {
    if (view === 'builderForm' && selectedApplication) {
      dispatch(requestUpdateSubmittedForm({
        updated_by: auth.email,
        vendor: selectedApplication.vendor,
        form: selectedApplication.form,
        app_id: selectedApplication.app_id,
        form_contents: selectedApplication.form_contents,
        class_teacher: updateApplication.class_teacher || selectedApplication?.class_teacher,
        color_designation: updateApplication.color_designation || selectedApplication?.color_designation,
        verification: updateApplication.verification || selectedApplication?.verification,
        student_status: updateApplication.student_status || selectedApplication?.student_status,
        notes: updateApplication.notes || selectedApplication?.notes
      }))
    }

    let payload = { ...updateApplication };
    payload.received_reminder = selectedApplication.received_reminder;

    dispatch(requestUpdateApplication(payload));
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

  const DATE_TIME_FORMAT = "MM/dd/yyyy hh:mm:ss";
  const DATE_FORMAT = "yyyy-MM-dd";

  const onSubmitSaveApplication = () => {

    let payload = {
      app_id: selectedApplication.app_id,
      child: {
        new_childId: childInformation?.profile?.new_childId,
        firstname: childInformation.profile.first_name,
        lastname: childInformation.profile.last_name,
        age: getAge(childInformation.profile.date_of_birth),
        birthdate: format(
          new Date(childInformation.profile.date_of_birth),
          DATE_FORMAT
        ),
        image: childInformation.profile.image || '',
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
        preffered_start_date: childInformation.preffered_start_date ? format(
          new Date(childInformation.profile.preffered_start_date),
          DATE_FORMAT) : null,
        current_classroom: childInformation.profile.current_classroom,
        primary_language: childInformation.profile.primary_language,
        needed_days: childInformation.profile.needed_days,
        schedule_tour: childInformation.profile.schedule_tour,
        voucher: childInformation.profile.voucher,
        ch_id: childInformation.ch_id,
        is_entrepreneur: childInformation.general_information.is_entrepreneur,
        include_in_directory: childInformation.general_information.include_in_directory,
        business_name: childInformation.general_information.business_name,
        business_website: childInformation.general_information.business_website,
        business_phone: childInformation.general_information.business_phone,
        business_email: childInformation.general_information.business_email,
        business_industry: childInformation.general_information.business_industry,
        business_address: childInformation.general_information.business_address,
        business_description: childInformation.general_information.business_description,
        employment_status: childInformation.general_information.employment_status,
        allergies_to_medicine: childInformation.general_information.allergies_to_medicine,
        food_allergies: childInformation.general_information.food_allergies,
        insect_allergies: childInformation.general_information.insect_allergies,
        other_allergies: childInformation.general_information.other_allergies,
        current_medications: childInformation.general_information.current_medications,
        health_insurance_information: childInformation.general_information.health_insurance_information,
      },
      parents: setupParentsList(),
      emergency_contacts: JSON.stringify(emergencyContacts),
      section1_signature: termsWaiver?.section1?.signature,
      section1_date_signed: format(new Date(selectedApplication.section1_date_signed), "yyyy-MM-dd hh:mm:ss"),
      section2_signature: termsWaiver?.section2?.signature,
      section2_date_signed: format(new Date(selectedApplication.section2_date_signed), "yyyy-MM-dd hh:mm:ss"),
      section3_signature: termsWaiver?.section3?.signature,
      section3_date_signed: format(new Date(selectedApplication.section3_date_signed), "yyyy-MM-dd hh:mm:ss"),


      section1_text: selectedApplication.section1_text,
      section2_text: selectedApplication.section2_text,
      section3_text: selectedApplication.section3_text,
      section1_name: selectedApplication.section1_name,
      section2_name: selectedApplication.section2_name,
      section3_name: selectedApplication.section3_name,
      updated_by: auth.name
    };


    // const termsWaiver = {
    //   date: new Date().toString(),
    //   section1: {
    //     checked: !!application.section1_signature,
    //     signature: application.section1_signature
    //   },
    //   section2: {
    //     checked: !!application.section2_signature,
    //     signature: application.section2_signature
    //   },
    //   section3: {
    //     checked: !!application.section3_signature,
    //     signature: application.section3_signature
    //   }
    // }


    payload = {
      ...payload,
      relationships: relationships
    };
    console.log("childInformation Submit update application", payload);

    dispatch(requestSaveApplication(payload));
  };

  const [childInformation, setChildInformation] = useState({});

  const [parentsInformation, setParentsInformation] = useState([]);

  const [isFormHistory, setIsFormHistory] = useState(false);

  const termsWaiverObj = {
    date: new Date().toString(),
    section1: {
      checked: false,
      signature: selectedApplication?.section1_signature
    },
    section2: {
      checked: false,
      signature: selectedApplication?.section2_signature
    },
    section3: {
      checked: false,
      signature: selectedApplication?.section3_signature
    }
  };


  const [termsWaiver, setTermsWaiver] = useState({ ...termsWaiverObj });

  const handleChildFormDetailsChange = (index, section, id, value) => {
    let child = childInformation;
    let profile = child.profile;
    let general_information = child.general_information;
    let emergency_care_information = child.emergency_care_information;

    if (section === "profile") {
      if (id == "child_lives_with") {

        profile.child_lives_with = value;
      } else {
        profile = { ...profile, [id]: value };
      }

      child.profile = profile;
    } else if (section === "general_information") {
      if (id === "has_suspended") {

        if (value == "0") {
          general_information = {
            ...general_information,
            ["reason_suspended"]: "",
          };
        }
        // general_information = {
        //   ...general_information,
        //   has_suspended: value == "Yes" || value == "1" ? 1 : 0,
        // };

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


  };

  const handleSelectLatest = () => {
    setIsFormHistory(false);
    setApplicationFormKey(new Date().toISOString());
    handleSelectedApplication(selectedApplication, "application");
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
          setApplicationFormKey(new Date().toISOString());
          const application = JSON.parse(row.details);
          const childInformationObj = {
            profile: {
              image: application.child.image ? application.child.image : "",
              application_date: `History Update: ${format(new Date(row.updated_at ? row.updated_at : ""), "LLL dd, yyyy p")}`,
              first_name: application.child.firstname ? application.child.firstname : "",
              last_name: application.child.lastname ? application.child.lastname : "",
              nick_name: application.child.nickname ? application.child.nickname : "",
              date_of_birth: new Date(application.child.birthdate),
              gender: application.child.gender,
              phone_type: application.child.phone_type ? application.child.phone_type : "",
              phone_number: application.child.phone_number ? application.child.phone_number : "",
              email_type: application.child.email_type ? application.child.email_type : "",
              email_address: application.child.email_address ? application.child.email_address : "",
              phone_type2: application.child.phone_type2 ? application.child.phone_type2 : "",
              phone_number2: application.child.phone_number2 ? application.child.phone_number2 : "",
              email_type2: application.child.email_type2 ? application.child.email_type2 : "",
              email_address2: application.child.email_address2 ? application.child.email_address2 : "",
              address: application.child.address ? application.child.address : "",
              city: application.child.city ? application.child.city : "",
              state: application.child.state ? application.child.state : "",
              zip_code: application.child.zip_code ? application.child.zip_code : "",
              location_site: application.child.location_site ? application.child.location_site : "",
              child_lives_with: application.child.child_lives_with ? parseArrayFormat(application.child.child_lives_with.split(",")) : [],
              program: application.child.programs ? parseArrayFormat(application.child.programs.split(",")) : [],
              ethinicity: application.child.ethnicities ? parseArrayFormat(application.child.ethnicities.split(",")) : [],
              nick_name: application.child.nickname ? application.child.nickname : "",
              preffered_start_date: new Date(application.child.preffered_start_date),
              current_classroom: application.child.current_classroom ? application.child.current_classroom : "",
              primary_language: application.child.primary_language ? application.child.primary_language : "",
              needed_days: application.child.needed_days ? application.child.needed_days : "",
              schedule_tour: application.child.schedule_tour ? application.child.schedule_tour : "",
              voucher: application.child.voucher ? application.child.voucher : ""
            },
            general_information: {
              grade: application.child.grade_number ? application.child.grade_number : "",
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
              //  has_suspended: application.child.has_suspended + "",
              has_suspended: application.child.has_suspended,
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
                : "",
              is_entrepreneur: application?.child?.is_entrepreneur
                ? application.child.is_entrepreneur
                : 0,
              include_in_directory: application?.child?.include_in_directory
                ? application.child.include_in_directory
                : "",
              business_name: application?.child?.business_name
                ? application.child.business_name
                : "",
              business_website: application?.child?.business_website
                ? application.child.business_website
                : "",
              business_phone: application?.child?.business_phone
                ? application.child.business_phone
                : "",
              business_email: application?.child?.business_email
                ? application.child.business_email
                : "",
              business_industry: application?.child?.business_industry
                ? application.child.business_industry
                : "",
              business_address: application?.child?.business_address
                ? application.child.business_address
                : "",
              business_description: application?.child?.business_description
                ? application.child.business_description
                : "",
              employment_status: application?.child?.employment_status
                ? application.child.employment_status
                : "",
              allergies_to_medicine: application?.child?.allergies_to_medicine
                ? application.child.allergies_to_medicine
                : "",
              food_allergies: application?.child?.food_allergies
                ? application.child.food_allergies
                : "",
              insect_allergies: application?.child?.insect_allergies
                ? application.child.insect_allergies
                : "",
              other_allergies: application?.child?.other_allergies
                ? application.child.other_allergies
                : "",
              current_medications: application?.child?.current_medications
                ? application.child.current_medications
                : "",
              health_insurance_information: application?.child?.health_insurance_information
                ? application.child.health_insurance_information
                : "",
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
          for (const parent of parents) {
            const profile = {
              image: parent.image ? parent.image : "",
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
              address: parent.address ? parent.address : application.child?.address,
              city: parent.city ? parent.city : application.child?.city,
              state: parent.state ? parent.state : application.child?.state,
              zip_code: parent.zip_code ? parent.zip_code : application.child?.zip_code,
              occupation: parent.occupation ? parent.occupation : "",
              employer_name: parent.employer_name ? parent.employer_name : "",
              goals_parent_program: parent.parent_goals ? parent.parent_goals : "",
              goals_child_program: parent.parent_child_goals ? parent.parent_child_goals : "",
              live_area: parent.live_area ? parent.live_area : 0, // 1: 1 - 5 year, 2: 5 - 10 year, 3: more than 10 year
              level_education: parent.level_of_education ? parent.level_of_education : "",
              child_importance_hs: parent.child_hs_grad ? parent.child_hs_grad : "",
              child_importance_col: parent.child_col_grad ? parent.child_col_grad : "",
              person_recommend: parent.person_recommend ? parent.person_recommend : "",
              ethinicity: parent?.ethnicities
                ? parseArrayFormat(parent.ethnicities.split(","))
                : [],
              gender: parent?.gender,
              date_of_birth: new Date(parent?.birthdate)
            }

            items.push({ profile: profile, parent_id: parent.parent_id });
          }

          setChildInformation(childInformationObj);
          setParentsInformation(items);
          setIsFormHistory(true);
          setIsReadonly(true);

          if (application.emergency_contacts) {
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

  const paginationRowsPerPageOptions = [10, 25, 50, 100];
  const paginationComponentOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
    noRowsPerPage: false,
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All'
  }

  const columnsAppHistory = [
    {
      name: 'Updated At',
      selector: 'status',
      sortable: true,
      cell: row => format(new Date(row.updated_at), "LLL dd, yyyy p")
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


  // const handleSetDefaultVendor = () => {
  //   if (!isSettingDefaultVendorLoading) {
  //     setIsSettingDefaultVendorLoading(true);
  //     console.log('Handle Set Default Vendor', {
  //       user_id: auth?.user_id,
  //       vendor_id: selectedVendor?.id
  //     })
  //     dispatch(setDefaultVendor({
  //       user_id: auth?.user_id,
  //       vendor_id: selectedVendor?.id
  //     }));

  //     setTimeout(() => {
  //       setIsSettingDefaultVendorLoading(false);
  //     }, 1500)
  //   }

  // }


  const handleSetDefaultForm = () => {
    console.log('selectedFormmmm', selectedForm)
    if (!isSettingDefaultVendorLoading) {
      setIsSettingDefaultVendorLoading(true);

      dispatch(setDefaultVendorForms({
        form_id: selectedForm,
        vendor_id: selectedVendor?.id
      }));

      setTimeout(() => {
        setIsSettingDefaultVendorLoading(false);
      }, 1500)
    }

  }

  const handleParentChildRelationship = (parent, child, relationship) => {

    let exists = false;


    for (const [index, item] of relationships.entries()) {
      if (item.parent == parent && item.child == child) {
        let tempRelationships = relationships;
        tempRelationships[index].parent = parent;
        tempRelationships[index].child = child;
        tempRelationships[index].relationship = relationship;

        exists = true;

        setRelationships([...tempRelationships]);
        break;
      }
    }

    if (!exists) {

      setRelationships([...relationships, {
        parent: parent,
        child: child,
        relationship: relationship
      }])
    }
  }



  const handleCreateGroupReminder = (payload) => {
    dispatch(requestCreateGroupReminder(payload));
  }

  const reminderCols = [
    {
      name: "Form",
      selector: "Form",
      sortable: false,
      cell: row => row.form_name
    },
    {
      name: "Group",
      selector: "Class",
      sortable: false,
      cell: row => getAppGroupNames(row)
    },
    {
      name: "Date to be send",
      selector: "Date",
      sortable: false,
      cell: row => format(new Date(row.date_reminder), "LLL dd, yyyy")
    },
    {
      name: "Status",
      selector: "Status",
      sortable: false,
      cell: row => row.active ? 'Active' : 'Inactive'
    }
  ]

  const getAppGroupNames = (reminder) => {
    if (reminder && reminder.app_groups) {
      let formattedNames = '';

      reminder.app_groups.map((r) => {
        formattedNames += r.name + ' , ';
      });

      formattedNames = formattedNames.slice(0, -1);

      return formattedNames.slice(0, -1);
    } else {
      return '';
    }
  }
  let index = 2;

  const handleCheckVendorNameDuplicate = (name) => {

    const isExists = vendors.filter(v => v.name == name)[0];

    if (!!isExists) {
      if (index > 2) {
        let names = name.split(' ');
        names[names.length - 1] = `(${index})`;
        name = names.join(' ');
      } else {
        name = `${name} (${index})`
      }
      index++;
      return handleCheckVendorNameDuplicate(name);
    } else {
      index = 2;
      return name;
    }
  }


  const handleDuplicateVendor = () => {

    if (selectedForm == "default" || selectedForm == "lot") {

      let newName = `${selectedVendor?.name} Copy`;
      newName = handleCheckVendorNameDuplicate(newName);
      const payload = {
        user: auth.user_id,
        name: newName,
        section1_text: selectedVendor.section1_text,
        section2_text: selectedVendor.section2_text,
        section3_text: selectedVendor.section3_text,
        section1_name: selectedVendor.section1_name,
        section2_name: selectedVendor.section2_name,
        section3_name: selectedVendor.section3_name,
        section1_show: selectedVendor.section1_show,
        section2_show: selectedVendor.section2_show,
        section3_show: selectedVendor.section3_show,
        logo: selectedVendor.logo,
        is_daycare: selectedForm == "lot" ? 2 : selectedVendor.is_daycare,
      }


      dispatch(requestCreateVendor(payload));
    } else {
      let selectedFormDetails = renderForms.filter(f => f.form_id == selectedForm)[0];

      if (!!selectedFormDetails) {
        const payload = {
          category: selectedFormDetails.category,
          form_contents: { ...selectedFormDetails.form_contents, ['formTitle']: selectedFormDetails.form_contents.formTitle + ' (Copy) ' },
          user: auth.user_id,
          vendor: selectedFormDetails.vendor
        }


        dispatch(requestAddForm(payload));
      }

    }

  }


  const handleGetForms = value => {

    if (value == "default" || value === 'lot') {

      setSelectedForm(value);
      setAppGroups(selectedVendor.app_groups);
      window.history.replaceState("", "", "?vendor=" + selectedVendor?.id2);
      // if (applications.activeapplications.length === 0) {
      //   dispatch(requestGetApplications(selectedVendor.id));
      // }
      dispatch(requestGetApplications(selectedVendor.id));

    } else {
      setSelectedForm(value);
      if (view === 'builderForm') {
        setView('')
        setSelectedApplication({})
      }

      const currentForms1 = renderForms.find(item => item.form_id === value)

      window.history.replaceState("", "", "?form=" + value + `${queryParams?.vendor ? `&vendor=${queryParams.vendor}` : ''}`);
      setAppGroups([]);
      setCurrentForm(currentForms1)
      dispatch(requestGetFormAppGroup(value));
      dispatch(requestGetCustomApplications(value));
    }
  }

  // .sort((a, b) => a.name.localeCompare(b.name)
  let vendorOptions = vendors && vendors.length > 0 ? vendors : [];
  let formOptions = renderForms && renderForms.length > 0 ? renderForms.sort((a, b) => a.form_contents?.formTitle?.localeCompare(b.form_contents?.formTitle)) : [];
  console.log('vendors', vendors)

  console.log('applications',applications)
  return (
    <ApplicationStyled>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2>Applications</h2>
        {vendorOptions && vendorOptions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'columns' }}>
            <select
              disabled={true}
              className="custom-default-select"
              style={{
                "marginLeft": "20px",
                "fontSize": "1.5em",
                "borderRadius": "0",
                "cursor": "pointer",
                "width": "100%",
                "display": "block",
                "background": "transparent",
                "border": "0",
                "padding": "0",
                // "lineHeight": "0",
                "color": "#000000"
              }}
              onChange={({ target }) => {


                const chosenVendor = vendors.filter((vendor) => {
                  return vendor.id == target.value
                });


                window.history.replaceState("", "", "?vendor=" + chosenVendor[0].id2);

                //dispatch(requestGetApplications(target.value));
                dispatch(requestGetForms({
                  vendor: target.value,
                  currentUser: auth.user_id,
                  isOwner: !!(auth.user_id == chosenVendor[0].user),
                  categories: []
                }))
                if (chosenVendor && chosenVendor.length > 0) {
                  setSelectedVendor(chosenVendor[0]);
                  setAppGroups(chosenVendor[0].app_groups);
                  requestSelectedVendor(chosenVendor[0]);

                }
              }}
              value={selectedVendor?.id}
            >
              {vendorOptions.map(vendor => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>

          </div>
        )}

        {
          vendors && vendors.length > 0 && (
            <div style={{
              marginLeft: 12,
              display: 'flex',
              flexDirection: 'columns'
            }}>
              <select
                disabled={loading.application}
                style={{
                  "marginLeft": "20px",
                  "fontSize": "1.5em",
                  "borderRadius": "0",
                  "cursor": "pointer",
                  "width": "400px",
                  "display": "block",
                  "background": "transparent",
                  "border": "0",
                  "padding": "0",
                  "lineHeight": "0",
                  "color": "#000000",

                }}
                value={selectedForm}
                onChange={({ target }) => {
                  handleGetForms(target.value);

                  // if (target.value == "default" || target.value === 'lot') {

                  //   setSelectedForm(target.value);
                  //   setAppGroups(selectedVendor.app_groups);
                  //   window.history.replaceState("", "", "?vendor=" + selectedVendor?.id2);
                  //   // if (applications.activeapplications.length === 0) {
                  //   //   dispatch(requestGetApplications(selectedVendor.id));
                  //   // }
                  //   dispatch(requestGetApplications(selectedVendor.id));

                  // } else {
                  //   setSelectedForm(target.value);
                  //   if (view === 'builderForm') {
                  //     setView('')
                  //     setSelectedApplication({})
                  //   }

                  //   window.history.replaceState("", "", "?form=" + target.value);
                  //   setAppGroups([]);
                  //   dispatch(requestGetFormAppGroup(target.value));
                  //   dispatch(requestGetCustomApplications(target.value));
                  // }
                }}
              >
                {(((selectedVendor && selectedVendor.name && !selectedVendor.name.includes('LOT')) && (auth && auth.nickname !== 'lot'))) && <option key={`${selectedVendor.id}-1`} selected={!(queryParams && queryParams.form)} value="default">
                  {selectedVendor.is_daycare && selectedVendor.is_daycare !== 2 ? `Daycare Form` : `Mentoring Application`}
                </option>}
                {((selectedVendor && selectedVendor.name && selectedVendor.name.includes('LOT')) || (auth && auth.nickname === 'lot')) && <option key={`${selectedVendor.id}-2`} selected={selectedForm === 'lot'} value="lot">
                  LOT® Form
                </option>}

                {
                  ((selectedVendor /* && selectedForm !== 'lot' */) && formOptions && formOptions.length > 0) && (
                    formOptions.map(form => (
                      <option selected={queryParams && queryParams.form && queryParams.form == form.form_id} key={form.form_id} value={form?.form_id}>
                        {form?.form_contents?.formTitle}
                      </option>
                    ))
                  )
                }
              </select>
              <span
                onClick={handleSetDefaultForm}
                style={{ color: 'blue', cursor: 'pointer', marginTop: 4 }}

              >
                {isSettingDefaultVendorLoading ? 'Setting as Default...' : 'Set as default'}
              </span>
            </div>
          )
        }
        {selectedVendor ? <div style={{ marginLeft: 12, marginTop: 12 }}>
          <ImportExportApplication
            form={currentForm}
            formType={selectedForm !== "default" && selectedForm !== "lot" ? 'custom' : 'mentoring'}
            vendor={selectedVendor?.id}
            isLot={selectedForm === 'lot'}
            createProfileFeature={true}
            selectedApplications={applications.activeapplications}
            refreshData={() => {
              handleGetForms(selectedForm)
            }}
          />
        </div> : <span />}
        {
          vendors && vendors.length > 0 && isNbmbaa ? (
            <div className="copy-vendor-btn">
              <FontAwesomeIcon
                className="copy-icon"
                icon={faCopy}
                onClick={e => {
                  e.stopPropagation()

                  handleDuplicateVendor();
                }}
              />
            </div>
          ) : null
        }

        {`  `}
        {ASSESSMENT_FORM_IDS.includes(selectedForm) && <button
          id="qrCodeButton"
          onClick={() => {
            setIsQRCodePreviewModalVisible(true)
          }}
        >
          View QR Code
        </button>}



        {isQRCodePreviewModalVisible && (ASSESSMENT_FORM_IDS.includes(selectedForm)) && <QRCodePReviewModal
          isImagePreviewModalVisible={isQRCodePreviewModalVisible}
          setIsImagePreviewModalVisible={setIsQRCodePreviewModalVisible}
          qrCodeUrl={qrCode}
          targetUrl={qrTargetUrl}

        />}
      </div>

      <div id="application">
        <div>
          <div id="labels">
            {
              selectedVendor && selectedVendor.id2 && (selectedForm == "default" || selectedForm == "lot") ? (
                <div className="copy-application-link">
                  <a
                    href={selectedVendor.is_daycare && selectedVendor.is_daycare !== 2 && selectedForm !== 'lot' ? `/application/${selectedVendor?.id2
                      }/daycare` : `/application/${selectedVendor?.id2
                      }${selectedForm === 'lot' ? '/lot' : ''}`}>
                    <FontAwesomeIcon icon={faFileSignature} />
                    <span>Application</span>
                  </a>
                  <FontAwesomeIcon icon={faLink} onClick={() => {
                    setCopyApplicationLinkModal(true)
                    setCurrentCopyLink(selectedVendor.is_daycare && selectedVendor.is_daycare !== 2 && selectedForm !== 'lot' ? `/application/${selectedVendor?.id2
                      }/daycare` : `/application/${selectedVendor?.id2
                      }${selectedForm === 'lot' ? '/lot' : ''}`)
                  }} />
                </div>
              ) : selectedForm && selectedForm != "default" && selectedForm != "lot" ? (
                <div className="copy-application-link">
                  <a
                    href={`/form/${selectedForm}`}
                  >
                    <FontAwesomeIcon icon={faFileSignature} />
                    <span>Application</span>
                  </a>

                  <FontAwesomeIcon icon={faLink} onClick={() => {
                    setCopyApplicationLinkModal(true)
                    setCurrentCopyLink(`/form/${selectedForm}`)
                  }} />
                </div>
              ) : (
                <div className="copy-application-link">
                  <a

                  >
                    <FontAwesomeIcon icon={faFileSignature} />
                    <span>Application</span>
                  </a>
                  <FontAwesomeIcon icon={faLink} onClick={() => {
                    setCopyApplicationLinkModal(true)
                  }} />
                </div>
              )
            }
            <CopyApplicationLinkModal
              isVisible={isCopyApplicationLinkModal}
              toggleCopyApplicationLinkModal={setCopyApplicationLinkModal}
              currentCopyLink={currentCopyLink}
            />
            <div
              className={`${selectedLabel === "Application Status" ? "selected" : ""
                }`}
              onClick={() => {
                handleSelectedLabel({ value: "Application Status", opt: 'applicationstatus' });
              }}>
              <FontAwesomeIcon icon={faThList} />
              <span>Application Status</span>
            </div>
            <Collapsible
              className="a_settings"

              openedClassName="a_settings"

              trigger={
                <div>
                  <FontAwesomeIcon icon={faCogs} />
                  <span style={{ "marginLeft": "1em" }}>Application Settings</span>
                </div>
              }
              lazyRender
              open
            >
              <div
                className={`${selectedLabel === "Form Settings" ? "selected" : ""
                  }`}
                onClick={() => {
                  handleSelectedLabel({ value: "Form Settings", opt: 'termsconditions' });
                }}
              >
                Terms and Conditions
              </div>
              <div
                className={`${selectedLabel === "Set Reminder" ? "selected" : ""
                  }`}
                onClick={() => {
                  handleSelectedLabel({ value: "Set Reminder", opt: 'set-reminder' });
                }}
              >
                Set Reminder
              </div>
              <div
                className={`${selectedLabel === "Logo" ? "selected" : ""
                  }`}
                onClick={() => {
                  handleSelectedLabel({ value: "Logo", opt: 'logo' });
                }}
              >
                Logo
              </div>
            </Collapsible>

            {/* <div
              // className={`${
              //   selectedLabel === "Form Settings" ? "selected" : ""
              // }`}
              // onClick={() => {
              //   handleSelectedLabel("Form Settings");
              // }}
              >
   
            </div> */}

            <a href={`/dashboard/audittrail`}>
              <FontAwesomeIcon icon={faHistory} />
              <span>Audit Trail</span>
            </a>

            <a href={`/dashboard/bccalendar`}>
              <FontAwesomeIcon icon={faCalendar} />
              <span>Calendar</span>
            </a>

            <a href={`/dashboard/myapplication`}>
              <FontAwesomeIcon icon={faFile} />
              <span>My Application</span>
            </a>

            <a href={`/dashboard/forms?vendor=${selectedVendor?.id2}`}>
              <FontAwesomeIcon icon={faFileAlt} />
              <span>Forms</span>
            </a>
          </div>
        </div>
        <div>
          {selectedLabel === "Application Status" && !selectNonMenuOption && view !== 'builderForm' && (
            selectedVendor && (selectedVendor.id === DEFAULT_VENDOR) ? <DefaultVendorSummaryStyled
              appGroups={selectedVendor?.app_groups}
              vendor={selectedVendor}
              form={selectedForm}
              isForm={selectedForm !== "default"}
              vendors={vendors}
            /> :
              <ApplicationSummaryStyled
                appGroups={appGroups}
                applications={applications.activeapplications}
                vendor={selectedVendor}
                form={selectedForm}
                isForm={selectedForm !== "default"}
              />
          )}
          {selectedLabel === "Form Settings" && !selectNonMenuOption && (
            <ApplicationSettingsStyled
              vendor={selectedVendor}
              formSettingsLoading={loading.form_settings}
            />
          )}
          {selectedLabel === "Set Reminder" && !selectNonMenuOption && (
            <ReminderSettingsStyled
              vendor={selectedVendor}
              appGroups={appGroups}
              formList={renderForms}
              reminderList={reminders}
              handleCreateGroupReminder={handleCreateGroupReminder}
              isLot={selectedForm === 'lot'}
            />
          )}
          {selectedLabel === "Logo" && !selectNonMenuOption && (
            <Logo
              formSettingsLoading={loading.form_settings}
              vendor={selectedVendor}
            />
          )}
          {(selectNonMenuOption && view == "application" || view === 'builderForm') && (
            <div>
              <span className="back-btn" style={{
                cursor: 'pointer',
                margin: 12,
                float: 'left',
                color: '#3e89fe'
              }} onClick={() => {
                handleSelectedLabel({ value: "Application Status", opt: 'applicationstatus' });
              }}>
                <FontAwesomeIcon className="back-icon" icon={faAngleLeft} />{`  `}
                Back
              </span>
              <EditApplicationStyled
                application={selectedApplication}
                updateApplication={updateApplication}
                vendor={selectedVendor}
                appGroups={appGroups}
                onSubmit={onSubmit}
                handleUpdateOnchange={handleUpdateOnchange}
                updateLoading={loading.application}
              />
            </div>
          )}
        </div>
      </div>
      {selectedLabel === "Application Status" && !selectNonMenuOption && view !== 'builderForm' && (
        <ApplicationListStyled
          // applications={applications.activeapplications}
          applications={applications?.activeapplications ? applications.activeapplications.filter(item => {
            return selectedForm === "lot" ? item.is_lot : !item.is_lot
          }) : []}
          handleSelectedApplication={(row, viewType) => handleSelectedApplication(row, selectedForm === "default" || selectedForm === "lot" ? viewType : 'builderForm')}
          listApplicationLoading={loading.application}
          vendor={selectedVendor}
          appGroups={appGroups}
          isCustomForm={selectedForm !== "default" && selectedForm !== "lot"}
          isLot={selectedForm === 'lot'}
          filename={exportFilename}
          handleRefreshApplication={handleRefreshApplication}
        />
      )}
      {
        selectedLabel === "Set Reminder" && (
          <DataTable
            columns={reminderCols}
            data={reminders}
            pagination
            selectableRows={false}
            noHeader={true}
            striped={true}
            customStyles={customStyles}
            subHeader
            paginationRowsPerPageOptions={paginationRowsPerPageOptions}
            paginationComponentOptions={paginationComponentOptions}
            onSelectedRowsChange={() => { }}
          />
        )
      }
      {
        (showApplication && (["application", "builderForm"].includes(view))) && (
          <div>
            <div style={{
              marginTop: 12
            }}>
              <span className="back-btn" style={{
                cursor: 'pointer',
                // margin: 12,
                // float: 'left',
                color: '#3e89fe'
              }} onClick={() => {
                handleSelectedLabel({ value: "Application Status", opt: 'applicationstatus' });
              }}>
                <FontAwesomeIcon className="back-icon" icon={faAngleLeft} />{`  `}
                Back
              </span>
            </div>
            <Collapsible trigger={<h3>Application History</h3>} open lazyRender>
              <div id="dataTableContainer">
                {
                  (
                    <DataTable
                      columns={columnsAppHistory}
                      data={view === 'application' ? applications.applicationHistory : customApplicationHistory}
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
          </div>
        )
      }

      {
        view === 'builderForm' && (
          loading.updateForm ? (
            <Loading />
          ) : (
            <Form
              editMode={true}
              baseFormData={currentForm?.form_contents}
              historyList={customApplicationHistory}
              key={applicationFormKey}
              {...(isFormHistory ? selectedCustomFormHistory : selectedApplication)}
              application_date={
                isFormHistory
                  ? `History Update: ${format(new Date(selectedCustomFormHistory.updated_at ? selectedCustomFormHistory.updated_at : ""), "LLL dd, yyyy p")}`
                  : 'Most Up to date Application'
              }
              isReadOnly={isReadonly}
              isFormHistory={isFormHistory}
              onChangeToEdit={handleChangeToEdit}
              onGetUpdatedApplication={(form_contents) => {

                setSelectedApplication({
                  ...selectedApplication,
                  form_contents
                })
              }}
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
          )
        )
      }
      {!loading.application && selectNonMenuOption && view == "application" && (
        <button type="button" className="print-button" onClick={handlePrint}>
          {" "}
          <FontAwesomeIcon icon={faPrint} />
        </button>
      )}
      {(loading.application) ? (
        <Loading />
      ) : (
        <>

          <ApplicationFormStyled
            key={applicationFormKey}
            className="print-container"
            ref={componentRef}
            autoComplete="off"
            onSubmit={handleSubmit(onSubmitSaveApplication)}>
            {selectNonMenuOption &&
              view == "application" &&
              selectedApplication &&
              !selectedApplication.is_daycare ? (
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
                handleSelectLatestApplication={handleSelectLatest}
                isLot={selectedApplication.is_lot}
              />
            ) : ""}

            {selectNonMenuOption &&
              view == "application" &&
              selectedApplication &&
              selectedApplication.is_daycare && selectedApplication.is_daycare !== 2 ? (
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
                handleSelectLatestApplication={handleSelectLatest}
              />
            ) : ""}

            {selectNonMenuOption && view == "application" ? (
              <hr className="style-eight"></hr>
            ) : <span />}

            {selectNonMenuOption &&
              view == "application" &&
              selectedApplication &&
              !selectedApplication.is_daycare ? (
              <ParentFormViewStyled
                parents={parentsInformation}
                vendor={selectedVendor}
                ProfileImg={ProfileImg}
                handleParentFormDetailsChange={handleParentFormDetailsChange}
                isReadonly={isReadonly}
                isUpdate={true}
                emergencyContacts={emergencyContacts}
                selectedApplication={selectedApplication}
                childProfile={selectedApplication?.child}
              />
            ) : ""}

            {selectNonMenuOption &&
              view == "application" &&
              selectedApplication &&
              selectedApplication.is_daycare && selectedApplication.is_daycare !== 2 ? (
              <DaycareParentFormView
                parents={parentsInformation}
                vendor={selectedVendor}
                ProfileImg={ProfileImg}
                handleParentFormDetailsChange={handleParentFormDetailsChange}
                isReadonly={isReadonly}
                isUpdate={true}
                emergencyContacts={emergencyContacts}
                childProfile={selectedApplication?.child}
              />
            ) : ""}
            {
              selectNonMenuOption &&
                view == "application" &&
                selectedApplication &&
                selectedApplication.is_daycare && selectedApplication.is_daycare !== 2 ? (
                <>
                  <hr className="style-eight"></hr>
                  <RelationshipToChildStyled
                    selectedApplication={selectedApplication}
                    handleParentChildRelationship={handleParentChildRelationship}
                    parents={parentsInformation}
                    childs={[{ ...childInformation }]}
                    errors={errors}
                    register={register}
                    isReadonly={isReadonly}
                    relationships={relationships}
                    chRelationships={chRelationships}
                    isReadView={true}
                  />
                </>
              ) : ""
            }
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
                handleWaiverFormDetailsChange={handleWaiverFormDetailsChange}
                termsWaiver={termsWaiver}
                isVendorView={true}
                isUpdate={true}
                vendor={selectedVendor}
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
        </>
      )}
      {
        showAdminForm && (
          // <AdminFormStyled
          //   selectedVendor={selectedVendor}
          //   selectedForm={
          //     selectedForm == 'default' ? 
          //     { form_id: 'default',name: 'Mentoring Application' } 
          //     :
          //     selectedForm == 'lot' ? 
          //     { form_id: 'lot',name: 'Lot Form' }
          //     :
          //     addForm.form
          //   }
          //   newVendor={vendor.newVendor}
          //   handleExit={() => {
          //     setShowAdminForm(false);
          //   }}
          // />
          <AdminFormModal
            isLot={selectedForm === 'lot'}
            isCustomForm={selectedForm !== "default" && selectedForm !== 'lot'}
            handleExit={() => {
              setShowAdminForm(false);
            }}
            selectedVendor={selectedVendor}
          />
        )
      }
    </ApplicationStyled>
  );
}
