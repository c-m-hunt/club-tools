import { produceInvoices } from "./club/subs";
import { getAvailability } from "./club/availability";
import { program } from "commander";
import { config } from "./config";

program.version("0.1.0");
async function main() {
    program
        .command("availability")
        .option("-d, --date <date>", "date for availability", "Saturday 25th July")
        .action(async (cmd) => {
            getAvailability(config.availability.sheet).then(data => {
                const available = data.filter(a => (a.availability.includes(cmd.date))).map(a => a.name);
                console.log(available);
            });
        });


    // program
    //     .command("sendinvoices")
    //     .option("-d, --dryrun <date>", "date for availability", "Saturday 25th July")
    //     .action(async (cmd) => {
    //         getAvailability(
    //             ,

    //         ).then(data => {
    //             const available = data.filter(a => (a.availability.includes(cmd.date))).map(a => a.name);
    //             console.log(available);
    //         });
    //     });

    await program.parseAsync(process.argv);
}
main();