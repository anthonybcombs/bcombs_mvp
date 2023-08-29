import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { requestUpdateParentPermissionByVendor } from "../../../../redux/actions/Parents";

import { s3BucketRootPath } from '../../../../constants/aws';

const ParentProfileModal = styled.div`
  .modal-content {
    max-width: 420px;
    text-align: center;
  }
  .profile-image > img {
    height: 100px;
    width: 100px;
    border-radius: 100px;
    object-fit: cover;
    box-shadow: 0 3px 6px #ddd;
    border: 1px solid #ec6e33;
  }
  h3, p {
    padding: 0;
    margin: .5rem;
  }
  .profile-details {
    text-align: left;
  }
  .profile-details h3 {
    color: #ec6e33;
    text-align: center;
    margin-bottom: 1.3rem;
  }
  .profile-details label {
    color: grey;
  }

  button  {
    background-color: #f26e21 !important;
    border-color: #f26e21 !important;
    border-radius: 10px !important;
    color: white !important;
  }
`;

const defaultImage = 'data:image/png;base64,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'
export default function index({
  isVisible = true,
  isUserMode = false,
  toggleProfileModal,
  parent,
  selectedVendor
}) {

  const dispatch = useDispatch();
  const [isSharedByVendor, setIsSharedByVendor] = useState(false);
  //   useEffect(() => {
  //     setContactDetails({
  //       ...contact,
  //       selectedGroups: groups
  //         .filter(group => group.contacts.includes(contact.id))
  //         .map(group => group.id)
  //     });
  //   }, [contact, isVisible]);

  useEffect(() => {
    if (isVisible && parent) {
      setIsSharedByVendor(parent.is_vendor_allow_shared)
    }
    else {
      setIsSharedByVendor(false);
    }
  }, [parent]);

  const handleSubmit = () => {

    dispatch(requestUpdateParentPermissionByVendor({
      vendor_id: selectedVendor,
      parents: [{
        parent_id: parent.parent_id,
        is_vendor_allow_shared: isSharedByVendor ? 1 : 0
      }]
    }))

    setTimeout(() => {
      toggleProfileModal();
    }, 1500);
  }
  if (!isVisible) {
    return <></>;
  }

  console.log('parent',parent)

  return ReactDOM.createPortal(
    <ParentProfileModal className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>My Profile</h2>
          <span
            className="close"
            onClick={() => {
              toggleProfileModal();
            }}>
            &times;
          </span>
        </div>

        <div className="modal-body">
          <div className="profile-image">
            <img src={parent?.image ? `${s3BucketRootPath}/${parent?.image}` : defaultImage} />
          </div>
          <div className="profile-details">
            <h3>
              {parent?.firstname || ''} {parent?.lastname || ''}
            </h3>
           

            {parent?.is_parent_allow_shared && <>
              <p><label>Email:</label> {parent.email_address}</p>
              <p><label>Phone Number:</label> {parent.phone_number}</p>
              <p><label>Live Area:</label> {parent.live_area}</p>
              <p><label>Address:</label> {parent.address}</p>
              <p><label>City:</label> {parent.city}</p>
              <p><label>State:</label> {parent.state}</p>
              <p><label>Zip Code:</label> {parent.zip_code}</p>
              <p><label>Occupation:</label> {parent.occupation}</p>
              <p><label>Employer Name:</label> {parent.employer_name}</p>
              <p><label>Parent Goals:</label> {parent.parent_goals}</p>
              <p><label>Parent Child Goals:</label> {parent.parent_child_goals}</p>
              <p><label>Level of Education:</label> {parent.level_of_education}</p>
              <p><label>Child HS Grad:</label> {parent.child_hs_grad}</p>
              <p><label>Child College Grad:</label> {parent.child_col_grad}</p>


              <p><label>Age:</label> {parent.age}</p>
              <p><label>Birthdate:</label> {parent.birthdate}</p>
              <p><label>Ethnicities:</label> {parent.ethnicities}</p>

            </>}
            <p><label>Parent Share Information:</label> {parent?.is_parent_allow_shared ? 'Yes' : 'No'}</p>
            <p><label>Vendor Share Information:</label>

              {isUserMode ? <span>{parent.is_vendor_allow_shared ? 'Yes' : 'No'}</span> : parent?.is_parent_allow_shared && <input onChange={() => {
                setIsSharedByVendor(!isSharedByVendor)
              }} type="checkbox" checked={isSharedByVendor} />}

              

            </p>


            {!isUserMode && parent?.is_parent_allow_shared && <div style={{ display: 'flex', flexDirection: 'flex-end' }}>
              <button  onClick={handleSubmit} type="button" style={{ margin: '0 auto' }}>Update Permission</button>
            </div>}

          </div>
        </div>
      </div>
    </ParentProfileModal>,
    document.getElementById("modal")
  );
}
