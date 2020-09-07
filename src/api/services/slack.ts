import { Router } from "express";
import bodyParser from "body-parser";
import { config } from "config";
import logger from "logger";
import { slackCommandHander } from "lib/slackCommands";
import { defaultMaxListeners } from "stream";

const router = Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.use((req, res, next) => {
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

router.post("/", async (req, res) => {
  const { text, response_url: responseUrl } = req.body;
  slackCommandHander(text, res, responseUrl);
});

export default router;
