import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({
  selected,
  onChange,
  className = "",
  placeholderText = "mm/dd/yyyy"
}) => {
  return (
    <DatePicker
      className={className}
      placeholderText={placeholderText}
      selected={selected}
      onChange={onChange}
    />
  );
};

export default CustomDatePicker;
