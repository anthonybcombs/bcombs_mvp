import styled from "styled-components";

export default styled.div`
  width: auto;
  margin: auto;
  max-width: 1920px;
  padding: 0rem 3em 2rem;

  #formBuilder {
    display: grid;
    grid-gap: 12%;
  }
  #formBuilder > div {
    padding: 1rem;
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }

  .fb-form-title {
    margin-bottom: 10px
  }

  .draggble-items {
    border: 1px dashed gray;
    padding: 0.5rem 1rem;
    margin-bottom: .5rem;
    width: 50%;
    text-align: center;
  }

  @media (min-width: 600px) {
    #formBuilder {
      grid-template-columns: 1fr 2fr;
      grid-gap: 1%;
    }
  }
  @media (max-width: 840px) {
    padding: 0rem 1rem 2rem;
  }

  // START --- Sortable Field Group CSS
  .sortableGroup {
    border: 1px solid white;
    padding: 0.3rem 0.7rem 0.7rem 0.7rem;
    margin-bottom: .5rem;
    background-color: white;
    cursor: move;
    position: relative;
  }

  .sortableGroup:hover {
    border: 1px dashed gray;
  }

  .sortableGroup:hover > .sortablePreviewActions {
    display: block;
  }
  .sortablePreviewActions {
    display: none;
    position: absolute;
    right: 10px;
    cursor: pointer;
  }
  .sortablePreviewActions svg {
    margin-left: 5px;
  }
  .sortablePreviewActions svg:first-child {
    color: red;
  }
  .sortablePreviewActions svg:last-child {
    color: blue;
  }

  // END --- Sortable Field Group CSS

  
`;