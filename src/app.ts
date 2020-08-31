import { getAvailability } from "club/availability";
import { Client } from "play-cricket-client";

import { program } from "commander";
import { config } from "config";
import logger from "logger";
import {
  importMembers,
  exportToSpreadsheet,
  updateMembersFromSpreadsheet,
} from "club/members/ops";
import { getDoc, getSheetByTitle } from "lib/googleSheets/sheets";
import { connect, disconnect } from "lib/clubDb";
import { financeListImport, chargeSubs, owedInvoices } from "cli";
import { searchMembers } from "cli/index";

program.version("0.2.0");
async function main() {
  program
    .command("availability")
    .option("-d, --date <date>", "date for availability", "Saturday 25th July")
    .action(async (cmd) => {
      const availability = await getAvailability(config.availability.sheet);
      const available = availability.filter(
        (a) => (a.availability.includes(cmd.date)),
      ).map((a) => a.name);
      console.log(available);
    });

  program
    .command("owing")
    .action(owedInvoices);

  program
    .command("leaguetable")
    .action(async () => {
      const client = new Client(config.cricket.playCricket.apiKey);
      const div = await client.getLeagueTable(92794);
      console.log(div);
    });

  // program
  //   .command("mailinglistimport")
  //   .action(async () => {
  //     const members = await importMembers();
  //     console.log(members);
  //   });

  program
    .command("financeimport")
    .action(financeListImport);

  // program
  //   .command("export")
  //   .action(async () => {
  //     connect();
  //     const sheetId = config.clubDb.exportSheet.sheetId;
  //     const tabName = config.clubDb.exportSheet.tabName;
  //     const doc = await getDoc(sheetId);
  //     const sheet = await getSheetByTitle(tabName, doc);
  //     await exportToSpreadsheet(sheet);
  //     disconnect();
  //   });

  // program
  //   .command("update")
  //   .action(async () => {
  //     connect();
  //     const sheetId = config.clubDb.exportSheet.sheetId;
  //     const tabName = config.clubDb.exportSheet.tabName;
  //     const doc = await getDoc(sheetId);
  //     const sheet = await getSheetByTitle(tabName, doc);
  //     await updateMembersFromSpreadsheet(sheet);
  //     disconnect();
  //   });

  program
    .command("search <searchText>")
    .action(searchMembers);

  program
    .command("chargesubs")
    .action(chargeSubs);

  await program.parseAsync(process.argv);
}
main();
