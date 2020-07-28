import { produceInvoices, owedInvoices } from "./club/subs";
import { getAvailability } from "./club/availability";

import { sendToSlack } from "./lib/slack";
import { invoicesList } from "./lib/slack/messageCreator";

import { program } from "commander";
import { config } from "./config";
import logger from "./logger";

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
        .action(async (cmd) => {
            await produceInvoices(cmd.dryrun);
        });

    program
        .command("owing")
        .action(async (cmd) => {
            const invoices = await owedInvoices();

            await sendToSlack(invoicesList(`Unpaid invoices at ${new Date().toLocaleDateString("en-GB")}`, invoices));
        });

    await program.parseAsync(process.argv);
}
main();