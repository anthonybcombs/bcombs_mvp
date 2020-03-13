import React, { useEffect } from "react";
import { Redirect } from "@reach/router";
import { useSelector, useDispatch } from "react-redux";
import {
  requestUserInfo,
  requestRemoveAuthMessages
} from "../../redux/actions/Auth";
import Loading from "../../helpers/Loading";
export default function index({ children, location }) {
  const { auth } = useSelector(({ auth }) => {
    return { auth };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(requestUserInfo());
  }, []);
  useEffect(() => {
    dispatch(requestRemoveAuthMessages());
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
