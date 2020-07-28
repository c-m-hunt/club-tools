import express from "express";
import bodyParser from "body-parser";
import { config } from "./config";
import { owedInvoices } from "./club/subs";
import logger from "./logger";
import { sendToSlack } from "./lib/slack";
import { invoicesList } from "./lib/slack/messageCreator";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    try {
        if (req.body.token === config.communication.slack.commandToken) {
            next();
        }
        logger.error("Unauthorised");
        throw new Error("Unauthorised");
    } catch (ex) {
        logger.info("Sending a 403");
        res.status(403).end();
    }
});

const supportedCommands = ['owing'];

app.post("/", async (req, res) => {
    const { text, response_url: responseUrl } = req.body;
    if (text.startsWith("owing")) {
        res.send("Getting owing invoice list. Few seconds....");
        const invoices = await owedInvoices();
        logger.info("Posting unpiad invoice list to Slack");
        await sendToSlack(invoicesList("Unpaid invoices", invoices), responseUrl);
    } else {
        res.send(`Unknown command. Try one of \`${supportedCommands.join(", ")}\``);
    }
});


app.listen(3030);