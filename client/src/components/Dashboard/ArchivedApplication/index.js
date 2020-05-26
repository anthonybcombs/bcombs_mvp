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

import { requestVendor } from "../../../redux/actions/Vendors";
import { requestGetArchivedApplications } from "../../../redux/actions/Application"
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

  const { auth, vendor, applications, loading } = useSelector(
    ({ auth, vendor, applications, loading }) => {
      return { auth, vendor, applications, loading };
    }
  );

  useEffect(() => {
    if(auth.user_id) {
      dispatch(requestVendor(auth.user_id));
    }
  }, []);

  useEffect(() => {
    if(vendor.id) {
      dispatch(requestGetArchivedApplications(vendor.id));
    }
  }, [vendor]);

  console.log("archived list", applications);

  return (
    <ArchivedApplicationStyled>
      <h2>Archived</h2>
      <div id="applicationList">
        <div id="tableSection">
          <ArchivedApplicationListStyled
            archivedapplications={applications.archivedlist}
          />
        </div>
      </div>
    </ArchivedApplicationStyled>
  )
}