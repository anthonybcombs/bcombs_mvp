import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({
  selected,
  onChange,
  className = "",
  placeholderText = "Pick date.",
}) => {
  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  };
  return (
    <DatePicker
      className={className}
      placeholderText={placeholderText}
      selected={selected}
      onChange={onChange}
      onChangeRaw={handleDateChangeRaw}

    />
  );
};

export default CustomDatePicker;
