import { produceInvoices, owedInvoices } from "club/subs";
import { getAvailability } from "./club/availability";

import { sendToSlack } from "lib/slack";
import { invoicesList } from "lib/slackCommands/messageCreator";

import { Client } from "play-cricket-client";

import { searchMembers } from "./club/mailingList/mailchimp";

import { program } from "commander";
import { config } from "config";
import logger from "logger";
import fs from "fs";
import {
  importMembers,
  exportToSpreadsheet,
  updateMembersFromSpreadsheet,
  importFromSpreadsheet,
} from "club/members/ops";
import { getDoc, getSheetByTitle } from "lib/googleSheets/sheets";
import { getRegisterFromSheet } from "club/registerSheet";
import { searchNames } from "lib/clubDb/search";
import { connect, disconnect } from "lib/clubDb";
import { ResultSummaryResponse } from "play-cricket-client/dist/lib/interface/resultSummary";
import { financeListImport, chargeSubs } from "cli";

program.version("0.1.0");
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
    .command("sendinvoices")
    .option("-d, --dryrun", "dry run for invoice sending")
    .option(
      "-s --send",
      "will send the invoices. If not set, will only create draft",
    )
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

  program
    .command("leaguetable")
    .action(async () => {
      const client = new Client(config.cricket.playCricket.apiKey);
      const div = await client.getLeagueTable(92794);
      console.log(div);
    });

  program
    .command("mailinglistimport")
    .action(async () => {
      const members = await importMembers();
      console.log(members);
    });

  program
    .command("financeimport")
    .action(financeListImport);

  program
    .command("export")
    .action(async () => {
      connect();
      const sheetId = config.clubDb.exportSheet.sheetId;
      const tabName = config.clubDb.exportSheet.tabName;
      const doc = await getDoc(sheetId);
      const sheet = await getSheetByTitle(tabName, doc);
      await exportToSpreadsheet(sheet);
      disconnect();
    });

  program
    .command("update")
    .action(async () => {
      connect();
      const sheetId = config.clubDb.exportSheet.sheetId;
      const tabName = config.clubDb.exportSheet.tabName;
      const doc = await getDoc(sheetId);
      const sheet = await getSheetByTitle(tabName, doc);
      await updateMembersFromSpreadsheet(sheet);
      disconnect();
    });

  program
    .command("searchmember <searchText>")
    .action(async (searchText: string) => {
      connect();
      const members = await searchNames(searchText);
      console.log(members);
      disconnect();
    });

  program
    .command("chargesubs")
    .action(chargeSubs);

  await program.parseAsync(process.argv);
}
main();
