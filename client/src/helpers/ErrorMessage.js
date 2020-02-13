import React from "react";

export default function ErrorMessage({ field, errorType, message }) {
  return (
    <>
      {field && field.type === errorType && <p className="error">{message}</p>}
    </>
  );
}
