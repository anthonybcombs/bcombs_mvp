import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import Collapsible from "react-collapsible";
import uniqBy from 'lodash.uniqby'
import {
  faUsers,
  faPlus
} from "@fortawesome/free-solid-svg-icons";

import ContactList from "./contactList";
import NewContactModal from "./create";
import EditContactModal from "./edit/contact";
import SendMessageModal from "./message";
import ParentContacts from "./parentContacts";
import NewGroupModal from "../MyGroups/create";
import EditGroupModal from "../MyGroups/edit";
import JoinedGroupModal from "../MyGroups/view";

import NewAppGroupModal from "../MyGroups/appCreate";
import ProfileModal from "./profile/";

import Loading from "../../../helpers/Loading.js";

// REDUX
import { getContact } from "../../../redux/actions/Contacts";
import {
  requestUserGroup,
  requestMembers
} from "../../../redux/actions/Groups";
import { requestVendor, requestUserVendorForms } from "../../../redux/actions/Vendors";
import { requestParentByVendor } from "../../../redux/actions/Parents";

import {
  requestGetForms,
  // requestUpdateSubmittedForm,
  // requestGetCustomApplicationHistory,
  // requestAddForm
} from '../../../redux/actions/FormBuilder'

const MyContactsStyled = styled.div`
  // padding: 1em;
  width: auto;
  max-width: 1920px;
  margin: auto;
  padding: 0rem 3em 2rem;

  .selected {
    background-color: #cdcdcd;
  }
  button {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
  #contacts {
    display: grid;
  }
  #labels,
  .groups {
    padding: 1em;
  }
  #labels > div {
    padding: 1em;
    font-size: 1.2em;
    cursor: pointer;
  }
  #labels > div.selected {
    background: #f26e21;
    color: white;
  }
  #labels > div > span {
    margin-left: 1em;
  }
  #contacts > div {
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }
  #contacts > div:nth-of-type(2) {
    margin-right: 0.5em;
  }
  .groups > button {
    display: block;
    margin-left: 1em;
  }
  .groups > button > span {
    padding: 1em;
    font-size: 1.2em !important;
  }
  .groups > div > div {
    font-size: 1.2em;
  }
  .groups > div > div > div > div {
    padding: 1em;
  }
  .groups > div > div > div > div > span {
    margin-left: 1em;
  }
  .groups > div {
    cursor: pointer;
  }
  .groups .selected {
    background: #f26e21 !important;
    color: white !important;
  }
  .Collapsible__trigger {
    cursor: pointer;
  }
  .is-closed h3:after {
    content: "↓";
    font-size: 1em;
    color: black;
    margin-left: 0.5em;
  }
  .is-open h3:after {
    content: "↑";
    font-size: 1em;
    color: black;
    margin-left: 0.5em;
  }
  @media (min-width: 600px) {
    #contacts {
      grid-template-columns: 25% 75%;
      grid-gap: 1%;
    }
  }
  @media (max-width: 840px) {
    padding: 0rem 1rem 2rem;
  }
  @media (min-width: 1500px) {
    #contacts > div:nth-of-type(2) {
      margin-right: 1em;
    }
  }

  .field-input {
    font-size: 18px;
    border: 0;
    border-bottom: 2px solid #ccc;
    font-family: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 0;
    padding: 5px;
    cursor: text;
    line-height: 1.8;

    padding: 5px 0;
    width: 100%;
    display: block;
    text-indent: 5px;
  }
`;
export default function index() {
  const [selectedLabel, setSelectedLabel] = useState("Contacts");
  const [currentContacts, setCurrentContacts] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [isNewContactModalVisible, setNewContactModalVisible] = useState(false);
  const [isEditGroupModalVisible, setEditGroupModalVisible] = useState(false);
  const [isNewGroupModalVisible, setIsNewGroupModalVisible] = useState(false);
  const [isJoinedGroupModalVisible, setJoinedGroupModalVisible] = useState(
    false
  );
  const [isNewAppGroupModalVisible, setIsNewAppGroupModalVisible] = useState(
    false
  );
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedGroupByVendorOptions, setSelectedGroupbyVendorOptions] = useState([]);
  const [selectedGroupByVendor, setSelectedGroupbyVendor] = useState(null);
  const [isAppGroupEditMode, setIsAppGroupEditMode] = useState(false);
  const [currentAppGroup, setCurrentAppGroup] = useState(null);
  const {
    auth,
    groups,
    groupMembers,
    contacts,
    loading,
    vendors,
    userTypes,
    vendorForms,
    parents,
    form: { formList = [], updateSubmittedForm, customApplicationHistory, formAppGroups, addForm },
  } = useSelector(
    ({ auth, groups, groupMembers, contacts, loading, vendors, userTypes, vendorForms, parents, form }) => {
      return {
        auth,
        groups,
        groupMembers,
        contacts,
        loading,
        vendors,
        userTypes,
        vendorForms,
        parents,
        form
      };
    }
  );


  console.log('formListzzzzzzzz', formList)

  console.log('vendorForms', vendorForms)

  const dispatch = useDispatch();
  useEffect(() => {
    if (auth.email) {
      dispatch(requestUserGroup(auth.email));
      dispatch(requestUserVendorForms(auth.user_id));



    }
    if (contacts) {
      setCurrentContacts(contacts);
    }
  }, [contacts]);

  useEffect(() => {
    if (auth.user_id && (!vendors.length || (typeof vendors === 'object' && !Object.keys(vendors).length))) {
      dispatch(requestVendor(auth.user_id));
    }
  }, [auth])



  useEffect(() => {
    dispatch(getContact(auth.email));

    setCurrentContacts(contacts);
  }, []);




  useEffect(() => {
    if (vendors && Array.isArray(vendors) && vendors.length > 0) {

      const hasDefaultVendor = vendors.find(item => item.is_default);

      if (hasDefaultVendor?.id) {

        let filteredGroups = groups?.application_groups && groups.application_groups.filter(item => item.vendor === hasDefaultVendor?.id)
        setSelectedVendor(hasDefaultVendor?.id);
        if (filteredGroups && filteredGroups[0]) {
          setSelectedGroupbyVendor(isVendorMode ? '' : filteredGroups[0].app_grp_id)
        }

        filteredGroups = filteredGroups.map(item => {
          return {
            ...item,
            value: item.app_grp_id
          }
        })



        dispatch(requestParentByVendor({
          vendor: hasDefaultVendor?.id,
          app_group_id: '',//filteredGroups && filteredGroups[0] && filteredGroups[0].app_grp_id,
          vendor_mode: true
        }))

        if (formList.length === 0) {
          dispatch(requestGetForms({
            vendor: hasDefaultVendor?.id,
            currentUser: auth.user_id,
            isOwner: !!(auth.user_id == hasDefaultVendor?.user),
            categories: []
          }))
        }
        else if(formList.length > 0){
          const updatedForms = formList.map(item => {
            return {
              ...item,
              name: item?.form_contents?.formTitle,
              value: item.form_id,
              is_form: true
            }
          });
    
          filteredGroups = [...filteredGroups, ...updatedForms ];

  
        }

        setSelectedGroupbyVendorOptions([...filteredGroups ]);
      }

    }



  }, [vendors, groups]);


  useEffect(() => {
    console.log('formList',formList)
    if (formList.length > 0) {
      const updatedForms = formList.map(item => {
        return {
          ...item,
          name: item?.form_contents?.formTitle,
          value: item.form_id,
          is_form: true
        }
      });

      setSelectedGroupbyVendorOptions([...selectedGroupByVendorOptions, ...updatedForms])
    }
  }, [formList])




  // if(groups.status == "success") {
  //   window.location.reload();
  // }

  const [appGroups, setAppGroups] = useState([]);
  const [apiStatus, setApiStatus] = useState();
  const [selectedForms, setSelectedForms] = useState([]);
  const [formattedVendors, setFormattedVendors] = useState([]);
  const [appGroupDetails, setAppGroupDetails] = useState();

  useEffect(() => {

    if (groups && groups.application_groups && groups.application_groups.length > 0) {
      let ap = [];
      let oAp = [];

      let newAp = []

      ap = groups.application_groups;
      oAp = groups.application_groups;

      console.log("ap1", ap);
      console.log("oAp", oAp);

      ap = ap.filter((elem, index) =>
        ap.findIndex(obj => obj.pool_id === elem.pool_id) === index);


      for (const [i, gr] of ap.entries()) {
        const members = oAp.filter((x) => {

          //if(x.members) delete x.members;
          return x.pool_id == gr.pool_id && gr.app_grp_id != x.app_grp_id;
        });

        console.log("members", members);

        ap[i].members = members;
        // console.log("gr gr", gr);
      }

      console.log("ap", ap);

      setAppGroups(ap);
      setApiStatus(groups.status);
    }
  }, [groups])

  useEffect(() => {

    const formList = vendorForms.formList;

    console.log("vendors.formList", vendorForms.formList);
    console.log('formList', formList)
    const formattedVendors = getFormattedVendors(formList);

    setFormattedVendors(formattedVendors);

  }, [vendorForms.formList])

  const getFormattedVendors = (formList) => {
    let updatedForms = uniqBy(formList, 'id');

    const formattedVendors = updatedForms.map(item => {
      return {
        id: item.id,
        name: item.name,
        label: item.name,
        is_form: item.is_form
      }
    });
    return formattedVendors;
  }

  console.log("groups", groups);
  console.log("vendorForms", vendorForms);

  // const selectedGroup = groups.find(group => group.id === selectedGroupId);
  // const filteredContacts = contacts.filter(contact => {
  //   if (selectedGroupId === 0) {
  //     return true;
  //   }
  //   return (
  //     selectedGroup &&
  //     selectedGroup.contacts &&
  //     selectedGroup.contacts.includes(contact.id)
  //   );
  // });

  // const handleSelectedLabel = value => {
  //   setSelectedLabel(value);

  //   if (value === "Duplicates") {
  //     setCurrentContacts(getDuplicateContacts());
  //   } else {
  //     setCurrentContacts(filteredContacts);
  //   }
  // };

  const getDuplicateContacts = () => {
    return contacts && contacts.length > 0
      ? contacts.filter(item => {
        const currentItem = contacts.find(
          subItem =>
            subItem.phone_number === item.phone_number &&
            subItem.id !== item.id
        );
        if (currentItem) {
          return item;
        }
      })
      : [];
  };

  const handleSelectedGroup = group => {
    //setSelectedGroupId(group.id);
    setSelectedGroup(group);

    if (group) {
      dispatch(requestMembers(group.id));

      setTimeout(() => {
        setEditGroupModalVisible(true);
      }, 500);
    }
  };

  const handleJoinedGroupModal = group => {
    setSelectedGroup(group);
    setJoinedGroupModalVisible(true);
  };
  const editGroupSubmit = data => { };

  const getSelectedForms = (currentAppGroup) => {

    let selectedForms = [];
    if (currentAppGroup && (currentAppGroup.vendor || currentAppGroup.form)) {

      if (currentAppGroup.vendor) {
        selectedForms = [...selectedForms, currentAppGroup.vendor];
      } else if (currentAppGroup.form) {
        selectedForms = [...selectedForms, currentAppGroup.form];
      }

      if (currentAppGroup.members && currentAppGroup.members.length > 0) {
        const members = currentAppGroup.members;

        for (const member of members) {
          if (member.vendor) {
            selectedForms = [...selectedForms, member.vendor];
          } else if (member.form) {
            selectedForms = [...selectedForms, member.form];
          }
        }
      }
    }

    return selectedForms;
  }

  const handleAppGroupDetails = () => {

  }
  console.log('vendorForms', vendorForms)
  const handleAppGroupModal = group => {
    // if(vendorForms.formList.length > 0) {
    setCurrentAppGroup(group);
    setIsAppGroupEditMode(true);
    let sForms = getSelectedForms(group);

    console.log('vendorForms', vendorForms)
    const formattedVendors = getFormattedVendors(vendorForms.formList);
    sForms = formattedVendors.filter((form) => {
      return sForms.includes(form.id)
    });
    console.log("group group", group);
    console.log("formattedVendors", formattedVendors);
    console.log("sForms", sForms);

    setSelectedForms(sForms);
    setAppGroupDetails({ ...appGroupDetails, ["vendors"]: sForms });
    setApiStatus("");
    setIsNewAppGroupModalVisible(true);
    // setTimeout(() => {
    //   setIsNewAppGroupModalVisible(true);
    // }, 500);

    // }
  };

  const handleCloseModal = () => {
    setCurrentAppGroup();
    setApiStatus("");
  }

  const isVendor = () => {
    const currentUserType = userTypes.filter(type => {
      return type.id === auth.type;
    })[0];

    if (currentUserType.name != "VENDOR") {
      return false;
    }

    return true;
  };

  const isVendorMode = isVendor();

  const isForm = selectedGroupByVendor && selectedGroupByVendorOptions &&  selectedGroupByVendorOptions.find(item => (item.value === selectedGroupByVendor) && item.is_form);
        

  return (
    <MyContactsStyled>
      <NewContactModal
        contacts={contacts}
        groups={(groups && groups.created_groups) || []}
        isVisible={isNewContactModalVisible}
        toggleCreateContactModal={setNewContactModalVisible}
        auth={auth}
      />
      <NewGroupModal
        isVisible={isNewGroupModalVisible}
        toggleCreateGroupModal={setIsNewGroupModalVisible}
        contacts={contacts}
        auth={auth}
      />

      <JoinedGroupModal
        auth={auth}
        group={selectedGroup}
        isVisible={isJoinedGroupModalVisible}
        toggleJoinGroupModalVisible={setJoinedGroupModalVisible}
      />

      <EditGroupModal
        auth={auth}
        contacts={contacts}
        groupMembers={groupMembers}
        group={selectedGroup}
        isVisible={isEditGroupModalVisible}
        isGroupLoading={loading.group}
        isGroupMemberLoading={loading.groupMembers}
        onSubmit={editGroupSubmit}
        toggleEditGroupModal={setEditGroupModalVisible}
      />

      <NewAppGroupModal
        currentAppGroup={currentAppGroup}
        isEditMode={isAppGroupEditMode}
        isVisible={isNewAppGroupModalVisible}
        toggleCreateAppGroupModal={setIsNewAppGroupModalVisible}
        vendors={vendorForms.formList}
        auth={auth}
        errorMessage={groups.message}
        status={apiStatus}
        handleCloseModal={handleCloseModal}
        selectedForms={selectedForms}
        formattedVendors={formattedVendors}
      />

      <h2>Contacts </h2>
      <div id="contacts">
        <div>


          {isVendorMode && (
            loading.groupMembers ? <Loading /> :
              <div className="groups">
                <Collapsible
                  trigger={<h3>Application Groups</h3>}
                  open
                  lazyRender>
                  <hr />
                  {appGroups &&
                    appGroups.map(group => (
                      <div
                        // style={{"color": vendorForms.formList.length > 0 ? "rgb(68, 68, 68)" : "darkgrey"}}
                        className={`${group.id === selectedGroupId ? "selected" : ""
                          }`}
                        key={group.app_grp_id}
                        onClick={() => {
                          // if(vendorForms.formList.length > 0) {
                          //   handleAppGroupModal(group);
                          // }
                          handleAppGroupModal(group);
                        }}>
                        <FontAwesomeIcon icon={faUsers} />
                        <span>{group.name}</span>
                      </div>
                    ))}
                </Collapsible>
                <hr />
                <button
                  disabled={!vendorForms.formList.length > 0}
                  onClick={() => {
                    if (vendorForms.formList.length > 0) {
                      setIsAppGroupEditMode(false);
                      setSelectedForms([]);
                      setTimeout(() => {
                        setIsNewAppGroupModalVisible(true);
                      }, 500);
                    }
                  }}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span> ADD NEW GROUP</span>
                </button>
              </div>
          )}
        </div>
        <div>
          <div>

            <div className="field">

            </div>
            {loading.contacts ? (
              <Loading />
            ) : (
              <ContactList
                auth={auth}
                headerText={selectedLabel}
                contacts={currentContacts}
                groups={(groups && groups.created_groups) || []}
                setNewContactModalVisible={setNewContactModalVisible}
                EditContactModal={EditContactModal}
                ProfileModal={ProfileModal}
                SendMessageModal={SendMessageModal}
              />
            )}
          </div>



          <div style={{ padding: 12 }}>
            <h3>Parents </h3>


            <div style={{ paddingTop: 12, paddingBottom: 12 }}>
              <select
                id="vendor-list"
                className="field-input"
                value={selectedVendor}
                onChange={(e) => {

                  const filteredGroups = groups?.application_groups && groups.application_groups.filter(item => item.vendor === e.target.value)

                  dispatch(requestParentByVendor({
                    vendor: e.target.value,
                    app_group_id: null,
                    vendor_mode: true
                  }))
                  setSelectedVendor(e.target.value);
                  setSelectedGroupbyVendorOptions(filteredGroups);

                }}
              >
                {Array.isArray(vendors) && vendors.map(item => {
                  return <option value={item.id}>{item.name}</option>
                })}

              </select>
            </div>


            <div style={{ paddingTop: 12, paddingBottom: 12 }}>
              <select
                id="vendor-group-list"
                className="field-input"
                value={selectedGroupByVendor}
                onChange={(e) => {
                  
                  const isCustomForm  =  selectedGroupByVendorOptions &&  selectedGroupByVendorOptions.find(item => (item.value === e.target.value) && item.is_form);
                  dispatch(requestParentByVendor({
                    vendor: selectedVendor,
                    app_group_id: e.target.value || '',
                    form_type: isCustomForm ? 'forms' : 'mentoring',
                    vendor_mode: true
                  }))
                  setSelectedGroupbyVendor(e.target.value);
                }}
              >
                {isVendorMode && <option value="">All</option>}
                {Array.isArray(selectedGroupByVendorOptions) && selectedGroupByVendorOptions.map(item => {
                  return <option value={item.value}>{item.name}</option>
                })}

              </select>
            </div>
            {parents.isParentContactLoading ? (
              <Loading />
            ) :

              // parents.contacts.map(parent => {
              //   return <ParentContacts
              //     contactDetails={parent}
              //   />
              // })
              <div tyle={{ padding: 12 }}>

                <ParentContacts
                  parents={parents}
                  selectedVendor={selectedVendor}
                  isForm={isForm}
                />
              </div>


            }
          </div>
        </div>


      </div>
    </MyContactsStyled>
  );
}
