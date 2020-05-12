import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "@reach/router";
import { webAuth } from "./Auth0";
import Loading from "./Loading";
import { requestCheckuserAndAdd } from "../redux/actions/Users";
export default function SocialLogin({ location }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  webAuth.parseHash({ hash: location.hash }, function (error, authResult) {
    if (error !== null) {
      navigate("/", { replace: true });
      return;
    }
    webAuth.client.userInfo(authResult.accessToken, function (error, user) {
      if (error) return;
      user.isSocial = true;
      user.access_token = authResult.accessToken;
      user.token_type = authResult.tokenType;
      user.is_profile_filled = false;
      sessionStorage.setItem("access_token", authResult.accessToken);
      sessionStorage.setItem("token_type", authResult.tokenType);
      dispatch(requestCheckuserAndAdd(user));
      navigate(
        "/dashboard",
        { state: { calendarName: "" } },
        { replace: true }
      );
    });
  });
  return <Loading />;
}
