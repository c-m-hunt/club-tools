import { produceInvoices } from "./club/subs";
import { getAvailability } from "./club/availability";
import dotenv from "dotenv";

dotenv.config();

// // produceInvoices();

import { program } from "commander";
program.version("0.1.0");
async function main() {
    program
        .command("availability")
        .option("-d, --date <date>", "date for availability", "Saturday 25th July")
        .action(async (cmd) => {
            getAvailability(
                process.env.AVAILABILITY_SHEET_ID,
                process.env.AVAILABILITY_TAB_NAME
            ).then(data => {
                const available = data.filter(a => (a.availability.includes(cmd.date))).map(a => a.name);
                console.log(available);
            });
        });


    await program.parseAsync(process.argv);
}
main();