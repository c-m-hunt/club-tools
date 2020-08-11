import { produceInvoices, owedInvoices } from "club/subs";
import { getAvailability } from "./club/availability";

import { sendToSlack } from "lib/slack";
import { invoicesList } from "lib/slackCommands/messageCreator";

import { Client } from "play-cricket-client";

import { searchMembers } from "./club/mailingList/mailchimp";

import { program } from "commander";
import { config } from "config";
import logger from "logger";
import { importMembers } from "club/members/import";

program.version("0.1.0");
async function main() {
    program
        .command("availability")
        .option("-d, --date <date>", "date for availability", "Saturday 25th July")
        .action(async (cmd) => {
            const availability = await getAvailability(config.availability.sheet);
            const available = availability.filter(a => (a.availability.includes(cmd.date))).map(a => a.name);
            console.log(available);
        });

    program
        .command("sendinvoices")
        .option("-d, --dryrun", "dry run for invoice sending")
        .option("-s --send", "will send the invoices. If not set, will only create draft")
        .action(async (cmd) => {
            await produceInvoices(cmd.dryrun, cmd.send);
        });

    // program
    //     .command("owing")
    //     .action(async () => {
    //         const invoices = await owedInvoices();
    //         logger.info("Posting unpiad invoice list to Slack");
    //         await sendToSlack(invoicesList("Unpaid invoices", invoices));
    //     });

    // program
    //     .command("leaguetable")
    //     .action(async () => {
    //         const client = new Client(config.cricket.playCricket.apiKey);
    //         const div = await client.getLeagueTable(92794);
    //         console.log(div);
    //     });

    program
        .command("import")
        .action(async () => {
            const members = await importMembers();
            console.log(members);
        });

    program
        .command("searchmember")
        .action(async () => {
            const members = await searchMembers("hunt");
            console.log(members);
        });

    await program.parseAsync(process.argv);
}
main();