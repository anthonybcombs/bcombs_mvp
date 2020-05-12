import React, { useEffect } from "react";
import { Redirect, useLocation } from "@reach/router";
import { useSelector, useDispatch } from "react-redux";
import { requestUserInfo, requestLogout } from "../../redux/actions/Auth";
import { requestUserTypes } from "../../redux/actions/UserTypes";
import { requestRemoveStatus } from "../../redux/actions/Status";
import Loading from "../../helpers/Loading";
export default function index({ children }) {
  const { auth, userTypes, status } = useSelector(
    ({ auth, userTypes, status }) => {
      return { auth, userTypes, status };
    }
  );
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(requestUserTypes());
    if (
      status.messageType !== "error" &&
      sessionStorage.getItem("access_token") !== null
    ) {
      dispatch(requestUserInfo());
    } else {
      dispatch(requestLogout());
    }
  }, []);
  useEffect(() => {
    if (location.pathname !== "/") {
      dispatch(requestRemoveStatus());
    }
  }, [location]);
  if (auth.status === "AWAITING_AUTH_RESPONSE" || userTypes.length === 0) {
    return <Loading />;
  } else if (
    sessionStorage.getItem("access_token") !== null &&
    auth.hasOwnProperty("user") &&
    auth.user.email_verified
  ) {
    return <Redirect to="/dashboard" />;
  }
  return <>{children}</>;
}
