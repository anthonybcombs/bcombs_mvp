import React from "react";
import styled from "styled-components";
import MultiSelect from "react-multi-select-component";

const CustomMultiSelectContainer = styled.div`
  .multi-select .select-item {
    width: 100%;
  }
  .eLOaoS input {
    margin-top: 15px !important;
    margin-bottom: 15px !important;
  }
`;
const CustomMultiSelectOptions = ({
  className,
  onChange,
  name,
  labelledBy = "Select",
  options = [],
  value = []
}) => {
  return (
    <CustomMultiSelectContainer>
      <MultiSelect
        name={name}
        className={className}
        options={options}
        value={value}
        onChange={onChange}
        labelledBy={labelledBy}
      />
    </CustomMultiSelectContainer>
  );
};

export default CustomMultiSelectOptions;
