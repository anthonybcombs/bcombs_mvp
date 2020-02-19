import React from "react";
import { useSelector } from "react-redux";
import { Router } from "@reach/router";
import Layout from "./helpers/Layout";
import DashboardLayout from "./helpers/DashboardLayout";
import Auth from "./components/Auth";
import DashBoard from "./components/Dashboard/";
import DashboardHome from "./components/Dashboard/Home";
import Login from "./components/Auth/Login";
import CreateUser from "./components/Auth/Create";
import ForgotPassword from "./components/Auth//ForgotPassword";
import Profile from "./components/UserInfo/Profile";
import Calendar from "./components/Calendar/small-calendar";

export default function App() {
  const authenticated = useSelector(state => state.auth.status === "SIGNED_IN");
  // const authenticated = true;
  return (
    <>
      {authenticated ? (
        <DashboardLayout>
          <div data-testid="app">
            <DashBoard path="/dashboard">
              <DashboardHome path="/" />
            </DashBoard>
          </div>
        </DashboardLayout>
      ) : (
        <Layout>
          <div data-testid="app">
            <Router>
              <Auth path="/">
                <Login path="/" />
                <CreateUser path="auth/create" />
                <ForgotPassword path="auth/forgot-password" />
              </Auth>
              <Profile path="profile" />
              <Calendar path="calendar" />
            </Router>
          </div>
        </Layout>
      )}
    </>
  );
}
