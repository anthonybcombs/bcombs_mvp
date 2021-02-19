import React from 'react'
import styled from "styled-components";

const CustomSelectStyled = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1.65px solid #ccc;

  >svg {
    color: grey;
  }

  .select-field-wrapper {
    position: relative;
  }
  .select-field-wrapper:after {
    content: "\f078";
    position: absolute;
    right: 0;
    bottom: 18px;
    font-size: 10px;
    color: #555;
    font-family: "fontawesome";
  }
  .select-field-wrapper select {
    position: relative;
    border: 0;
    cursor: text;
    color: #555;
    width: 100%;
    width: 200px;
    padding: 5px 0;
    font-size: 16px;
    line-height: 1.8;
    border-radius: 0;
    text-indent: 5px;
    font-family: inherit;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
  }

`;

export default ({
  value, options = [], placeholder = '', icon, onChange,
  isMultiple = false // coming soon
}) => {
  return (
    <CustomSelectStyled>
      {
        icon && icon
      }
      <div className="field select-field-wrapper">
        <select
          value={value}
          onChange={onChange}
        >
          {
            placeholder && (
              <option value=''>{placeholder}</option>
            )
          }
          {
            options.map(({ value: optionValue, label }, index) => {
              return (
                <option key={`option-${index}`} value={optionValue}>{label}</option>
              )
            })
          }
        </select>
      </div>
    </CustomSelectStyled>
  )
}