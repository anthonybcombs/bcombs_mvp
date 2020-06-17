import React from "react";
import styled from "styled-components";
import MultiSelect from "react-multi-select-component";

const CustomMultiSelectContainer = styled.div`
  .multi-select .select-item {
    width: 100%;
  }
`;
const CustomMultiSelectOptions = ({
  className,
  onChange,
  labelledBy = "Select",
  options = [],
  value = []
}) => {
  return (
    <CustomMultiSelectContainer>
      <MultiSelect
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
