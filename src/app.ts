import { program } from "commander";
import { config } from "config";
import {
  financeListImport,
  chargeSubs,
  owedInvoices,
  feeBands,
  addFeeBand,
  insertMember,
} from "cli";
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
    .command("insertmember")
    .description("insert a new club member")
    .action(insertMember);

  program
    .command("subs")
    .description("charge subs for selected matches")
    .action(chargeSubs);

  program
    .command("feebands")
    .description("display the fee bands")
    .action(feeBands);

  program
    .command("addfeeband")
    .description("add a fee band")
    .action(addFeeBand);

  await program.parseAsync(process.argv);
}
main();
