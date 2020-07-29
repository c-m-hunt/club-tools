import { Response } from "express";
import logger from "./../../logger";
import { owedInvoices } from "./../../club/subs";
import { sendToSlack } from "../slack";
import { invoicesList, memberList } from "./messageCreator";
import { searchMembers } from "./../../club/members";

type SubCommand = {
    commandFn: (text?: string) => Promise<void>;
    requestConfirmation: string;
}

export abstract class SlackCommand {
    hasSubCommands: boolean;
    requestConfirmation = "";
    responseUrl: string;
    subCommand: null | string = null;
    text: null | string = null;
    subCommands: {
        [key: string]: SubCommand;
    } = {};
    constructor(text: string, responseUrl: string) {
        this.text = text;
        this.responseUrl = responseUrl;
    }
    classSetup = () => {
        logger.info(`${this.constructor.name}`);
        logger.info(`Has subcommands ${this.hasSubCommands}`);
        logger.info(JSON.stringify(this));
        if (this.hasSubCommands) {
            const textParts = this.text.split(" ");
            this.subCommand = textParts[1];
            logger.info(`Running subcommand ${this.subCommand}`);
            const command = this.subCommands[this.subCommand];
            this.requestConfirmation = command.requestConfirmation;
            command.commandFn(textParts.slice(2).join(" "));
        }
    }
    help: object | string = "Help not available at this time";
}

export class Fees extends SlackCommand {
    hasSubCommands = true;
    allowedSubCommands = ["owing"] as const;
    constructor(text: string, responseUrl: string) {
        super(text, responseUrl);
        this.classSetup();
    }
    owing = async () => {
        const invoices = await owedInvoices();
        logger.info("Posting unpiad invoice list to Slack");
        await sendToSlack(invoicesList("Unpaid invoices", invoices), this.responseUrl);
        this.requestConfirmation = "Getting owing invoice list. Few seconds....";
    }

    subCommands = {
        "owing": {
            commandFn: this.owing,
            requestConfirmation: "Finding owed fees. Please wait..."
        }
    } as const
    help = "This is some help text"
}

export class Members extends SlackCommand {
    hasSubCommands = true;
    constructor(text: string, responseUrl: string) {
        super(text, responseUrl);
        this.classSetup();
    }
    search = async (text: string) => {
        logger.info(`Search for members: \`${text}\``);
        const members = await searchMembers(text);
        const title = `Search for members: \`${text}\` - found ${members.length}`;
        return await sendToSlack(memberList(title, members), this.responseUrl);
    }
    subCommands = {
        "search": {
            commandFn: this.search,
            requestConfirmation: "Searching members"
        }
    } as const
    help = "This is some help text"
}

const commands = {
    "fees": Fees,
    "members": Members,
} as const;

type Command = keyof typeof commands;

export const slackCommandHander = (text: string, res: Response, responseUrl: string) => {
    const textParts = text.split(" ");
    if (textParts.length === 0) {
        res.send(`No command supplied. Send one of \`${Object.keys(commands).join(",")}\``);
    } else {
        const command = textParts[0];
        if (Object.keys(commands).includes(command)) {
            const cls = new commands[command as Command](text, responseUrl);
            if (cls.requestConfirmation.length > 0) {
                res.send(cls.requestConfirmation);
            } else {
                res.status(200).end();
            }
        } else {
            res.send(`Unknown command. Try one of \`${Object.keys(commands).join(", ")}\``);
        }
    }
};
