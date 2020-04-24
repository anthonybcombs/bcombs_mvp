import React, { useEffect } from "react";
import { Redirect, useLocation } from "@reach/router";
import { useSelector, useDispatch } from "react-redux";
import { requestUserInfo } from "../../redux/actions/Auth";
import { requestRemoveStatus } from "../../redux/actions/Status";
import Loading from "../../helpers/Loading";
export default function index({ children }) {
  const { auth, status } = useSelector(({ auth, status }) => {
    return { auth, status };
  });
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (status.messageType !== "error") {
      dispatch(requestUserInfo());
    }
  }, []);
  useEffect(() => {
    if (location.pathname !== "/") {
      dispatch(requestRemoveStatus());
    }
  }, [location]);
  if (auth.status === "AWAITING_AUTH_RESPONSE") {
    return <Loading />;
  } else if (
    sessionStorage.getItem("access_token") !== null &&
    auth.email_verified
  ) {
    return <Redirect to="/dashboard" />;
  }
  return <>{children}</>;
}
