import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import AdminStyled from '../index';

const AdminFormModal = styled.div`
  .modal-content {
    max-width: 1000px;
  }
`

export default function index({
  handleExit,
  isCustomForm = false,
  isLot = false
}) {

  return (
    <AdminFormModal>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <span onClick={handleExit} className="close">
              &times;
            </span>
          </div>
          <div className="modal-container">
            <AdminStyled
              isLot={isLot}
              isCustomForm={isCustomForm}
            />
          </div>
        </div>
      </div>
    </AdminFormModal>
  )
}