import React, { useState } from "react";
import { useSelector } from "react-redux";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchModal from "./modal";
import styled from "styled-components";
const SearchStyled = styled.div`
  position: relative;
  margin: 10px 0 10px 0;
  input:invalid {
    box-shadow: none;
  }
  .advancedSearchButton {
    position: absolute;
    right: 0;
    top: -55px;
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    color: white;
    border: none;
    width: 50px;
  }
`;
export default function index({ handleCalendarSelection }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const { calendars } = useSelector(({ calendars }) => {
    return { calendars };
  });
  const handleModalVisibility = (status) => {
    setModalVisible(status);
  };
  return (
    <SearchStyled>
      <button
        className="advancedSearchButton"
        onClick={() => {
          handleModalVisibility(true);
        }}
      >
        <FontAwesomeIcon icon={faSearch} size="2x" />
      </button>
      <SearchModal
        calendars={calendars}
        isVisible={isModalVisible}
        toggleSearchModal={handleModalVisibility}
        handleCalendarSelection={handleCalendarSelection}
      />
    </SearchStyled>
  );
}
