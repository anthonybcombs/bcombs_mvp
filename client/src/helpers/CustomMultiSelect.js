import React from "react";
import styled from "styled-components";
import { Multiselect } from "multiselect-react-dropdown";

const CustomMultiSelectContainer = styled.div`
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
  }

  #multiselectContainerReact .searchBox::placeholder {
    font-size: 12px;
  }

  #multiselectContainerReact .chip {
    background: #f26e21;
  }
`;
const CustomMultiSelect = ({
  onSelect,
  onRemove,
  placeholder,
  displayValue,
  closeIcon = "cancel",
  className = "field-input",
  options = [],
  selectedValues = [],
  hasSelectAll = false
}) => {
  return (
    <CustomMultiSelectContainer>
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
      />
    </CustomMultiSelectContainer>
  );
};

export default CustomMultiSelect;
