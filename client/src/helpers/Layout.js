import React, { useEffect, useContext, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faBell,
  faSearch,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Link, Location, useNavigate } from "@reach/router";
import Popover, { ArrowContainer } from "react-tiny-popover";
import Logo from "../images/logo1.png";
import { requestLogout } from "../redux/actions/Auth";
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
    cursor: pointer;
  }
  #app-header-right,
  #app-header-left {
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
  #dashboard-setting {
    display: flex;
    justify-content: space-around;
    margin-top: 1em;
  }

  @media (min-width: 600px) {
    grid-template-columns: 30% 70%;
    text-align: left;
    #app-header-left {
      display: flex;
      text-align: center;
      justify-content: flex-end;
    }
    #app-header-right {
      grid-template-columns: 50% 50%;
    }
    #app-header-left a {
      position: relative;
      top: 10px;
      margin: 0 1em 0 1em;
    }
    #app-header-left a.selected > span {
      padding-bottom: 1.3em;
    }
    .input-icons {
      margin-top: 5px;
    }
    #dashboard-setting {
      margin-top: 0;
      justify-content: space-around;
    }
    #dashboard-setting a {
      margin: 0 5px 0 5px;
    }
  }
  @media (min-width: 1500px) {
    1grid-template-columns: 20% 80%;
  }
`;
const LayoutStyled = styled.div`
  margin: 0;
  padding: 0;
`;

const PopoverStyled = styled.div`
  background: white;
  border: 1px solid lightgrey;
  a {
    display: block;
    color: grey;
    text-decoration: none;
    cursor: pointer;
    margin: 1em;
  }
  svg {
    margin-right: 1em;
  }
`;
export default function Layout({ children }) {
  const [isPopOverVisible, setIsPopOverVisible] = useState(false);
  const [currentUserProfilePhoto, setCurrentUserProfilePhoto] = useState(false);
  const { auth } = useSelector(({ auth }) => {
    return { auth };
  });
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      setCurrentUserProfilePhoto(auth.profile_img || auth.picture);
    }
  }, [auth]);

  console.log("auth", auth);
  return (
    <LayoutStyled data-testid="app-layout" theme={theme}>
      <HeaderStyled data-testid="app-title" theme={theme.header}>
        <div id="app-header-right">
          <Link to="/">
            <img data-testid="app-logo" src={Logo} alt="Bcombs Logo" />
          </Link>
          <Location
            children={(context) => {
              if (
                context.location.pathname.includes("dashboard") &&
                auth.status === "SIGNED_ID"
              ) {
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
            children={(context) => {
              if (
                context.location.pathname === "/auth/forgot-password" ||
                context.location.pathname === "/auth/create"
              ) {
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
            children={(context) => {
              if (
                context.location.pathname.includes("dashboard") &&
                auth.status === "SIGNED_IN"
              ) {
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
                        context.location.pathname === "/dashboard/myevents"
                          ? "selected"
                          : ""
                      }`}
                      to="/dashboard/myevents"
                    >
                      <span>Events</span>
                    </Link>

                    <Link
                      className={`${
                        context.location.pathname === "/dashboard/mycontacts"
                          ? "selected"
                          : ""
                      }`}
                      to="/dashboard/mycontacts"
                    >
                      <span>Contacts</span>
                    </Link>
                    <div id="dashboard-setting">
                      <Link
                        className={`${
                          context.location.pathname ===
                          "/dashboard/notifications"
                            ? "selected"
                            : ""
                        }`}
                        to="/dashboard/notifications"
                      >
                        <FontAwesomeIcon icon={faBell} />
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
                      <Popover
                        isOpen={isPopOverVisible}
                        position={"left"}
                        content={({ position, targetRect, popoverRect }) => (
                          <ArrowContainer
                            position={position}
                            targetRect={targetRect}
                            popoverRect={popoverRect}
                            arrowColor="lightgrey"
                            arrowSize={7}
                            arrowStyle={{ opacity: 1 }}
                            arrow="center"
                          >
                            <PopoverStyled>
                              <Link
                                to="/dashboard/myprofile"
                                onClick={() => {
                                  setIsPopOverVisible(false);
                                }}
                              >
                                <FontAwesomeIcon icon={faUser} />
                                <span>Profile</span>
                              </Link>
                              <a
                                onClick={() => {
                                  dispatch(requestLogout());
                                  setIsPopOverVisible(false);
                                  navigate("/", { replace: true });
                                }}
                              >
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                <span>Logout</span>
                              </a>
                            </PopoverStyled>
                          </ArrowContainer>
                        )}
                        onClickOutside={() => {
                          setIsPopOverVisible(false);
                        }}
                      >
                        <a
                          onClick={() => {
                            setIsPopOverVisible(true);
                          }}
                        >
                          <img
                            src={`${currentUserProfilePhoto}?t=${new Date().getTime()}`}
                          />
                        </a>
                      </Popover>
                    </div>
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
