import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";


import {
  requestAddAdmin,
  addAdmin
} from "../../../../redux/actions/Vendors";

import Loading from "../../../../helpers/Loading.js";

const AdminFormStyled = styled.div`
  width: auto;
  max-width: 1920px;
  margin: auto;
  padding: 0rem 3em 2rem;

  .modal-content {
    max-width: 800px;
  }

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

export default function index({
  selectedVendor = {},
  selectedForm = {},
  newVendor = {},
  handleExit
}) {

  const { auth, vendors, loading, admins } = useSelector(
    ({ auth, vendors, loading, admins }) => {
      return { auth, vendors, loading, admins };
    }
  );

  let vendorName;
  let formName;

  console.log('admin selectedForm', selectedForm);
  if(selectedForm.form_id == 'default') {
    vendorName = newVendor.name;
    formName = 'Mentoring Application'
  } else {
    vendorName = selectedVendor.name;
    formName = selectedForm?.form_contents?.formTitle;
  }

  console.log('admin form view', selectedForm);

  const dispatch = useDispatch();
  
  const [addAdminFields, setAddAdminFields]
    = useState({ name: "", email: ""})

  const [vendorOptions, setVendorOptions] = useState([]);

  const [formOptions, setFormOptions] = useState([]);

  const [isVendorEmpty, setIsVendorEmpty] = useState();

  const [selectedAdmin, setSelectedAdmin] = useState({});

  const [isUpdate, setIsUpdate] = useState(false);

  useState(() => {
    console.log('addAdmin is done', loading);
  }, loading.addAdmin)

  const handleAddAdminChange = (id, value) => {

    console.log(id, value);
    console.log("addAdminFields", addAdminFields);
    if (id == 'vendor') {

      const adminFields = {
        name: addAdminFields.name,
        email: addAdminFields.email,
        vendor: value,
        forms: []
      }

      console.log("Hi Im here");
      console.log(adminFields);
      setAddAdminFields({ ...adminFields });
    } else {
      setAddAdminFields({ ...addAdminFields, [id]: value });
    }

  }

  const onSubmitAddAdmin = () => {
    let payload = {...addAdminFields};

    payload.vendor = selectedVendor.id;
    payload.vendor2 = selectedVendor.id2;
    payload.currentUser = auth.user_id;

    payload.forms = [{
      form_id: selectedForm.form_id,
      isCustomForm: !(selectedForm.form_id == 'default')
    }];

    console.log('create admin payload', payload);

    dispatch(requestAddAdmin(payload));

    setTimeout(() => {
      alert(`Invite sent to ${addAdminFields.email}`);
      setAddAdminFields({name: "", email: ""});
    }, 1000)
  }


  const { register, handleSubmit, errors, clearError, setError } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange"
  });

  return (
    <AdminFormStyled>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
          <h2>
            Manage Admin
          </h2>
          <span onClick={handleExit} className="close">
            &times;
          </span>
          </div>
          <div className="modal-container">
            <div style={{ backgroundColor: "#ffffff" }}>
              <div className="add-admin-header">
                <div style={{ textAlign: "center" }}>
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
                    <label className="control-label">Full Name</label>
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
                        ref={register({ required: true })}
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
                    <label className="control-label">Vendor</label>
                    {
                      <label disabled className="form-control">{vendorName}</label>
                    }
                  </div>
                  <div>
                    <label className="control-label">Form</label>
                    {
                      <label disabled className="form-control"> {formName}</label>
                    }
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button className="submit-btn" type="submit">Submit</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </AdminFormStyled>
  );
}
