import React, { useState } from "react";
import SearchModal from "./modal";
import styled from "styled-components";
const SearchStyled = styled.div`
  position: relative;
  margin: 10px 0 10px 0;
  input:invalid {
    box-shadow: none;
  }
`;
export default function index() {
  const [isModalVisible, setModalVisible] = useState(false);
  const handleModalVisibility = (status) => {
    setModalVisible(status);
  };
  return (
    <SearchStyled>
      <button
        onClick={() => {
          handleModalVisibility(true);
        }}
      >
        Show
      </button>
      <SearchModal
        isVisible={isModalVisible}
        toggleSearchModal={handleModalVisibility}
      />
    </SearchStyled>
  );
}
