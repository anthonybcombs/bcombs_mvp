import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from 'react-data-table-component';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


import {
  requestGetApplications,
  getActiveApplicationFromDatabase,
  getCustomApplicationsFromDatabase,
} from "../../../redux/actions/Application";


import {
  requestVendor,
  requestVendorAdmins,
  requestAddAdmin,
  requestDeleteAdmins,
  requestUpdateAdmin,
  addAdmin
} from "../../../redux/actions/Vendors";

import {
  faTrash
} from "@fortawesome/free-solid-svg-icons";

import { getApplicationStatusVal } from "../../../helpers/Applications";
import Loading from "../../../helpers/Loading.js";

import { format } from "date-fns";

import { Multiselect } from "multiselect-react-dropdown";
import { defineLocale } from "moment";

const DATE_FORMAT = "yyyy-MM-dd";

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
  },
  tab: { fontWeight: 'bolder', fontSize: 20 }
}

const removeDuplicateObj = (data = [], key = 'id') => {
  return data.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t[key] === value[key]
    ))
  ).filter(item => item[key]);
}

const ExpandableRowForm = ({ data, vendors = [] }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [applications, setApplications] = useState([]);

  useEffect(() => {

    if (vendors && vendors.length > 0) {
      const vendor = vendors.find(item => item.id === data.vendor);
      const forms = removeDuplicateObj(data.forms, 'form');


      const triggerMentoringOrLotApi = async id => {
        try {
          setIsLoading(true);
          const response = await getActiveApplicationFromDatabase(id);
          setApplications(response || []);
        } catch (e) {
          console.log('REsponseeee error', e)
        }
        finally {
          setIsLoading(false);
        }
      }


      const triggerCustomFormApi = async currentForms => {
        try {
          setIsLoading(true);
          // const response = await getCustomApplicationsFromDatabase(id);
          let customApplications = [];


          for (let currentForm of currentForms) {
            const response = await getCustomApplicationsFromDatabase(currentForm.form);
            customApplications = [...customApplications, ...(response || [])];
          }
          setApplications(customApplications || []);
        } catch (e) {
          console.log('REsponseeee error', e)
        }
        finally {
          setIsLoading(false);
        }
      }


      if (forms && forms.length > 0) {

        triggerCustomFormApi(forms);
      }
      else if (vendor) {
        triggerMentoringOrLotApi(vendor.id);
      }

    }
  }, [data, vendors]);

  const columns = [
    {
      name: "Status",
      selector: "status",
      sortable: true,
      cell: row =>
        getApplicationStatusVal(row.student_status, row.verification, row)
    },
    {
      name: 'Student Name',
      sortable: true,
      cell: row => {

        return <span>{`${row?.child?.firstname} ${row?.child?.lastname}`}</span>
      }
    },
    // {
    //   name: 'Parent Name',
    //   sortable: true,
    //   cell: row => {

    //     return <span>{`${row?.parents[0]?.firstname} ${row?.parents[0]?.lastname}`}</span>
    //   }
    // },
    {
      name: "Grade",
      selector: "class",
      sortable: true,
      cell: row => row?.is_daycare ? "-" : row?.child?.grade_desc
    },
    {
      name: "Group(s)",
      selector: "classGroup",
      sortable: true,
      cell: row => {
        if (row.class_teacher && data?.app_groups) {

          let displayGroups = '';
          data?.app_groups.map((e) => {
            if (row.class_teacher.includes(e.app_grp_id))
              displayGroups += e.name + ','
          })

          displayGroups = displayGroups.slice(0, -1);
          const arrGroups = displayGroups.split(',');

          if (arrGroups && arrGroups.length > 1) {
            return displayGroups = arrGroups[0] + ',...'
          } else {
            return displayGroups = arrGroups[0];
          }
        }
        return "-";
      }
    },
    {
      name: "Form",
      selector: "form_contents",
      sortable: true,
      cell: row => {
        if (row.form_contents) {
          return row.form_contents.formTitle
        }
        else {
          return data.isLotForm ? 'LOT Form' : 'Mentoring Form';
        }
      }
    },
    {
      name: "Application Date",
      selector: "application_date",
      sortable: true,
      cell: row => format(new Date(row.application_date), DATE_FORMAT)
    },
  ];



  return (
    <div style={{ padding: 12 }}>
      {isLoading ? <Loading /> : <DataTable
        columns={columns}
        data={applications}
        pagination
        noHeader={true}
        striped={true}
        customStyles={customStyles}
        selectableRows
      />}

    </div>
  );
};


