import dotenv from "dotenv";
import { Config } from "./types";
import logger from "logger";

export { FeeTypes, Config, Sheet } from "./types";

if (process.env["PRODUCTION"]) {
  logger.info("RUNNING LIVE CONFIG");
  dotenv.config({ path: "./.env.prod" });
} else {
  logger.info("Running dev config");
  dotenv.config({ path: "./.env" });
}

export const config: Config = {
  availability: {
    sheet: {
      sheetId: process.env.AVAILABILITY_SHEET_ID,
      tabName: process.env.AVAILABILITY_TAB_NAME,
    },
  },
  fees: {
    sendZeroInvoices: false,
    slackWebhookUrl: process.env.SLACK_FINAANCES_WEBHOOK,
    invoiceParams: {
      clientId: process.env["PAYPAL_CLIENT_ID"],
      secret: process.env["PAYPAL_SECRET"],
      sandbox: process.env["PAYPAL_SANDBOX"] == "1",
      invoiceer: {
        company: process.env["PAYPAL_INVOICER_BUSINESS"],
        contactName: process.env["PAYPAL_INVOICER_CONTACT"],
        email: process.env["PAYPAL_INVOICER_EMAIL"],
        logo: process.env["PAYPAL_INVOICER_LOGO"],
      },
    },
  },
  cricket: {
    playCricket: {
      apiKey: process.env["PLAY_CRICKET_API_KEY"],
      siteId: parseInt(process.env["PLAY_CRICKET_SITE_ID"]),
      teams: process.env["PLAY_CRICKET_TEAMS"].split(","),
      divisions: process.env["PLAY_CRICKET_DIVISIONS"].split(","),
    },
  },
  communication: {
    slack: {
      commandToken: process.env["SLACK_COMMAND_TOKEN"],
    },
    mailchimp: {
      apiKey: process.env["MAILCHIMP_API_KEY"],
      listId: process.env["MAILCHIMP_LIST_ID"],
    },
  },
  clubDb: {
    connectionString: process.env["CLUB_DB_CONNECTION"],
    dbName: process.env["CLUB_DB_NAME"],
    exportSheet: {
      sheetId: process.env.MEMBER_EXPORT_SHEET_ID,
      tabName: process.env.MEMBER_EXPORT_TAB_NAME,
    },
  },
};
