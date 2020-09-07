import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

import subsRouter from "./services/subs";
import cricketRouter from "./services/cricket";
import membersRouter from "./services/members";
import slackRouter from "./services/slack";
import { connect } from "lib/clubDb";

export const setupServer = () => {
  connect();
  const app = express();
  const port = process.env["PORT"] || 8080;

  app.use(bodyParser.json());
  app.use(morgan("combined"));

  app.use("/subs", subsRouter);
  app.use("/cricket", cricketRouter);
  app.use("/members", membersRouter);
  app.use("/slack", slackRouter);

  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });
};
