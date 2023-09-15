import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import styled from "styled-components";

import ParentContacts from "../MyContact/parentContacts";

import { requestParentByVendor } from "../../../redux/actions/Parents";

const ParentContactStyled = styled.form`
    padding: 12px !important;
    .field-label {
        font-size: 14px;
        color: #4b525a;
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

    .field-input:placeholder-shown + .field-label {
        overflow: hidden;
        transform-origin: left bottom;
        transform: translate(0, 2.125rem) scale(1.4);
    }

    .field-input::placeholder {
        opacity: 0;
        transition: inherit;
        font-size: 12px;
    }

    .field-input:focus::placeholder {
        opacity: 1;
    }

    .field-input:focus + .field-label {
        transform: translate(0, 0) scale(1);
        cursor: pointer;
        margin-bottom: 5px;
        font-weight: bold;
    }
  `;

//  formType = 'mentoring'
const getParentVendorByParentEmail = async (parentEmail) => {
    const response = await fetch(`${process.env.API_HOST}/api/parentvendor?email=${parentEmail}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',

    });
    return response.json();
}

const ParentContactList = props => {

    const dispatch = useDispatch();

    const [parentVendors, setParentVendors] = useState([]);
    const [parentVendorsGroups, setParentVendorGroups] = useState([]);
    const [filteredParentVendorsGroups, setFilteredParentVendorGroups] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const { auth, parents, userTypes } = useSelector(state => {
        return {
            auth: state.auth,
            parents: state.parents,
            userTypes: state.userTypes

        }
    });

    console.log('authhhh', auth)



    const triggerApi = async email => {
        try {
            const response = await getParentVendorByParentEmail(email);
    
            if (response?.vendors) {
                const vendorId = response?.vendors[0]?.vendor_id;
                setParentVendors(response?.vendors || [])
                setSelectedVendor(response?.vendors[0]?.vendor_id)

                if (response?.vendorAppGroups) {
        
                    const filteredGroup = response?.vendorAppGroups.filter(item => item.vendor_id === vendorId)
                    setParentVendorGroups(response?.vendorAppGroups || [])
    
                    setFilteredParentVendorGroups(filteredGroup);
                    if(filteredGroup && filteredGroup[0]) {
                        console.log('filteredGroupzzz',filteredGroup)
                        setSelectedGroup(filteredGroup[0].app_grp_id)
                    }
                  
      
                }
            }
           
        

        } catch (err) {
            console.log('Trigger API Error', err)
        }
    }

    useEffect(() => {
        if (auth.email) {

            triggerApi(auth.email);
        }
    }, [auth])

    useEffect(() => {
        if (parentVendors.length > 0 && selectedVendor ) {
            console.log('selectedGroup',selectedGroup)

            const formType = filteredParentVendorsGroups.find(item => item.app_grp_id === selectedGroup);
            dispatch(requestParentByVendor({
                vendor: selectedVendor,
                app_group_id: selectedGroup,
                form_type: formType?.is_custom_form ? 'forms' : 'mentoring'
            }))
        }

    }, [parentVendors, filteredParentVendorsGroups, selectedVendor, selectedGroup]);

    const formattedParents = parents?.contacts ? parents.contacts.filter(item => item.email_address !== auth.email) : [];

    const userType = userTypes && userTypes.find(item => item.name === 'USER')

    // const handleSelectVendorAndGroup = (vendorId, groupId) => {
    //     dispatch(requestParentByVendor({
    //         vendor: vendorId,
    //         app_group_id: groupId
    //     }));
    // }


    console.log('filteredParentVendorsGroups',filteredParentVendorsGroups)
    return <ParentContactStyled>
        <div style={{ padding: 15, fontSize: 15 }}>
            {/* <select className="form-control" value={selectedVendor} onChange={(value) => {
            handleSelectVendor(value)
        }}>
            {parentVendors.map(item => {
                return <option value={item.vendor_id}>{item.name}</option>
            })}
        </select> */}

            <div className="field">
                <select
                    id="vendor-list"
                    className="field-input"
                    value={selectedVendor} 
                    onChange={(e) => {
                     //   handleSelectVendorAndGroup(e.target.value,selectedGroup)
                        setSelectedVendor(e.target.value)

                        const filterdGroup = parentVendorsGroups.filter(item => item.vendor_id === e.target.value)
                        setFilteredParentVendorGroups(filterdGroup)
                    }}
                >

                    {parentVendors.map(item => {
                        return <option value={item.vendor_id}>{item.name}</option>
                    })}
                </select>
            </div>


            
            <div className="field">
                <select
                    id="vendor-list"
                    className="field-input"
                    value={selectedGroup} 
                    onChange={(e) => {
                    //     handleSelectVendorAndGroup(selectedVendor, e.target.value)
                        setSelectedGroup(e.target.value)
                  
                    }}
                >

                    {filteredParentVendorsGroups.map(item => {
                        return <option value={item.app_grp_id}>{item.name}</option>
                    })}
                </select>
            </div>
        </div>
        <ParentContacts 
            isUserMode={userType && auth && (auth.type === userType.id)} 
            parents={{
                contacts: formattedParents
       
            }} 
            
            selectedVendor={selectedVendor}    
        />
    </ParentContactStyled>
};

export default ParentContactList;