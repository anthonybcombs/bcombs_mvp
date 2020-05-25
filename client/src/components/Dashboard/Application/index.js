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

import { requestVendor } from "../../../redux/actions/Vendors";
import { requestGetApplications } from "../../../redux/actions/Application";

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

  const [selectNonMenuOption, setSelectNonMenuOption] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState({});

  const [view, setView] = useState("");

  const dispatch = useDispatch();

  const { grades, auth, vendor, applications } = useSelector(
    ({grades, auth, vendor, applications }) => {
      return { grades, auth, vendor, applications };
    }
  );

  console.log("Application", applications);

  useEffect(() => {
    if(auth.user_id) {
      dispatch(requestVendor(auth.user_id));
    }
  }, []);

  useEffect(() => {
    if(vendor.id) {
      dispatch(requestGetApplications(vendor.id));
    }
  }, [vendor]);

  const handleSelectedLabel = value => {
    setSelectedLabel(value);
    setSelectNonMenuOption(false);
    setSelectedApplication({});
    setView("")
  };

  const handleSelectedApplication = (application, view) => {
    setSelectedApplication(application);
    setSelectNonMenuOption(true);
    setView(view);
  }

  return (
    <ApplicationStyled>
      <h2>Application</h2>
      <div id="application">
        <div>
          <div id="labels">
            <a href={`/application/${vendor.user}`} target="_blank">
              <FontAwesomeIcon icon={faFileSignature} />
              <span>Application</span>
            </a>

            <div
              className={`${selectedLabel === "Application Status" ? "selected" : ""}`}  
              onClick={() => {
                handleSelectedLabel("Application Status");
              }}
            >
              <FontAwesomeIcon icon={faThList} />
              <span>Application Status</span>
            </div>

            <div
              className={`${selectedLabel === "Form Settings" ? "selected" : ""}`}  
              onClick={() => {
                handleSelectedLabel("Form Settings");
              }}
            >
              <FontAwesomeIcon icon={faCogs} />
              <span>Form Settings</span>
            </div>
          </div>
        </div>
        <div>
          {
            selectedLabel === "Application Status" && 
            !selectNonMenuOption &&
            <ApplicationSummaryStyled
              grades={grades}
            />
          }
          {
            selectedLabel === "Form Settings" && 
            !selectNonMenuOption &&
            <ApplicationSettingsStyled 
              vendor={vendor}  
            />
          }
          {
            selectNonMenuOption && view == "application" &&
            <EditApplicationStyled
              application={selectedApplication}
              vendor={vendor}
            />
          }
        </div>
      </div>
      {
        selectedLabel === "Application Status" && 
        !selectNonMenuOption &&
        <ApplicationListStyled
          applications={applications.activeapplications}
          handleSelectedApplication={handleSelectedApplication}
        />
      }
      {
        selectNonMenuOption && view == "application" &&
        <ChildFormViewStyled
          application={selectedApplication}
          vendor={vendor}
          ProfileImg={ProfileImg}
        />
      }
      {
        selectNonMenuOption && view == "application" && <hr className="style-eight"></hr>
      }
      {
        selectNonMenuOption && view == "application" &&
        <ParentFormViewStyled
          application={selectedApplication}
          vendor={vendor}
          ProfileImg={ProfileImg}
        />
      }
    </ApplicationStyled>
  )
}