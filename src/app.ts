import { program } from "commander";
import { config } from "config";
import { financeListImport, chargeSubs, owedInvoices } from "cli";
import { searchMembers } from "cli/index";
import { leagueTables } from "cli/cricket";

program.version("0.2.0");
async function main() {
  program
    .command("owing")
    .description("lists match fees owing and summary")
    .action(owedInvoices);

  program
    .command("leaguetables")
    .description("displays current league tables")
    .action(async () => {
      await leagueTables(config.cricket.playCricket.divisions);
    });

  program
    .command("financeimport")
    .description(
      "imports updated spreadsheet from Google sheets with Play Cricket mapping",
    )
    .action(financeListImport);

  program
    .command("search <searchText>")
    .description("search for club member and actions")
    .action(searchMembers);

  program
    .command("subs")
    .description("charge subs for selected matches")
    .action(chargeSubs);

  program
    .command("feebands")
    .description("display the fee bands")
    .action(() => {
      throw new Error("This method isn't currently implemented");
    });

  program
    .command("insertfeeband")
    .description("inserts a new fee band")
    .action(() => {
      throw new Error("This method isn't currently implemented");
    });

  await program.parseAsync(process.argv);
}
main();
