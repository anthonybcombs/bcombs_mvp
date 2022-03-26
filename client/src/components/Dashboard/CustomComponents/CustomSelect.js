import React from 'react'
import styled from 'styled-components'
import { Multiselect } from 'multiselect-react-dropdown'

const CustomSelectStyled = styled.div`
  display: flex;
  align-items: center;

  .select-field-wrapper {
    border-bottom: 1.65px solid #ccc;
  }

  >svg {
    color: grey;
  }

  .select-field-wrapper {
    position: relative;
    ${props => props.isCenter ? 'margin: 0 auto' : ''}

  }
  .select-field-wrapper:after {
    content: '\f078';
    position: absolute;
    right: 0;
    bottom: 18px;
    font-size: 10px;
    color: #555;
    font-family: 'fontawesome';
    pointer-events: none;
    
  }
  .select-field-wrapper select {
    position: relative;
    border: 0;
    cursor: text;
    color: #555;
    width: 100%;
    min-width: 200px;
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
  isMultiple = false, onRemove, closeOnSelect = false,
  showCheckbox = true, autcomplete = false, displayValue, isObject = true,
  selectStyle = {}, disabled = false, isCenter = false
}) => {
  return (
    <CustomSelectStyled isCenter={isCenter}>
      {
        icon && icon
      }
      <div className='field select-field-wrapper'>
        {
          !isMultiple ? (
            <select
            disabled={disabled}
              style={selectStyle}
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
          ) : (
            <Multiselect
              isObject={isObject}
              options={options}
              onSelect={onChange}
              onRemove={onRemove}
              displayValue={displayValue}
              closeIcon='cancel'
              placeholder={placeholder}
              closeOnSelect={closeOnSelect}
              showCheckbox={showCheckbox}
              autcomplete={autcomplete}
              selectedValues={value}
            />
          )

        }
      </div>
    </CustomSelectStyled>
  )
}