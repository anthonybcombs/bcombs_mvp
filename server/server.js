import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import "regenerator-runtime/runtime";

import apiRouter from "./api/";
import apiMetrics from "./api/metrics";
import apiMetricsAttendance from "./api/metrics/attendance";
import apiMetricsClassAttendance from "./api/metrics/class_attendance";
import apiMetricsMentee from "./api/metrics/mentee";
import apiMetricsMentoring from "./api/metrics/mentoring";
import apiMetricsVolunteering from "./api/metrics/volunteering";
import apiMetricsClasses from "./api/metrics/classes";
import apiMetricsGrades from "./api/metrics/grades";
import apiMetricsTests from "./api/metrics/tests";

import apiBCCallendarActivities from "./api/bccalendar/activities";
import apiBCCallendarAddActivity from "./api/bccalendar/add_activity";
import apiBCCallendarUpdateActivity from "./api/bccalendar/update_activity";
import apiBCCallendarDeleteActivity from "./api/bccalendar/delete_activity";
import apiBCCallendarFeed from "./api/bccalendar/feed";
import apiBCCallendarFeedAdd from "./api/bccalendar/feed_add";
import apiCron from "./api/cron";

import services from "./services";
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "/.env") });
const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(
  bodyParser.urlencoded({
    extended: true,
    parameterLimit: 10000000,
    limit: "50mb",
    extended: true
  })
);
app.use(
  bodyParser.json({ parameterLimit: 10000000, limit: "50mb", extended: true })
);

const cron = require('./cron-process');
cron.setReminder();
cron.updateIds();

const serviceNames = Object.keys(services);
for (let i = 0; i < serviceNames.length; i += 1) {
  const name = serviceNames[i];
  console.log(name);
  if (name === "graphql") {
    services[name].applyMiddleware({ app });
  }
  // if (name === "redis") {
  // } else {
  //   // app.use(`${name}`, services[name]);
  // }
}

console.log(require("dotenv").config());
console.log("BUCKET", process.env.AWS_BUCKET);
//routes
app.use("/api", apiRouter);
app.use("/api/metrics", apiMetrics);
app.use("/api/metrics/attendance", apiMetricsAttendance);
app.use("/api/metrics/class_attendance", apiMetricsClassAttendance);
app.use("/api/metrics/mentee", apiMetricsMentee);
app.use("/api/metrics/mentoring", apiMetricsMentoring);
app.use("/api/metrics/volunteering", apiMetricsVolunteering);
app.use("/api/metrics/classes", apiMetricsClasses);
app.use("/api/metrics/grades", apiMetricsGrades);
app.use("/api/metrics/tests", apiMetricsTests);

app.use("/api/bccalendar/activities", apiBCCallendarActivities);
app.use("/api/bccalendar/add_activity", apiBCCallendarAddActivity);
app.use("/api/bccalendar/update_activity", apiBCCallendarUpdateActivity);
app.use("/api/bccalendar/delete_activity", apiBCCallendarDeleteActivity);
app.use("/api/bccalendar/feed", apiBCCallendarFeed);
app.use("/api/bccalendar/add_feed", apiBCCallendarFeedAdd);
app.use("/api/cron", apiCron);
// app.get("/", (req, res) => {
//   res.status(200).send("bon");
// });
app.listen(process.env.PORT || 8080, () => {
  console.log(`bcombs server running ${process.env.PORT}`);
});
module.exports = app;
