import { IncomingWebhook } from "@slack/webhook";
import { config } from "config";

export const sendToSlack = async (obj: object, url: string = config.fees.slackWebhookUrl) => {
    const webhook = new IncomingWebhook(url);
    await webhook.send(obj);
};
