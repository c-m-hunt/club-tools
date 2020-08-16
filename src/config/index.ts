import dotenv from "dotenv";
import { Config } from "./types";
import { feeTypes } from "./fees";

export { FeeTypes, Config, Sheet } from "./types";

dotenv.config({ path: "./.env" });

export const config: Config = {
    availability: {
        sheet: {
            sheetId: process.env.AVAILABILITY_SHEET_ID,
            tabName: process.env.AVAILABILITY_TAB_NAME
        }
    },
    register: {
        sheet: {
            sheetId: process.env.REGISTER_SHEET_ID,
            tabName: process.env.REGISTER_TAB_NAME
        }
    },
    fees: {
        feeTypes,
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
            }

        }
    },
    cricket: {
        playCricket: {
            apiKey: process.env["PLAY_CRICKET_API_KEY"]
        }
    },
    communication: {
        slack: {
            commandToken: process.env["SLACK_COMMAND_TOKEN"]
        },
        mailchimp: {
            apiKey: process.env["MAILCHIMP_API_KEY"],
            listId: process.env["MAILCHIMP_LIST_ID"]
        }
    },
    clubDb: {
        connectionString: process.env["CLUB_DB_CONNECTION"],
        dbName: process.env["CLUB_DB_NAME"],
        exportSheet: {
            sheetId: process.env.MEMBER_EXPORT_SHEET_ID,
            tabName: process.env.MEMBER_EXPORT_TAB_NAME
        }
    }
};


