import express from "express";
import bodyParser from "body-parser";
import { config } from "config";
import logger from "logger";
import { slackCommandHander } from "lib/slackCommands";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    try {
        if (req.body.token === config.communication.slack.commandToken) {
            next();
        } else {
            throw new Error("Unauthorised");
        }
    } catch (ex) {
        logger.info("Sending a 403");
        res.status(403).end();
    }
});

app.post("/", async (req, res) => {
    const { text, response_url: responseUrl } = req.body;
    slackCommandHander(text, res, responseUrl);
});

app.listen(3030);

