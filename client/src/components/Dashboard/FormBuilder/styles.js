import styled from "styled-components";

export default styled.div`
  .form-builder {
    display: flex;
    width: 100%;
  }
  .fb-draggables {
    width: 30%;
    border: 1px solid red;
  }
  .fb-drop-area {
    border: 1px solid red;
    width: 70%;
  }
  .draggble-items {
    cursor: move;
  }
`;