import React from "react";

export default function ErrorMessage({
  className = "",
  field,
  errorType,
  message
}) {
  return (
    <>
      {typeof message === "string"
        ? field &&
          field.type === errorType && (
            <p className={`error ${className}`}>{message}</p>
          )
        : field && <div className={`error ${className}`}>{message}</div>}
    </>
  );
}
