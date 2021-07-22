import React, { useState } from "react";
import styled from "styled-components";

const MetricStyled = styled.div`

  width: auto;
  max-width: 1920px;
  margin: auto;
  padding: 24px;

  .selected {
    background-color: #cdcdcd;
  }
  button {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
  #contacts {
    display: grid;
  }
  #labels,
  .groups {
    padding: 1em;
  }
  #labels > div {
    padding: 1em;
    font-size: 1.2em;
    cursor: pointer;
  }
  #labels > div.selected {
    background: #f26e21;
    color: white;
  }
  #labels > div > span {
    margin-left: 1em;
  }
  #contacts > div {
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }
  #contacts > div:nth-of-type(2) {
    margin-right: 0.5em;
  }

  @media (min-width: 600px) {
    #contacts {
      grid-template-columns: 25% 75%;
      grid-gap: 1%;
    }
  }
  @media (max-width: 840px) {
    padding: 0rem 1rem 2rem;
  }
  @media (min-width: 1500px) {
    #contacts > div:nth-of-type(2) {
      margin-right: 1em;
    }
  }
`;

const ComponentOne = props => {
  return <div style={{ padding:24 }}>Menu One</div>
}


const ComponentTwo = props => {
  return <div style={{ padding:24 }}>Menu Two</div>
}

const Metrics = props => {
  const [selectedLabel, setSelectedLabel] = useState(null);
  // const sql_stat = "Select xyz form a, b";
  // rows = sql_run(sql_stat)

  const handleSelectedLabel = value => {
    setSelectedLabel(value);

  };

  return (
    <MetricStyled>
      <div id="contacts" >
        {/* MENU */}
        <div>
          <div id="labels">
            <h3>Labels</h3>
            <div
              className={`${selectedLabel === "Menu 1" ? "selected" : ""}`}
              onClick={() => {
                handleSelectedLabel("Menu 1");
              }}
            >
              <span>Menu 1</span>
            </div>
            <div
              className={`${selectedLabel === "Menu 2" ? "selected" : ""}`}
              onClick={() => {

                handleSelectedLabel("Menu 2");
              }}
            >
              <span>Menu 2</span>
            </div>

          </div>
        </div>
         {/* MENU */}

        <div>
          {selectedLabel === 'Menu 1' && <ComponentOne/>}
          {selectedLabel === 'Menu 2' && <ComponentTwo/>}
        </div>
      </div>
    </MetricStyled>
  );
}

export default Metrics;