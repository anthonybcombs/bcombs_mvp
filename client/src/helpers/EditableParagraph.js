import React, { useState } from "react";

export default function EditableParagraph({
  DisplayComp,
  EditableComp,
  handleOnEnter = value => {}
}) {
  const [isEditing, setIsEditing] = useState(false);
  const cloneDisplayComp = React.cloneElement(DisplayComp, {
    onClick: e => {
      e.stopPropagation();
      setIsEditing(true);
    },
    onDoubleClick: e => {
      e.stopPropagation();
    }
  });
  const cloneEditableComp = React.cloneElement(EditableComp, {
    onKeyPress: e => {
      if (e.key === "Enter" || e.key === "Esc") {
        setIsEditing(false);
        handleOnEnter(e.target.value);
      }
    },
    onMouseLeave: e => {
      setIsEditing(false);
    }
  });
  return (
    <>
      {!isEditing && cloneDisplayComp} {isEditing && cloneEditableComp}
    </>
  );
}
