import React from "react";
import MultiSelect from "react-multi-select-component";

const CustomMultiSelectOptions = ({
  className,
  onChange,
  labelledBy = "Select",
  options = [],
  value = []
}) => {
  return (
    <MultiSelect
      className={className}
      options={options}
      value={value}
      onChange={onChange}
      labelledBy={labelledBy}
    />
  );
};

export default CustomMultiSelectOptions;
