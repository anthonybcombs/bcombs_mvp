import styled from "styled-components";

export default styled.div`
  width: auto;
  max-width: 1920px;
  margin: auto;
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


  @media (min-width: 600px) {
    #formBuilder {
      grid-template-columns: 1fr 2fr;
      grid-gap: 1%;
    }
  }
  @media (max-width: 840px) {
    padding: 0rem 1rem 2rem;
  }



  
`;