export default function index({
  isLot = false,
  isCustomForm = false,
  selectedVendor = null
}) {
  const { auth, applications, vendors, loading, admins, vendor } = useSelector(
    ({ auth, applications, vendors, loading, admins, vendor }) => {
      return { auth, applications, vendors, loading, admins, vendor };
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

      let formattedVendors = vendors.map(item => {

        let vForms = item?.forms ? item.forms : [];

        let formattedForms = [];

        formattedForms = vForms.map((form) => {
          return {
            id: form.form_id,
            name: form?.form_contents?.formTitle,
            label: form?.form_contents?.formTitle,
            isCustomForm: true
          }
        })

        formattedForms.unshift({
          id: 'lot',
          name: 'Lot Form',
          label: 'Lot Form',
          isCustomForm: false
        });

        formattedForms.unshift({
          id: 'default',
          name: 'Mentoring Application',
          label: 'Mentoring Application',
          isCustomForm: false
        });

        console.log('vForms', vForms);

        return {
          ...item,
          id: item.id,
          name: item.name,
          label: item.name,
          forms: formattedForms,
          is_daycare: item.is_daycare
        };
      });

      //setFormOptions(formattedVendors[0].forms);
      setVendorOptions(formattedVendors);

      const defaultVendor = formattedVendors.length > 0 ? formattedVendors[0] : '';

      let defaultForm = ""

      if (defaultVendor && defaultVendor.forms &&
        defaultVendor.forms.length > 0) {

        if (defaultVendor.forms.length > 2 && isCustomForm) {
          defaultForm = defaultVendor.forms[2];
        }
        else {
          defaultForm = defaultVendor.forms[isLot ? 1 : 0];

        }

        setFormOptions(defaultVendor.forms);
      }
      // { ...defaultForm }

      setAddAdminFields({
        name: '',
        email: '',
        vendor: selectedVendor?.id,
        forms: []
      })
      console.log('APplicationssss selectedVendor', selectedVendor)
      console.log('APplicationssss vendors', vendors)
      if (applications && applications.activeapplications && (applications.activeapplications.length === 0) && selectedVendor) {
        dispatch(requestGetApplications(selectedVendor?.id))
      }
    }
  }, [selectedVendor, vendors]);

  console.log('APplicationssss', applications)
  console.log('APplicationssss adminFields', addAdminFields)
  useEffect(() => {

    if (admins && admins.length > 0) {

      let tempAdmins = admins.map((admin, index) => {
        admin.forms = admins.map((item) => {
          if (item.email == admin.email &&
            item.vendorName === admin.vendorName) {
            return {
              form: item.form,
              formTitle: item.formTitle
            }
          } else {
            return false;
          }
        })

        admin.forms = admin.forms.filter((x) => !!x);

        delete admin.form;
        delete admin.formTitle;

        return {
          ...admin,
          no: index + 1
        };
      });

      console.log("tempAdmins", tempAdmins);
      const getAdmins = tempAdmins.filter((admin, index, self) => (
        index === self.findIndex((a) => (
          a.email === admin.email && a.vendorName === admin.vendorName
        ))
      ));

      getAdmins.map(a => {
        a.isLotForm = tempAdmins.filter(x => x?.vendor == a.vendor).some(y => y?.isLotForm);
      })

      console.log('getAdmins', getAdmins);

      setCurrentAdmins(getAdmins)

    }
  }, [admins])

  // let getAdmins;

  // if(admins && admins.length > 0) {
  //   getAdmins = admins.filter((admin, index, self) => (
  //     index === self.findIndex((a) => (
  //       a.email === admin.email && a.vendorName === admin.vendorName
  //     ))
  //   ))
  // }

  const [currentAdmins, setCurrentAdmins] = useState([])

  const [addAdminFields, setAddAdminFields]
    = useState({ name: "", email: "", vendor: "", forms: [] })

  const [vendorOptions, setVendorOptions] = useState([]);

  const [formOptions, setFormOptions] = useState([]);

  const [isVendorEmpty, setIsVendorEmpty] = useState();

  const [selectedAdmin, setSelectedAdmin] = useState({});

  const [isUpdate, setIsUpdate] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

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


  console.log("addAdminFields 22222", addAdminFields);
  const onSubmitAddAdmin = () => {
    console.log("addAdminFields", addAdminFields);

    if (addAdminFields &&
      addAdminFields.forms &&
      addAdminFields.forms.length > 0) {

      let payload;

      if (isUpdate) {

        console.log('addAdminFields', addAdminFields);

        payload = addAdminFields;

        payload.forms = payload.forms.map(form => {
          return {
            form_id: form.id,
            isCustomForm: form.isCustomForm
          }
        });

        //payload.vendors = payload.vendors.map(vendor => vendor.id);

        payload.currentUser = auth.user_id;
        payload.user = selectedAdmin.user;

        console.log("payload update", payload);

        dispatch(requestUpdateAdmin(payload));

        // const checkVendorExists = payload.vendors.filter((vendor) => {
        //   return vendor == selectedAdmin.vendor;
        // });

        // if(checkVendorExists && checkVendorExists.length <= 0) {
        //   //do delete vendor;
        //   let admins = [{
        //     user: selectedAdmin.user,
        //     vendor: selectedAdmin.vendor,
        //     currentUser: auth.user_id
        //   }]
        //   //dispatch(requestDeleteAdmins(admins));
        // }

      } else {
        let selectedVendor = vendorOptions.filter((v) => {
          return v.id == addAdminFields.vendor;
        })[0];

        payload = addAdminFields;
        payload.forms = payload.forms.map(form => {
          return {
            form_id: form.id,
            isCustomForm: form.isCustomForm
          }
        });
        payload.vendor2 = selectedVendor?.vendor2;

        payload.currentUser = auth.user_id;

        console.log("add admin payload", payload);

        dispatch(requestAddAdmin(payload));
      }

      setIsUpdate(false);
      setAddAdminFields({ name: "", email: "", vendor: "", forms: [] });
      setIsVendorEmpty(false);
    } else {
      setIsVendorEmpty(true);
    }
  }

  const handleSelectedAdmin = (e, sAdmin) => {
    e.preventDefault();
    setSelectedAdmin(sAdmin);

    console.log("sAdmin", sAdmin);

    let selectedVendor = vendorOptions.filter((v) => {
      return v.id == sAdmin.vendor
    })

    selectedVendor = selectedVendor.length > 0 ? selectedVendor[0] : {};

    const vendorForms = selectedVendor?.forms ? selectedVendor.forms : []

    console.log('selectedVendor', selectedVendor);

    let sAdminForms = sAdmin.forms;

    const selectedForms = vendorForms.filter((form) => {
      //return form.id == sAdmin.form;

      const isExists = sAdminForms.filter((x) => {
        if (x.form == form.id) return true;
        else if (!x.form) {
          if (form.id == 'default' && !sAdmin.isLotForm) {
            return true;
          } else if (form.id == 'lot' && sAdmin.isLotForm) {
            return true
          } else {
            return false;
          }
        }
        else return false;
      });

      return isExists.length > 0;
    });

    console.log('selectedForms', selectedForms);

    setFormOptions([...vendorForms]);
    setAddAdminFields({ name: sAdmin.name, email: sAdmin.email, forms: selectedForms, vendor: sAdmin.vendor });
    setIsUpdate(true);
  }

  const handleDeleteBulkAdmin = () => {
    console.log("selectedRows", selectedRows);

    if (selectedRows.length > 0) {
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

  const setupForms = (forms, isLotForm = false) => {

    console.log('this is the forms', forms);
    console.log('isLotForm', isLotForm);

    let formString = "";

    const subForms = forms.filter((f, index, self) => (
      index === self.findIndex((a) => (
        a.form === f.form && a.formTitle === f.formTitle
      ))
    ));

    forms = [...subForms];

    forms.map((i) => {
      if (i?.form) {
        formString += `${i.formTitle}, `;
      } else if (!isLotForm) {
        formString += "Mentoring Applications, ";
      }

      if (!(i?.form) && isLotForm) {
        formString += "Lot Form, ";
      }
    })
    formString = formString.slice(0, -1);
    formString = formString.slice(0, -1);

    return formString;
  }

  const columns = [
    {
      name: 'ID',
      selector: 'no',
      sortable: true,
      cell: row => {
        // console.log('Vendorrrr', row)
        // console.log('Rowwww', row)
        // const currentVendor = vendors && vendors.length > 0 && vendors.find(item => item.id === row.vendor);
        return <span>{row?.vendor.substring(1,3)}</span>
      }
    },
    {
      name: 'Name',
      selector: 'name',
      sortable: true,
      cell: row => <a href="#" onClick={(e) => { handleSelectedAdmin(e, row) }}>{row.name}</a>
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
    },
    {
      name: 'Form',
      selector: 'form',
      sortable: true,
      cell: row => setupForms(row.forms, row.isLotForm)
    }
  ];

  const assignedFormColumns = [

    {
      name: 'Vendor',
      selector: 'vendor',
      sortable: true,
      cell: row => <span>{row?.vendor?.name}</span>
    },
    {
      name: 'Form Title',
      selector: 'form_title',
      sortable: true,
      cell: row => <span>{row?.form_title}</span>
    },
    {
      name: 'Admins',
      selector: 'adnins',
      sortable: true,
      cell: row => <span>{row?.admins.map(item => <div>{item.email}</div>)}</span>
    },
  ];

  const paginationRowsPerPageOptions = [10, 25, 50, 100];
  const paginationComponentOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
    noRowsPerPage: false,
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All'
  }


  console.log('vendorszzzz', vendors)
  console.log('vendorszzzz currentAdmins', currentAdmins)
  const applicationForms = vendors && Array.isArray(vendors) && vendors.map(item => item.forms).flat();
  console.log('vendorszzzz applicationForms', applicationForms)
  let formWithVendorAndAdmins = [];
  if (applicationForms) {
    let assignedForms = applicationForms.map(applicationForm => {
      const currentVendor = vendors.find(vendor => {
        return vendor.forms.find(form => form.form_id === applicationForm.form_id)
      });
      const assignedAdmin = currentAdmins.filter(admin => {
        return admin.forms.find(form => form.form === applicationForm.form_id)
      });


      return {
        form_title: applicationForm?.form_contents?.formTitle,
        vendor: currentVendor,
        admins: assignedAdmin
      }
    });

    let adminWithNoCustomForm = currentAdmins.filter(admin => admin.forms.every(form => !form.form) && !admin.isOwner)
    adminWithNoCustomForm = adminWithNoCustomForm.map(admin => {
      const currentVendor = vendors.find(vendor => {
        return vendor.id === admin.vendor
      });
      const otherAdmins = adminWithNoCustomForm.filter(item => currentVendor && (currentVendor?.id === item.vendor) && (admin.id !== item.id))

      return {
        vendor: currentVendor,
        admins: [admin,...(otherAdmins)],
        form_title: admin.isLotForm ? 'LOT Form' : 'Mentoring Form',
        vendorName: admin.vendorName
      }
    }).filter(admin => admin.vendor)

    adminWithNoCustomForm = removeDuplicateObj(adminWithNoCustomForm,'vendorName');
 
    // ...(adminWithNoCustomForm || []),
    formWithVendorAndAdmins = [...(assignedForms || []), ...(adminWithNoCustomForm || [])]
  };
  console.log('formWithVendorAndAdmins',formWithVendorAndAdmins)

  return (
    <AdminStyled>
      <div>
        <h2>
          Manage Admin
        </h2>
      </div>
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
              <label className="control-label">Application</label>
              <select
                type="text"
                name="adminvendor"
                className={
                  errors &&
                    errors.adminemail &&
                    (errors.adminemail.type == "pattern" || errors.adminemail.type == "required") ? "form-control error" : "form-control"
                }
                onChange={({ target }) => {

                  let selectedVendor = vendorOptions.filter((v) => {
                    return v.id == target.value;
                  })

                  selectedVendor = selectedVendor.length > 0 ? selectedVendor[0] : {};

                  setFormOptions(selectedVendor?.forms);

                  handleAddAdminChange("vendor", target.value);

                }}
                ref={register({ required: true })}
                value={addAdminFields.vendor}
              >
                <option value="">Select</option>
                {
                  vendorOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))
                }
              </select>
            </div>
            <div>

              <label className="control-label">Forms</label>
              <Multiselect
                id={"vendors"}
                className="error"
                selectedValues={addAdminFields.forms}
                options={formOptions}
                hasSelectAll={false}
                onSelect={selectedList => {
                  if (selectedList.length > 0) setIsVendorEmpty(false);

                  handleAddAdminChange("forms", selectedList);
                }}
                onRemove={selectedList => {
                  if (selectedList.length <= 0) setIsVendorEmpty(true);

                  handleAddAdminChange("forms", selectedList)
                }}
                placeholder="Select Application"
                displayValue="name"
                closeIcon="cancel"
                closeOnSelect={false}
                showCheckbox={true}
                autocomplete="false"
                style={{ searchBox: { border: isVendorEmpty ? "1px solid red" : "1px solid #ccc" } }}
              />
              <div style={{ display: 'block' }}>
                <input
                  type="checkbox"
                  name="forms_select_all"
                  onChange={e => {
                    if (e.target.checked) {
                      handleAddAdminChange("forms", formOptions);
                    }
                    else {
                      handleAddAdminChange("forms", []);
                    }
                  }}

                /> Select All
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button className="submit-btn" type="submit">Submit</button>
            </div>
          </div>
        </form>
      </div>


      <div style={{ marginTop: 12 }}>
        <Tabs
        >
          <TabList>
            <Tab style={customStyles.tab}>Admins</Tab>
            <Tab style={customStyles.tab}>Admin Application Forms</Tab>
          </TabList>

          <TabPanel>
            <div className="adminlist-section">
              <h3>Admins</h3>
              <div id="dataTableContainer" className={loading.deleteAdmins ? "disabled" : ""}>
                <button className="delete" onClick={handleDeleteBulkAdmin}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <DataTable
                  columns={columns}
                  data={currentAdmins}
                  pagination
                  noHeader={true}
                  striped={true}
                  customStyles={customStyles}
                  selectableRows
                  paginationRowsPerPageOptions={paginationRowsPerPageOptions}
                  paginationComponentOptions={paginationComponentOptions}
                  onSelectedRowsChange={handleSelectedRowsChange}
                // expandableRows
                // expandableRowsComponent={<ExpandableRowForm vendors={vendors} />}
                // expandableRowsComponentProps={{"someTitleProp": someTitleProp}}    
                />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <DataTable
              columns={assignedFormColumns}
              data={formWithVendorAndAdmins}
              pagination
              noHeader={true}
              striped={true}
              customStyles={customStyles}
              selectableRows
              paginationRowsPerPageOptions={paginationRowsPerPageOptions}
              paginationComponentOptions={paginationComponentOptions}
            // expandableRows
            // expandableRowsComponent={<ExpandableRowForm vendors={vendors} />}
            // expandableRowsComponentProps={{"someTitleProp": someTitleProp}}    
            />
          </TabPanel>


        </Tabs>

      </div>
    </AdminStyled>
  );
}
