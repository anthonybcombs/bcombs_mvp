import React, { useEffect } from "react";
import { Router } from "@reach/router";
import { useDispatch } from "react-redux";
import Layout from "./helpers/Layout";
import Loadable from "react-loadable";
import Loading from "./helpers/Loading.js";
import { requestUserTypes } from "./redux/actions/UserTypes";
import SocialLoginLanding from "./helpers/SocialLogin.js";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const AsycDashboard = Loadable({
  loader: () => import("./components/Dashboard/"),
  loading: Loading
});
const AsyncDashBoardHome = Loadable({
  loader: () => import("./components/Dashboard/Home"),
  loading: Loading
});
const AsyncDashboardMyCalendars = Loadable({
  loader: () => import("./components/Dashboard/MyCalendars"),
  loading: Loading
});
const AyncDashboardMyContactsPublic = Loadable({
  loader: () => import("./components/Dashboard/MyCalendars/publicCalendar"),
  loading: Loading
});
const AsyncDashboardMyEvents = Loadable({
  loader: () => import("./components/Dashboard/MyEvents"),
  loading: Loading
});
const AsyncDashboardMyProfle = Loadable({
  loader: () => import("./components/Dashboard/MyProfile"),
  loading: Loading
});
const AyncDashboardMyContacts = Loadable({
  loader: () => import("./components/Dashboard/MyContact"),
  loading: Loading
});
const AsyncAuth = Loadable({
  loader: () => import("./components/Auth"),
  loading: Loading
});
const AsyncLogin = Loadable({
  loader: () => import("./components/Auth/Login"),
  loading: Loading
});
const AsyncCreateUser = Loadable({
  loader: () => import("./components/Auth/Create"),
  loading: Loading
});
const AsyncForgotPassword = Loadable({
  loader: () => import("./components/Auth/ForgotPassword"),
  loading: Loading
});
const AsyncProfile = Loadable({
  loader: () => import("./components/UserInfo/Profile"),
  loading: Loading
});
const AsyncApplicationStatus = Loadable({
  loader: () => import("./components/Dashboard/Application"),
  loading: Loading
});
const AsyncArchivedApplication = Loadable({
  loader: () => import("./components/Dashboard/ArchivedApplication"),
  loading: Loading
});
const AsyncApplicationForm = Loadable({
  loader: () => import("./components/Dashboard/ApplicationForm"),
  loading: Loading
});
const AsyncChildInformationView = Loadable({
  loader: () => import("./components/Dashboard/Application/child"),
  loading: Loading
});
const AsyncParentInformationView = Loadable({
  loader: () => import("./components/Dashboard/Application/parent"),
  loading: Loading
});
const AsyncClassListInformationView = Loadable({
  loader: () => import("./components/Dashboard/Application/class"),
  loading: Loading
});
const AsyncMyApplication = Loadable({
  loader: () => import("./components/Dashboard/MyApplication"),
  loading: Loading
});

const AsyncAuditTrail = Loadable({
  loader: () => import("./components/Dashboard/AuditTrail"),
  loading: Loading
});

const AsyncBCCalendar = Loadable({
  loader: () => import("./components/Dashboard/BCCalendar"),
  loading: Loading
});

const AsyncManageAdmin = Loadable({
  loader: () => import("./components/Dashboard/Admin"),
  loading: Loading
});

const AsyncDaycareApplicationForm = Loadable({
  loader: () => import("./components/Dashboard/DaycareApplicationForm"),
  loading: Loading
})

const AsynBuilder = Loadable({
  loader: () => import("./components/Dashboard/Builders"),
  loading: Loading
})

const AsyncForm = Loadable({
  loader: () => import("./components/Dashboard/Builders/Form"),
  loading: Loading
})

const AsyncForms = Loadable({
  loader: () => import("./components/Dashboard/Forms"),
  loading: Loading
})


const AsyncAttendance = Loadable({
  loader: () => import("./components/Dashboard/Attendance"),
  loading: Loading
});

const AsyncAttendanceList = Loadable({
  loader: () => import("./components/Dashboard/Attendance/list"),
  loading: Loading
});

const AsyncAttendanceSummary = Loadable({
  loader: () => import("./components/Dashboard/Attendance/view"),
  loading: Loading
});

