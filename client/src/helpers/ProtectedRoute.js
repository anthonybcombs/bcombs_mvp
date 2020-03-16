import React, { useEffect } from "react";
import { Redirect, useLocation } from "@reach/router";

import { useSelector, useDispatch } from "react-redux";
import { requestUserInfo } from "../redux/actions/Auth";
import Loading from "../helpers/Loading";
export default function protectedRoutes({ children }) {
  const { auth } = useSelector(({ auth }) => {
    return {
      auth
    };
  });
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(requestUserInfo());
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);
  if (
    sessionStorage.getItem("access_token") === null ||
    auth.hasOwnProperty("error")
  ) {
    return <Redirect to="/" nothrow />;
  } else if (auth.email_verified) {
    if (!location.pathname.includes("createprofile") && !auth.isProfileFilled) {
      return <Redirect to="/dashboard/createprofile" />;
    }
    return <>{children}</>;
  }
  return <Loading />;
}
