import React, { useState } from "react";
// import Popover, { ArrowContainer } from "react-tiny-popover";
// import { useDispatch } from "react-redux";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPen, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
// import { removeContact } from "../../../../redux/actions/Contacts";


import { faEye } from "@fortawesome/free-solid-svg-icons";


import ParentProfileModal from './profile';
// display: grid;
// grid-template-columns: repeat(4, 1fr);
// grid-gap: 1%;
const ParentContactStyled = styled.div`
    #parent-list {
        text-align: center;
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
        border: 0;
    }
  
    #parent-list td, #groups th {
        border: 0;
        padding: 15px;
    }
  
    #parent-list tr:nth-child(odd){background-color: #f9f9f9;}
  
    // #parent-list tr:hover {background-color: #ddd;}
  
    #parent-list th {
        text-align: center;
        background-color: #f26e21;
        color: white;
    }

    #parent-list a {
        color: #3e89fe;
        text-decoration: none;
    }
`;

export default function index({
    parents,
    isUserMode = false,
    selectedVendor
}) {


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentParent, setCurrentParent] = useState(null);

    const handleModalChange = () => {
        if (!!isModalVisible) {
            setCurrentParent(null);
        }
        setIsModalVisible(!isModalVisible);
    }

    return (
        <ParentContactStyled>
            <table id="parent-list" style={{ width: '100%' }}>
                <tbody style={{ textAlign: 'center' }}>
                    <tr style={{ padding: 8 }}>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone No.</th>
                        <th>Shared Contact Information</th>
                        {!isUserMode && <th>Shared by Vendor</th>}
                        {!isUserMode && <th>Has Account</th>}
                        <th>Action</th>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {!isUserMode && <td></td>}
                        {!isUserMode && <td></td>}
                        <td></td>
                    </tr>
                    {
                        parents?.contacts && parents.contacts.map((parent, index) => {
                            return <tr key={index} style={{ padding: 8 }}>
                                <td>
                                    {`${parent.firstname || ''} ${parent.lastname || ''}`}
                                </td>
                                <td>
                                    {parent.email_address}
                                </td>
                                <td>
                                    {parent.phone_number}
                                </td>
                                <td>
                                    {parent.is_parent_allow_shared ? 'Yes' : 'No'}
                                </td>
                                {!isUserMode && <td>
                                    {parent.is_vendor_allow_shared ? 'Yes' : 'No'}
                                </td>}
                                {!isUserMode && <td>
                                    {parent.is_profile_filled ? 'Yes' : 'No'}
                                </td>}
                                <td>

                                    <a
                                        href="#"
                                        onClick={() => {
                                            setCurrentParent(parent);
                                            setIsModalVisible(true);

                                        }}>
                                        View <FontAwesomeIcon icon={faEye} /> 
                                    </a>
                                </td>
                            </tr>
                        })
                    }

                </tbody>
            </table>

            <ParentProfileModal
                isVisible={isModalVisible}
                parent={currentParent}
                toggleProfileModal={handleModalChange}
                isUserMode={isUserMode}
                selectedVendor={selectedVendor}
            />
        </ParentContactStyled>
    );
}
