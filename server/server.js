import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import "regenerator-runtime/runtime";
require("dotenv").config();
import apiRouter from "./api/";
import services from "./services";
const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const serviceNames = Object.keys(services);
for (let i = 0; i < serviceNames.length; i += 1) {
  const name = serviceNames[i];
  if (name === "graphql") {
    services[name].applyMiddleware({ app });
  } else {
    app.use(`${name}`, services[name]);
  }
}

//routes
app.use("/api", apiRouter);

// app.get("/", (req, res) => {
//   res.status(200).send("bon");
// });
app.listen(process.env.PORT || 8080, () => {
  console.log(`bcombs server running ${process.env.PORT}`);
});
module.exports = app;
