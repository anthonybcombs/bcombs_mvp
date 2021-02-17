import React from 'react'
import styled from "styled-components";

const CustomSelectStyled = styled.div``;

export default ({
  value, options = [], placeholder = '', icon, onChange,
  isMultiple = false // coming soon
}) => {
  return (
    <CustomSelectStyled>
      {
        icon && icon
      }
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
    </CustomSelectStyled>
  )
}