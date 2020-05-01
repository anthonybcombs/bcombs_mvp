import React from "react";
import styled from "styled-components";

const GroupPhoto = ({ data }) => {
  return (
    <div
      style={{
        marginBottom: 12,
        overFlowY: "scroll",
        minHeight: "60%",
        maxHeight: "80%"
      }}>
      <h1>{data.name}</h1>
    </div>
  );
};

export default GroupPhoto;
