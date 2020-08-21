import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUndo
} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SearchDate.css";
import Loading from "../../../helpers/Loading.js";

import { requestVendor } from "../../../redux/actions/Vendors";
import { requestGetArchivedApplications, requestUnarchivedAppplication } from "../../../redux/actions/Application"
import ArchivedApplicationListStyled from "./list";

const ArchivedApplicationStyled = styled.div`

  padding: 1em;


`;

const SearchDateComponent = (startDate) => (
  <>
    <span className="date-label">Date :</span>
    <DatePicker />
    <span className="to-label">To</span>
    <DatePicker />
    <button className="go-btn">Go</button>
  </>
);

export default function index() {

  const status = ['currentPassed', 'inProccess'];

  const name = ['James Ward', 'Terrance Woodyard', 'Cedric Taylor', 'Al Sullivan']

  const group = ['Freshmen', 'Juniors', 'Sophomores', 'Seniors', 'Middle School']

  const data = [];

  const dispatch = useDispatch();

  const { auth, vendors, applications, loading } = useSelector(
    ({ auth, vendors, applications, loading }) => {
      return { auth, vendors, applications, loading };
    }
  );

  if(applications.unarchivedapplication && applications.unarchivedapplication.message == "application unarchived") {
    window.location.reload(false);
  }

  useEffect(() => {
    if(auth.user_id) {
      dispatch(requestVendor(auth.user_id));
    }
  }, []);
  
  useEffect(() => {
    if (vendors && vendors.length > 0 && vendors[0].id) {
      dispatch(requestGetArchivedApplications(vendors[0].id));
    }
  }, [vendors]);

  console.log("archived list", applications);

  const handleUnarchived = (app_id) => {

    let arr_app_id = [];
    arr_app_id.push(app_id);

    dispatch(requestUnarchivedAppplication(arr_app_id));
  }

  return (
    <ArchivedApplicationStyled>
      <h2>Archived</h2>
      <div id="applicationList">
        <div id="tableSection">
          {
            loading.application ? (
              <Loading />
            ) : (
              <ArchivedApplicationListStyled
                archivedapplications={applications.archivedlist}
                handleUnarchived={handleUnarchived}
              />
            )
          }

        </div>
      </div>
    </ArchivedApplicationStyled>
  )
}