import React from "react";
import styled from "styled-components";
import ReactLoading from "react-loading";
const LoadingStyled = styled.div`
  height: 100vh;
  div:first-child {
    margin: 30vh auto;
  }
`;
export default function Loading() {
  return (
    <LoadingStyled>
      <ReactLoading
        type={"balls"}
        color={"#f26e21"}
        height={"20%"}
        width={"20%"}
      />
    </LoadingStyled>
  );
}
