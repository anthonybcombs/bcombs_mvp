import React, { useState } from "react";

export default function EditableParagraph({ DisplayComp, EditableComp }) {
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
      if (e.key === "Enter" || e.keyCode === "Esc") {
        setIsEditing(false);
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
