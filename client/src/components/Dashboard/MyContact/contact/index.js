import React, { useState } from "react";
import Popover, { ArrowContainer } from "react-tiny-popover";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { removeContact } from "../../../../redux/actions/Contacts";
const ContactStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1%;
  height: 4em;
  padding: 0.3em;
  margin: 0.5em 0 0.5em 0;
  div:nth-of-type(1) {
    display: flex;
  }
  div:nth-of-type(1) > img {
    border-radius: 50%;
    width: 4em;
    height: 4em;
  }
  div:nth-of-type(1) > p {
    margin-top: 0.8em;
    margin-left: 5px;
  }
  div:nth-of-type(1) > p > span:nth-of-type(2) {
    color: grey;
  }
  div:nth-of-type(2) p,
  div:nth-of-type(3) p {
    text-align: center;
    color: grey;
  }
  div:nth-of-type(4) {
    display: flex;
    justify-content: flex-end;
  }
  div:nth-of-type(4) button {
    display: block;
    margin-top: -1em;
  }
`;
const ContactSettingPopOverStyled = styled.div`
  background-color: white;
  border: 2px solid lightgrey;
  width: 200px;
  button {
    background: none;
    border: none;
    box-shadow: none;
    width: 100%;
    font-size: 0.8em
    margin:1em;
  }
`;
export default function index({
  isSelected,
  contactDetails,
  setSelectedContactId,
  setisEditContactModalVisible,
  setIsProfleModalVisible,
  setSendMessageModalVisible,
  setTypeOfFormUsedInEditContact
}) {
  const [isContactSettingVisible, setIsContactSettingVisible] = useState(false);
  const dispatch = useDispatch();
  const handleContactSettingVisible = () => {
    setIsContactSettingVisible(!isContactSettingVisible);
  };
  const handleRemoveContact = () => {
    console.log("ContactDetailss", contactDetails);
    dispatch(removeContact(contactDetails));
  };

  return (
    <ContactStyled
      className={`${isSelected ? "selected" : ""}`}
      onMouseEnter={() => {
        setSelectedContactId(contactDetails.id);
      }}>
      <div>
        <img src="https://i.picsum.photos/id/1043/200/300.jpg" />
        <p>
          <span>
            {contactDetails.first_name} {contactDetails.last_name}
          </span>
          <br />
          <span>{contactDetails.relation}</span>
        </p>
      </div>
      <div>
        <p>{contactDetails.email}</p>
      </div>
      <div>
        <p>{contactDetails.phone_number}</p>
      </div>
      <div>
        <button
          onClick={() => {
            setisEditContactModalVisible(true);
          }}>
          <FontAwesomeIcon icon={faPen} />
        </button>
        <Popover
          isOpen={isContactSettingVisible}
          position={"left"}
          onClickOutside={() => handleContactSettingVisible()}
          content={({ position, targetRect, popoverRect }) => (
            <ArrowContainer
              position={position}
              targetRect={targetRect}
              popoverRect={popoverRect}
              arrowColor="white"
              arrowSize={10}
              arrowStyle={{ opacity: 1 }}
              arrow="center">
              <ContactSettingPopOverStyled
                onMouseLeave={() => handleContactSettingVisible()}>
                <button
                  onClick={() => {
                    setIsProfleModalVisible(true);
                  }}>
                  View profile
                </button>
                <button
                  onClick={() => {
                    setSendMessageModalVisible(true);
                  }}>
                  Send message
                </button>
                <button onClick={handleRemoveContact}>Remove Contact</button>
                {/* <button
                  onClick={() => {
                    setTypeOfFormUsedInEditContact("Add To Group");
                    setisEditContactModalVisible(true);
                  }}>
                  Add to Group
                </button> */}
              </ContactSettingPopOverStyled>
            </ArrowContainer>
          )}>
          <button
            onClick={() => {
              handleContactSettingVisible();
            }}>
            <FontAwesomeIcon icon={faEllipsisH} />
          </button>
        </Popover>
      </div>
    </ContactStyled>
  );
}
