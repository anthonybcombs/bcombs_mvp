import React from "react";
import { useSelector } from "react-redux";
import { Router } from "@reach/router";
import Layout from "./helpers/Layout";
import DashboardLayout from "./helpers/DashboardLayout";
import Auth from "./components/Auth";
import DashBoard from "./components/Dashboard/";
import Login from "./components/Auth/Login";
import CreateUser from "./components/Auth/Create";
import ForgotPassword from "./components/Auth//ForgotPassword";
import CreateProfile from "./components/UserInfo/Profile/Create";
export default function App() {
  const authenticated = useSelector(state => state.auth.status === "SIGNED_IN");
  return (
    <>
      {authenticated ? (
        <DashboardLayout>
          <div data-testid="app-dashboard">
            <DashBoard path="/dashboard"></DashBoard>
          </div>
        </DashboardLayout>
      ) : (
        <Layout>
          <div data-testid="app">
            <Router>
              <CreateProfile path="/profile" />
              <Auth path="/">
                <Login path="/" />
                <CreateUser path="auth/create" />
                <ForgotPassword path="auth/forgot-password" />
              </Auth>
            </Router>
          </div>
        </Layout>
      )}
    </>
  );
}
