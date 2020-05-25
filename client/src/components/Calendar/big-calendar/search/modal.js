import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import SearchForm from "./form";
const ModalStyled = styled.div`
  h2 {
    text-align: center;
  }
  .modal-content {
    margin: 1em auto;
    width: 50%;
  }
`;
export default function modal({ isVisible = true, toggleSearchModal }) {
  if (!isVisible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <ModalStyled className="modal">
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleSearchModal(false);
          }}
        >
          &times;
        </span>
        <h2>Advanced Search</h2>
        <SearchForm />
      </div>
    </ModalStyled>,
    document.getElementById("modal")
  );
}
