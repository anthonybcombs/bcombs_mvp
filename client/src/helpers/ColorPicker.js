import React, { useState } from "react";
import styled from "styled-components";
import { ChromePicker } from "react-color";
const ColorPickerStyled = styled.div`
  .swatch {
    padding: 5px;
    background: #fff;
    border-radius: 1px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    display: inline-block;
    cursor: pointer;
    min-width: 100px;
    position: relative;
  }
  .color {
    width: 100%;
    height: 14px;
    border-radius: 2px;
  }
  .popover {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .cover {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
  }
`;
export default function ColorPicker({ color, setColor }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    setColor(color.hex);
  };
  return (
    <ColorPickerStyled id="color-picker">
      <div className="swatch" onClick={handleClick}>
        <div
          className="color"
          style={{
            backgroundColor: `${color.length > 0 ? color : "red"}`,
          }}
        />
      </div>
      {displayColorPicker && (
        <div className="popover" onMouseLeave={handleClose}>
          <div className="cover" onClick={handleClose} />
          <ChromePicker
            color={color.length > 0 ? color : "red"}
            onChange={handleChange}
          />
        </div>
      )}
    </ColorPickerStyled>
  );
}
