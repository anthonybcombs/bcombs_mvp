import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThList,
  faFileSignature,
  faCogs
} from "@fortawesome/free-solid-svg-icons";
import ApplicationSummaryStyled from "./summary";
import ApplicationSettingsStyled from "./settings";
import ApplicationListStyled from "./list";
import EditApplicationStyled from "./edit";

import ChildFormViewStyled from "./view/child";
import ParentFormViewStyled from "./view/parent";
import TermsWaiverFormViewStyled from "./view/waiver";

import { requestVendor } from "../../../redux/actions/Vendors";
import { requestGetApplications, requestUpdateApplication } from "../../../redux/actions/Application";
import { requestUserGroup } from "../../../redux/actions/Groups";

import ProfileImg from "../../../images/defaultprofile.png";
const ApplicationStyled = styled.div`
  padding: 1em;

  #application {
    display: grid;
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
  }

  #labels > div > span,
  #labels > a > span {
    margin-left: 1em;
  }

  #application > div {
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }

  #application > div:nth-of-type(2) {
    margin-right: 0.5em;
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
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;  
  }

  @media (min-width: 600px) {
    #application {
      grid-template-columns: 25% 75%;
      grid-gap: 1%;
    }
  }

  @media (min-width: 1500px) {
    #application > div:nth-of-type(2) {
      margin-right: 1em;
    }
  }
`;

export default function index() {
  const [selectedLabel, setSelectedLabel] = useState("Application Status");

  const [updateApplication, setUpdateApplication] = useState({})

  const [selectNonMenuOption, setSelectNonMenuOption] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState({});

  const [view, setView] = useState("");

  const dispatch = useDispatch();

  const { groups, auth, vendors, applications, loading } = useSelector(
    ({ groups, auth, vendors, applications, loading }) => {
      return {groups, auth, vendors, applications, loading };
    }
  );

  if(applications.updateapplication && applications.updateapplication.message == "application updated") {
    window.location.reload(false);
  }

  if(applications.archivedapplication && applications.archivedapplication.message == "application archived") {
    window.location.reload(false);
  }
  useEffect(() => {
    if (auth.user_id) {
      dispatch(requestUserGroup(auth.email));
      dispatch(requestVendor(auth.user_id));
    }
  }, []);

  useEffect(() => {
    console.log("vendor", vendors);
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

  const handleSelectedApplication = (application, view) => {
    setSelectedApplication(application);
    setSelectNonMenuOption(true);
    setView(view);

    const temp = {
      app_id: application.app_id,
      verification: application.verification,
      student_status: application.student_status,
      color_designation: application.color_designation ? application.color_designation : "",
      notes: application.notes ? application.notes : "",
      class_teacher: application.class_teacher ? application.class_teacher : application?.child?.grade_desc
    }
    setUpdateApplication({...temp});
  }

  const handleUpdateOnchange = (id, value) => {

    setUpdateApplication({...updateApplication, [id]: value});
    console.log("UPDATE APPLICATION", updateApplication);
  }

  const onSubmit = () => {
    console.log("Submit update application", updateApplication)
    dispatch(requestUpdateApplication(updateApplication));
  }

  const [isReadonly, setIsReadonly] = useState(true);

  const handleChangeToEdit = () => {
    setIsReadonly(!isReadonly);
  }

  return (
    <ApplicationStyled>
      <div style={{display: "flex", alignItems: "center"}}>
        <h2>Application
        </h2>
        {
          vendors && 
          vendors.length > 0 &&
          (
            <div>
              <select className="form-control" style={{marginLeft: "20px"}}>
                {
                  vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))
                }
              </select>
            </div>
          )
        }

      </div>
      <div id="application">
        <div>
          <div id="labels">
            <a
              href={`/application/${vendors && vendors.length > 0 ? vendors[0]?.user : ""}`}
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
          </div>
        </div>
        <div>
          {selectedLabel === "Application Status" && !selectNonMenuOption && (
            <ApplicationSummaryStyled 
              appGroups={groups && groups.application_groups ? groups.application_groups : []}
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
              appGroups={groups && groups.application_groups ? groups.application_groups : []}
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
          appGroups={groups && groups.application_groups ? groups.application_groups : []}
        />
      )}
      {selectNonMenuOption && view == "application" && (
        <ChildFormViewStyled
          application={selectedApplication}
          vendor={vendors && vendors.length > 0 ? vendors[0] : null}
          ProfileImg={ProfileImg}
          isReadonly={isReadonly}
          handleChangeToEdit={handleChangeToEdit}
        />
      )}
      {selectNonMenuOption && view == "application" && (
        <hr className="style-eight"></hr>
      )}
      {selectNonMenuOption && view == "application" && (
        <ParentFormViewStyled
          application={selectedApplication}
          vendor={vendors && vendors.length > 0 ? vendors[0] : null}
          ProfileImg={ProfileImg}
        />
      )}
      {selectNonMenuOption && view == "application" && (
          <TermsWaiverFormViewStyled
          application={selectedApplication}
        />
      )}
    </ApplicationStyled>
  );
}
