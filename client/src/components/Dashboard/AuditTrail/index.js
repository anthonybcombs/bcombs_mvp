import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { requestGetUserApplicationHistory } from "../../../redux/actions/Application";
import DataTable from "react-data-table-component";

const DATE_TIME_FORMAT = "LLL dd, yyyy p";
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
const columns = [
  {
    name: "Application Date",
    selector: "details",
    cell: row => {
      let application = row.details ? JSON.parse(row.details) : null;
      console.log("Applicationnnn", application);
      if (application) {
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
      let application = row.details ? JSON.parse(row.details) : null;
      if (application) {
        return (
          <a target="_blank" href={"menteeprofile/" + application.id}>
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
    name: "Gender",
    selector: "gender",
    sortable: true,
    cell: row => {
      let application = row.details ? JSON.parse(row.details) : null;
      if (application) {
        return application.child?.gender;
      }
      return;
    }
  },
  {
    name: "Grade",
    selector: "grade_desc",
    sortable: true,
    cell: row => {
      let application = row.details ? JSON.parse(row.details) : null;
      if (application) {
        return application.child?.grade_desc;
      }
      return;
    }
  },
  {
    name: "Parents",
    selector: "parents",
    sortable: true,
    cell: row => {
      let application = row.details ? JSON.parse(row.details) : null;
      if (application) {
        return application.parents.map(parent => {
          return (
            <a target="_blank" href={"parentprofile/" + parent.parent_id}>
              <span>
                {parent.firstname} {parent.lastname}
              </span>
            </a>
          );
        });
      }
      return;
    }
  },
  {
    name: "Status",
    selector: "student_status",
    cell: row => {
      let application = row.details ? JSON.parse(row.details) : null;
      if (application) {
        return application.student_status;
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
    name: "Verification",
    selector: "Verification",
    cell: row => {
      let application = row.details ? JSON.parse(row.details) : null;
      if (application) {
        return application.verification;
      }
      return;
    }
  },

  {
    name: "Updated At",
    selector: "updated_at",
    sortable: true,
    cell: row => {
      return format(new Date(row.updated_at), DATE_TIME_FORMAT);
    }
  }
];

const childColumns = [
  {
    name: "Program",
    selector: "vendorLocationSites",

    cell: row => {
      console.log("ROOWWWWW", row);
      return row.vendorLocationSites
        ? row.vendorLocationSites.map(item => <div>{item.name}</div>)
        : null;
    }
  },
  {
    name: "Vendor Sites",
    selector: "vendorPrograms",

    cell: row => {
      return row.vendorPrograms
        ? row.vendorPrograms.map(item => <div>{item.name}</div>)
        : null;
    }
  }
];
const ExpandedRow = props => {
  let application =
    props.data && props.data.details ? JSON.parse(props.data.details) : null;
  console.log("application", application);
  return (
    <ChildInformationViewStyled>
      <div>
        <div className="mentee-header">
          <div className="mentee-title">Details</div>
          <div className="mentee-info">
            <div className="profile-info">
              <div className="content">
                <div className="left">
                  <div className="label">Email:</div>
                  <div className="value">{"test"}</div>
                </div>
                <div className="right">
                  <div className="value">{""}</div>
                </div>
                <div className="left">
                  <div className="label">Email:</div>
                  <div className="value">{"test"}</div>
                </div>
                <div className="right">
                  <div className="value">{""}</div>
                </div>
              </div>
              <div className="content">
                <div className="left">
                  <div className="label">Email:</div>
                  <div className="value">{"test"}</div>
                </div>
                <div className="right">
                  <div className="value">{""}</div>
                </div>
              </div>
            </div>
            <div className="extra-space"></div>
          </div>
        </div>
      </div>
    </ChildInformationViewStyled>
  );
};

const AuditTrail = props => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const { auth, applications, loading } = useSelector(
    ({ auth, applications, loading }) => {
      return { auth, applications, loading };
    }
  );
  useEffect(() => {
    if (auth.user_id) {
      dispatch(requestGetUserApplicationHistory(auth.user_id));
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, [applications]);

  console.log("applications", applications);
  return (
    <AuditTrailStyled>
      <div id="dataTableContainer">
        {
          <DataTable
            columns={columns}
            data={(applications && applications.applicationHistory) || []}
            pagination={true}
            paginationPerPage={15}
            noHeader={true}
            striped={true}
            progressPending={isLoading}
            //expandableRows={true}
            //expandableRowsComponent={<ExpandedRow />}
          />
        }
      </div>
    </AuditTrailStyled>
  );
};

export default AuditTrail;
