import inquirer from "inquirer";
import Table from "cli-table3";
import { config } from "config";
import { getDoc, getSheetByTitle } from "lib/googleSheets/sheets";
import { importFromSpreadsheet } from "club/members/ops";
import { connect, disconnect } from "lib/clubDb";
import {
  produceInvoices,
  owedInvoices as getOwedInvoices,
  chargeSubsForMatch,
} from "club/subs";
import { getRecentMatches } from "club/matches";
import { defaultMaxListeners } from "stream";

export const financeListImport = async () => {
  const sheetId = config.clubDb.exportSheet.sheetId;
  const tabName = "FinanceImport";
  const doc = await getDoc(sheetId);
  const sheet = await getSheetByTitle(tabName, doc);
  const members = await importFromSpreadsheet(sheet);
  console.log(members);
};

export const chargeSubs = async () => {
  connect();
  const answers1 = await inquirer.prompt([
    {
      type: "number",
      name: "days_to_check",
      message: "How many days should we check for matches?",
      default: 6,
    },
  ]);
  const teams = config.cricket.playCricket.teams;
  const matches = await getRecentMatches(
    answers1["days_to_check"],
    config.cricket.playCricket.siteId,
    teams,
  );

  const answers3 = await inquirer.prompt([
    {
      type: "list",
      name: "selected_match",
      message: "Which match do you want to charge subs for?",
      choices: matches.map((m) =>
        `${m.id} - ${m.match_date} - ${m.home_club_name} ${m.home_team_name} v ${m.away_club_name} ${m.away_team_name}`
      ),
    },
  ]);

  const matchId = parseInt(answers3["selected_match"].split("-")[0].trim());
  await chargeSubsForMatch(matchId, config.cricket.playCricket.teams);
  disconnect();
};

export const owedInvoices = async () => {
  const invoices = await getOwedInvoices();
  const trimmedInvoices = invoices.map((i: any) => {
    return {
      id: i.detail.invoice_number,
      date: i.detail.invoice_date,
      currency: i.due_amount.currency_code,
      amount: i.due_amount.value,
      viewed: i.detail.viewed_by_recipient,
      recipient: i.primary_recipients[0].billing_info.email_address,
    };
  });
  const tableList = new Table();
  tableList.push(...trimmedInvoices.map((i: any) => Object.values(i)));
  console.log(tableList.toString());

  const playerOwing: any = {};
  for (const i of trimmedInvoices) {
    if (!Object.keys(playerOwing).includes(i.recipient)) {
      playerOwing[i.recipient] = {
        amount: 0,
        count: 0,
      };
    }
    playerOwing[i.recipient].amount += parseFloat(i.amount);
    playerOwing[i.recipient].count += 1;
  }

  const tablePlayers = new Table();
  tablePlayers.push(
    ...Object.keys(playerOwing).map((
      k,
    ) => ([
      k,
      playerOwing[k].count,
      `GBP ${playerOwing[k].amount.toFixed(2)}`,
    ])),
  );
  console.log(tablePlayers.toString());
};
