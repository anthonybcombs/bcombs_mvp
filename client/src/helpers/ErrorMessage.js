import React from "react";

export default function ErrorMessage({ field, errorType, message }) {
  return (
    <>
      {typeof message === "string"
        ? field &&
          field.type === errorType && <p className="error">{message}</p>
        : field && <div className="error">{message}</div>}
    </>
  );
}