const AsyncAttendanceEvents = Loadable({
  loader: () => import("./components/Dashboard/Attendance/events"),
  loading: Loading
});

const AsyncEventAttendee = Loadable({
  loader: () => import("./components/Dashboard/Attendance/eventattendee"),
  loading: Loading
});

const AsyncGradesList = Loadable({
  loader: () => import("./components/Dashboard/Grades/List"),
  loading: Loading
});

const AsyncGradeIndividual = Loadable({
  loader: () => import("./components/Dashboard/Grades/Individual"),
  loading: Loading
});

const AsyncGradeIndividualProfile = Loadable({
  loader: () => import("./components/Dashboard/Grades/Individual/Profile"),
  loading: Loading
});

const AsyncGradeTestInput = Loadable({
  loader: () => import("./components/Dashboard/Grades/TestInput"),
  loading: Loading
});

const AsyncMyMetrics = Loadable({
  loader: () => import("./components/Dashboard/Metrics"),
  loading: Loading
});

const AsyncDisplayCalendar = Loadable({
  loader: () => import("./components/Dashboard/BCDisplayCalendar"),
  loading: Loading
});

const AsyncParentContacts = Loadable({
  loader: () => import("./components/Dashboard/ParentContactList"),
  loading: Loading
});

const AsyncLandingPage = Loadable({
  loader: () => {

    // if(window.innerWidth <= 768) {
    //   return import('./components/LandingPage/Pages/mobile/home/index.js');
    // }
      return  import('./components/LandingPage');
    // return import('./components/LandingPage/Pages/tablet/home/index.js');
  },
  loading: Loading
});

const AsyncUserattendance = Loadable({
  loader: () => import("./components/UserAttendance"),
  loading: Loading
});

const AsyncUserGrades = Loadable({
  loader: () => import("./components/UserGrade"),
  loading: Loading
});



export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(requestUserTypes());
  }, []);
  return (
    <>

      <Layout>
        <div data-testid="app">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Router>
              <AsyncUserattendance path="/event/:event_id/attendance" />
              <AsyncUserGrades path="/user/grades" />
              <AyncDashboardMyContactsPublic path="/mycalendars/public/:id" />
              <AsyncAuth path="/">
                <AsyncLandingPage path="/" default />
                <AsyncLogin path="login" />
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
                <AsyncChildInformationView path="menteeprofile/:id" />
                <AsyncParentInformationView path="parentprofile/:id" />
                <AsyncArchivedApplication path="archived" />
                <AsyncClassListInformationView path="class/:form_type/:form_id" />
                <AsyncMyApplication path="myapplication" />
                <AsyncParentContacts path="parentcontacts" />
                <AsyncAuditTrail path="audittrail" />
                <AsyncBCCalendar path="bccalendar" />
                <AsyncManageAdmin path="admin" />
                <AsynBuilder path="builder/:form_id/:type" />
                <AsynBuilder path="builder" />
                <AsyncForms path="forms" />
                <AsyncAttendance path="studentdata" />
                <AsyncAttendanceList path="attendance/:vendor_id/:name" />
                <AsyncAttendanceEvents path="attendance/events" />
                <AsyncEventAttendee path="eventattendance/:event_id" />
                <AsyncAttendanceSummary path="attendance/view/:app_group_id" />
                <AsyncGradeIndividualProfile path="grades/profile/:child_id" />
                <AsyncGradeIndividual path="grades/individual/:child_id" />
                <AsyncGradeTestInput path="grades/input/:child_id" />
                <AsyncGradeTestInput path="grades/input" />
                <AsyncGradesList path="grades" />
                <AsyncMyMetrics path="metrics" />
                <AsyncDisplayCalendar path="bcdisplaycalendar" />
              </AsycDashboard>

              <SocialLoginLanding path="sociallanding" />
              <AsyncApplicationForm path="application/:vendor_id" />
              <AsyncApplicationForm path="application/:vendor_id/lot" />
              <AsyncDaycareApplicationForm path="application/:vendor_id/daycare" />
              <AsyncForm path="form/:form_id" />

         
            </Router>
          </MuiPickersUtilsProvider>
        </div>
      </Layout>
    </>
  );
}
