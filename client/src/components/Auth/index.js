import React, { useEffect } from "react";
import { Redirect } from "@reach/router";
import { useSelector, useDispatch } from "react-redux";
import { requestUserInfo } from "../../redux/actions/Auth";
import { requestRemoveStatus } from "../../redux/actions/Status";
import Loading from "../../helpers/Loading";
export default function index({ children, location }) {
  const { auth, status } = useSelector(({ auth, status }) => {
    return { auth, status };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(requestUserInfo());
  }, []);
  useEffect(() => {
    dispatch(requestRemoveStatus());
  }, [location]);
  if (status.requestStatus === "AWAITING_AUTH_RESPONSE") {
    return <Loading />;
  } else if (
    sessionStorage.getItem("access_token") !== null &&
    auth.email_verified
  ) {
    return <Redirect to="/dashboard" />;
  }
  return <>{children}</>;
}
