import React from "react";
import styled from "styled-components";
import { Multiselect } from "multiselect-react-dropdown";

const CustomMultiSelectContainer = styled.div`
  input {
    background: none;
    width: auto !important;
    color: black;
    display: inline !important;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    outline: 0;
  }

  #multiselectContainerReact .optionContainer li:hover,
  #multiselectContainerReact .optionContainer li.highlight {
    background: #f26e21;
  }

  #multiselectContainerReact div:first-child {
    border: 0;
    border-bottom: 2px solid #ccc;
    border-radius: 0;
  }

  #multiselectContainerReact .searchBox {
    font-size: 18px;
    padding: 5px 0;
    margin: 0;
    margin-top: 2px;
    display: block !important;
    width: 100% !important;
  }

  #multiselectContainerReact .searchBox::placeholder {
    font-size: 12px;
  }

  #multiselectContainerReact .chip {
    background: #f26e21;
  }

  .field-label,
  .field-input {
    transition: all 0.2s;
    touch-action: manipulation;
  }

  .field-input {
    font-size: 18px;
    border: 0;
    border-bottom: 2px solid #ccc;
    font-family: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 0;
    padding: 5px;
    cursor: text;

    padding: 5px 0;
    width: 100%;
    display: block;
    text-indent: 5px;
  }
`;
const CustomMultiSelect = ({
  onSelect,
  onRemove,
  placeholder,
  displayValue,
  closeIcon = "cancel",
  className = "field-input",
  label = "",
  options = [],
  selectedValues = [],
  hasSelectAll = false
}) => {
  return (
    <CustomMultiSelectContainer>
      <div className="form-group">
        <div className="field">
          <Multiselect
            className={className}
            options={options}
            selectedValues={selectedValues}
            hasSelectAll={hasSelectAll}
            onSelect={onSelect}
            onRemove={onRemove}
            placeholder={placeholder}
            displayValue={displayValue}
            closeIcon={closeIcon}
            showCheckbox={true}
            closeOnSelect={false}
            autocomplete="false"
          />

          <label className="field-label">{label}</label>
        </div>
      </div>
    </CustomMultiSelectContainer>
  );
};

export default CustomMultiSelect;
