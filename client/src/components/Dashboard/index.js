import React from "react";
import ProtectedRoute from "../../helpers/ProtectedRoute";
export default function index({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
