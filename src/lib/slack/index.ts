import { IncomingWebhook } from "@slack/webhook";
import { config } from "../../config";

const url = config.fees.slackWebhookUrl;

export const sendToSlack = async (obj: object) => {
    const webhook = new IncomingWebhook(url);
    await webhook.send(obj);
};
