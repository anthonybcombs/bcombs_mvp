import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapsible from "react-collapsible";
import DataTable from 'react-data-table-component';

import { 
  requestVendor, 
  requestVendorAdmins,
  requestAddAdmin,
  requestDeleteAdmins,
  requestUpdateAdmin } from "../../../redux/actions/Vendors";

import {
  faTrash
} from "@fortawesome/free-solid-svg-icons";

import Loading from "../../../helpers/Loading.js";

import { format } from "date-fns";

import { Multiselect } from "multiselect-react-dropdown";

const AdminStyled = styled.div`
  width: auto;
  max-width: 1920px;
  margin: auto;
  padding: 0rem 3em 2rem;

  .control-label {
    text-align: right;
    margin-bottom: 0;
    color: #555;
    font-weight: 600;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
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

  .form-control[disabled], .form-control[readonly], fieldset[disabled] .form-control {
    background-color: #eee;
    opacity: 1;
  }

  .add-admin-header {
    font-size: 1.2em;
    padding: 1em;
  }

  .add-admin-content {
    display: block;
    padding: 1em;
  }

  .add-admin-content > div {
    display: grid;
    grid-template-columns: 30% 40% 30%;
    margin-bottom: 20px;
    font-size: 16px !important;
  }

  .submit-btn {
    background-color: #f26e21;
    padding: 10px;
    width: 100%;
    display: block;
    color: white;
    border-radius: 40px;
    max-width: 200px;
    margin: 0 10px;
    -webkit-text-decoration: none;
    text-decoration: none;
    text-align: center;
    font-size: 16px;
    border: 0;
  }

  .disabled {
    pointer-events: none;
    opacity: 0.7;
  }

  .error {
    border-color: red;
  }

  ._7ahQImyV4dj0EpcNOjnwA {
    background-color: #f26e21
  }

  .lhyQmCtWOINviMz0WG_gr {
    background-color: #f26e21
  }

  ._3vt7_Mh4hRCFbp__dFqBCI li:hover {
    background-color: #f26e21
  }

  #dataTableContainer a {
    color: #3e89fe;
    -webkit-text-decoration: none;
    text-decoration: none;
  }

  .delete {
    font-size: 1em;
    color: #fff;
    background-color: red;
    border-radius: 4px;
    padding: 10px 15px;
    border: 0;
    margin: 10px;
    margin-left: 0;
  }
`

