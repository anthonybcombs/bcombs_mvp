import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import "regenerator-runtime/runtime";

import apiRouter from "./api/";
import apiMetrics from "./api/metrics";
import apiMetricsAttendance from "./api/metrics/attendance";
import apiMetricsMentee from "./api/metrics/mentee";
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
app.use("/api/metrics/mentee", apiMetricsMentee);


// app.get("/", (req, res) => {
//   res.status(200).send("bon");
// });
app.listen(process.env.PORT || 8080, () => {
  console.log(`bcombs server running ${process.env.PORT}`);
});
module.exports = app;
