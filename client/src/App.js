import React, { useEffect } from "react";
import { Router } from "@reach/router";
import { useDispatch } from "react-redux";
import Layout from "./helpers/Layout";
import Loadable from "react-loadable";
import Loading from "./helpers/Loading.js";
import { requestUserTypes } from "./redux/actions/UserTypes";
import { requestGrades } from "./redux/actions/Grades";
import SocialLoginLanding from "./helpers/SocialLogin.js";

const AsycDashboard = Loadable({
  loader: () => import("./components/Dashboard/"),
  loading: Loading,
});
const AsyncDashBoardHome = Loadable({
  loader: () => import("./components/Dashboard/Home"),
  loading: Loading,
});
const AsyncDashboardMyCalendars = Loadable({
  loader: () => import("./components/Dashboard/MyCalendars"),
  loading: Loading,
});
const AyncDashboardMyContactsPublic = Loadable({
  loader: () => import("./components/Dashboard/MyCalendars/publicCalendar"),
  loading: Loading,
});
const AsyncDashboardMyEvents = Loadable({
  loader: () => import("./components/Dashboard/MyEvents"),
  loading: Loading,
});
const AsyncDashboardMyProfle = Loadable({
  loader: () => import("./components/Dashboard/MyProfile"),
  loading: Loading,
});
const AyncDashboardMyContacts = Loadable({
  loader: () => import("./components/Dashboard/MyContact"),
  loading: Loading,
});
const AsyncAuth = Loadable({
  loader: () => import("./components/Auth"),
  loading: Loading,
});
const AsyncLogin = Loadable({
  loader: () => import("./components/Auth/Login"),
  loading: Loading,
});
const AsyncCreateUser = Loadable({
  loader: () => import("./components/Auth/Create"),
  loading: Loading,
});
const AsyncForgotPassword = Loadable({
  loader: () => import("./components/Auth/ForgotPassword"),
  loading: Loading,
});
const AsyncProfile = Loadable({
  loader: () => import("./components/UserInfo/Profile"),
  loading: Loading,
});
const AsyncApplicationStatus = Loadable({
  loader: () => import("./components/Dashboard/Application"),
  loading: Loading,
});
const AsyncArchivedApplication = Loadable({
  loader: () => import("./components/Dashboard/ArchivedApplication"),
  loading: Loading,
});
const AsyncApplicationForm = Loadable({
  loader: () => import("./components/Dashboard/ApplicationForm"),
  loading: Loading,
});
const AsyncChildInformatioView = Loadable({
  loader: () => import("./components/Dashboard/Application/child"),
  loading: Loading
});
export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(requestUserTypes());
    dispatch(requestGrades());
  }, []);
  return (
    <>
      <Layout>
        <div data-testid="app">
          <Router>
            <AyncDashboardMyContactsPublic path="/mycalendars/public/:id" />
            <AsyncAuth path="/">
              <AsyncLogin default />
              <AsyncCreateUser path="auth/create" />
              <AsyncForgotPassword path="auth/forgot-password" />
            </AsyncAuth>
            <AsycDashboard path="/dashboard">
              <AsyncDashBoardHome default />
              <AsyncDashboardMyCalendars path="mycalendars" />
              <AsyncDashboardMyEvents path="myevents" />
              <AsyncDashboardMyProfle path="myprofile" />
              <AyncDashboardMyContacts path="mycontacts" />
              <AsyncProfile path="createprofile" />
              <AsyncApplicationStatus path="application" />
              <AsyncChildInformatioView path="menteeprofile/:id"/>
              <AsyncArchivedApplication path="archived" />
            </AsycDashboard>
            <SocialLoginLanding path="sociallanding" />
            <AsyncApplicationForm path="application/:vendor_id" />
          </Router>
        </div>
      </Layout>
    </>
  );
}