export default function index() {

  const { auth, vendors, loading, admins } = useSelector(
    ({auth, vendors, loading, admins }) => {
      return {auth, vendors, loading, admins };
    }
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.user_id) {
      dispatch(requestVendor(auth.user_id));
      dispatch(requestVendorAdmins(auth.user_id))
    }
  }, []);

  useEffect(() => {
    if (vendors && vendors.length > 0) {
      let fomattedVendors = vendors.map(item => {
        return {
          id: item.id,
          name: item.name,
          label: item.name
        };
      });
      setVendorOptions(fomattedVendors);
    }
  }, [vendors]);

  let getAdmins;

  if(admins && admins.length > 0) {
    getAdmins = admins.filter((admin, index, self) => (
      index === self.findIndex((a) => (
        a.email === admin.email && a.vendorName === admin.vendorName
      ))
    ))
  }

  const [ addAdminFields, setAddAdminFields] 
    = useState({ name: "", email: "", vendors: []})

  const [ vendorOptions, setVendorOptions ] = useState([]);

  const [ isVendorEmpty, setIsVendorEmpty ] = useState();

  const [ selectedAdmin, setSelectedAdmin ] = useState({});

  const [ isUpdate, setIsUpdate ] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  const handleAddAdminChange = (id, value) => {
    setAddAdminFields({ ...addAdminFields, [id]: value });
  }

  const onSubmitAddAdmin = () => {
    console.log("addAdminFields", addAdminFields);

    if(addAdminFields && 
      addAdminFields.vendors && 
      addAdminFields.vendors.length > 0 ) {

        let payload;

      if(isUpdate) {
        payload = addAdminFields;
        payload.vendors = payload.vendors.map(vendor => vendor.id);
        payload.currentUser = auth.user_id;
        payload.user = selectedAdmin.user;

        console.log("payload update", payload);

        dispatch(requestUpdateAdmin(payload));

        const checkVendorExists = payload.vendors.filter((vendor) => {
          return vendor == selectedAdmin.vendor;
        });

        if(checkVendorExists && checkVendorExists.length <= 0) {
          //do delete vendor;
          let admins = [{
            user: selectedAdmin.user,
            vendor: selectedAdmin.vendor,
            currentUser: auth.user_id
          }]
          dispatch(requestDeleteAdmins(admins));
        }

      } else {
        payload = addAdminFields;
        payload.vendors = payload.vendors.map(vendor => vendor.id);
        payload.currentUser = auth.user_id;
  
        console.log("payload", payload);
  
        dispatch(requestAddAdmin(payload));
      }

      setIsUpdate(false);
      setAddAdminFields({ name: "", email: "", vendors: []});
      setIsVendorEmpty(false);
    } else {
      setIsVendorEmpty(true);
    }
  }

  const handleSelectedAdmin = (e, sAdmin) => {
    e.preventDefault();
    setSelectedAdmin(sAdmin);

    console.log("sAdmin", sAdmin);

    const selectedVendors = vendorOptions.filter((vendor) => {
      return vendor.id == sAdmin.vendor;
    })

    setAddAdminFields({name: sAdmin.name, email: sAdmin.email, vendors: selectedVendors});
    setIsUpdate(true);
  }

  const handleDeleteBulkAdmin = () => {
    console.log("selectedRows", selectedRows);

    if(selectedRows.length > 0) {
      let payload = selectedRows.map((item) => {
        return {
          user: item.user,
          vendor: item.vendor,
          currentUser: auth.user_id
        }
      });

      console.log("payload", payload);

      dispatch(requestDeleteAdmins(payload));
    }
  }

  const handleSelectedRowsChange = state => {
    setSelectedRows(state.selectedRows);
  };

  const { register, handleSubmit, errors, clearError, setError } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange"
  });

  const columns = [
    {
      name: 'Name',
      selector: 'name',
      sortable: true,
      cell: row => <a href="#" onClick={(e) => {handleSelectedAdmin(e, row)}}>{row.name}</a>
    },
    {
      name: 'Email',
      selector: 'email',
      sortable: true,
      cell: row => row.email
    },
    {
      name: 'Application',
      selector: 'application',
      sortable: true,
      cell: row => row.vendorName
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

  return (
    <AdminStyled>
      <div>
        <h2>
          Manage Admin
        </h2>
      </div>
      <div style={{backgroundColor: "#ffffff"}}>
        <div className="add-admin-header">
          <div style={{textAlign: "center"}}>              
            <span>Add Sub-Admin</span>
          </div>
        </div>
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmitAddAdmin)}
        >
          <div className={
            loading && loading.addAdmin ? "add-admin-content disabled" : "add-admin-content"
          } >
            <div>
              <label className="control-label">Fullname</label>
              <div>
                <input
                  type="text"
                  className={
                    errors && 
                    errors.adminname && 
                    errors.adminname.type == "required" ? "form-control error" : "form-control"
                  }
                  name="adminname"
                  onChange={({ target }) => {
                    handleAddAdminChange("name", target.value);
                  }} 
                  value={addAdminFields.name}
                  ref={register({required: true})}
                />
              </div>
            </div>
            <div>
              <label className="control-label">Email</label>
              <div>
                <input
                  type="text"
                  className={
                    errors && 
                    errors.adminemail && 
                    (errors.adminemail.type == "pattern" || errors.adminemail.type == "required") ? "form-control error" : "form-control"
                  }
                  name="adminemail"
                  onChange={({ target }) => {
                    handleAddAdminChange("email", target.value);
                  }}
                  readOnly={isUpdate}
                  value={addAdminFields.email}
                  ref={register({
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
              </div>
            </div>
            <div>
              <label className="control-label">Application</label>
              <Multiselect
                id={"vendors"}
                className="error"
                selectedValues={addAdminFields.vendors}
                options={vendorOptions}
                hasSelectAll={false}
                onSelect={selectedList => {
                  if(selectedList.length > 0) setIsVendorEmpty(false);

                  handleAddAdminChange("vendors", selectedList);
                }}
                onRemove={selectedList => {
                  if(selectedList.length <= 0) setIsVendorEmpty(true);

                  handleAddAdminChange("vendors", selectedList)
                }}
                placeholder="Select Application"
                displayValue="name"
                closeIcon="cancel"
                closeOnSelect={false}
                showCheckbox={true}
                autocomplete="false"
                style={{ searchBox: { borderColor: isVendorEmpty ? "red": "" }}}
              />
            </div>
            <div style={{display:"flex", justifyContent:"center"}}>
              <button className="submit-btn" type="submit">Submit</button>
            </div>
          </div>
        </form>
      </div>

      <div className="adminlist-section">
        <h3>Admins</h3>
        <div id="dataTableContainer" className={loading.deleteAdmins ? "disabled" : ""}>
          <button className="delete" onClick={handleDeleteBulkAdmin}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <DataTable 
            columns={columns}
            data={getAdmins}
            pagination
            noHeader={true}
            striped={true}
            customStyles={customStyles}
            selectableRows
            paginationRowsPerPageOptions={paginationRowsPerPageOptions}
            paginationComponentOptions={paginationComponentOptions}
            onSelectedRowsChange={handleSelectedRowsChange}
          />
        </div>
      </div>
    </AdminStyled>
  );
}
