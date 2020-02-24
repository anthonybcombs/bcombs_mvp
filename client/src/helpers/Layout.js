import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faBell, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link, Location } from "@reach/router";
import Logo from "../images/logo1.png";
const HeaderStyled = styled.header`
  display: grid;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize};
  background-color: ${({ theme }) => theme.backgroundColor.secondary};
  margin: 0;
  padding: 10px;
  border-bottom: 1px solid grey;
  div {
    display: inline;
  }
  a {
    display: block;
    color: grey;
    text-decoration: none;
  }
  #app-header-left,
  #app-header-right {
    display: grid;
  }
  #app-header-left img {
    position: relative;
    border-radius: 50%;
    height: 50px;
    width: 50px;
    top: -10px;
  }
  #app-header-left a.selected > span {
    display: inline-block;
    border-bottom: 5px solid ${({ theme }) => theme.backgroundColor.primary};
  }
  #dashboard-search {
    display: grid;
  }
  @media (min-width: 600px) {
    grid-template-columns: 50% 50%;
    text-align: left;
    #app-header-left {
      text-align: center;
      grid-template-columns: repeat(7, 1fr);
      grid-gap: 1%;
    }
    #app-header-right {
      grid-template-columns: 30% 70%;
    }
    #dashboard-search {
      grid-template-columns: 15% 20% 15% 15% 15% 10% 10%;
    }
    #app-header-left a {
      position: relative;
      top: 10px;
    }
    #app-header-left a.selected > span {
      padding-bottom: 1.3em;
    }
    .input-icons {
      margin-top: 5px;
    }
  }
`;
const LayoutStyled = styled.div`
  margin: 0;
  padding: 0;
`;

export default function Layout({ children }) {
  const theme = useContext(ThemeContext);
  return (
    <LayoutStyled data-testid="app-layout" theme={theme}>
      <HeaderStyled data-testid="app-title" theme={theme.header}>
        <div id="app-header-right">
          <Link to="/">
            <img data-testid="app-logo" src={Logo} alt="Bcombs Logo" />
          </Link>
          <Location
            children={context => {
              if (context.location.pathname.includes("dashboard")) {
                return (
                  <>
                    <div className="input-icons">
                      <FontAwesomeIcon className="icon" icon={faSearch} />
                      <input
                        type="text"
                        placeholder="Find..."
                        className="input-field"
                      />
                    </div>
                  </>
                );
              }
            }}
          />
        </div>
        <div id="app-header-left">
          <Location
            children={context => {
              if (context.location.pathname === "/auth/forgot-password") {
                return (
                  <>
                    <Link data-testid="app-header-login" to="/">
                      Login
                    </Link>
                    <Link data-testid="app-header-register" to="/auth/create">
                      Register
                    </Link>
                  </>
                );
              }
            }}
          />
          <Location
            children={context => {
              if (context.location.pathname.includes("dashboard")) {
                return (
                  <>
                    <Link
                      className={`${
                        context.location.pathname === "/dashboard"
                          ? "selected"
                          : ""
                      }`}
                      to="/dashboard"
                      state={{ calendarName: "" }}
                    >
                      <span> Dashboard</span>
                    </Link>
                    <Link
                      className={`${
                        context.location.pathname === "/dashboard/mycalendars"
                          ? "selected"
                          : ""
                      }`}
                      to="/dashboard/mycalendars"
                    >
                      <span>Calendars</span>
                    </Link>
                    <Link
                      className={`${
                        context.location.pathname === "/dashboard/admin"
                          ? "selected"
                          : ""
                      }`}
                      to="/dashboard/admin"
                    >
                      <span>Admin</span>
                    </Link>
                    <Link
                      className={`${
                        context.location.pathname === "/dashboard/contacts"
                          ? "selected"
                          : ""
                      }`}
                      to="/dashboard/contacts"
                    >
                      <span>Contacts</span>
                    </Link>
                    <Link
                      className={`${
                        context.location.pathname === "/dashboard/settings"
                          ? "selected"
                          : ""
                      }`}
                      to="/dashboard/settings"
                    >
                      <FontAwesomeIcon icon={faCog} />
                    </Link>
                    <Link
                      className={`${
                        context.location.pathname === "/dashboard/notifications"
                          ? "selected"
                          : ""
                      }`}
                      to="/dashboard/notifications"
                    >
                      <FontAwesomeIcon icon={faBell} />
                    </Link>
                    <Link
                      className={`${
                        context.location.pathname === "/dashboard/profile"
                          ? "selected"
                          : ""
                      }`}
                      to="/dashboard/profile"
                    >
                      <img src={"https://i.pravatar.cc/300"} />
                    </Link>
                  </>
                );
              }
            }}
          />
        </div>
      </HeaderStyled>
      {children}
      <footer data-testid="app-footer"></footer>
    </LayoutStyled>
  );
}
