import Table from "cli-table3";
import inquirer from "inquirer";

import { config } from "config";
import { connect, disconnect } from "lib/clubDb";
import {
  produceInvoices,
  getPlayersAndFeesForMatch,
  owedInvoices as getOwedInvoices,
} from "club/subs";
import { getRecentMatches } from "club/matches";
import logger from "logger";

export const chargeSubs = async () => {
  connect();
  const answers1 = await inquirer.prompt([
    {
      type: "number",
      name: "days_to_check",
      message: "How many days should we check for matches?",
      default: 6,
      validate: (val) => {
        const days = parseInt(val);
        if (days > 0 && days <= 30) {
          return true;
        }
        return "Please enter a valid number of days between 1 and 30";
      },
    },
  ]);
  const teams = config.cricket.playCricket.teams;
  const matches = await getRecentMatches(
    answers1["days_to_check"],
    config.cricket.playCricket.siteId,
    teams,
  );

  const answers2 = await inquirer.prompt([
    {
      type: "list",
      name: "selected_match",
      message: "Which match do you want to charge subs for?",
      choices: matches.map((m) => (
        {
          name:
            `${m.id} - ${m.match_date} - ${m.home_club_name} ${m.home_team_name} v ${m.away_club_name} ${m.away_team_name}`,
          value: m.id,
        }
      )),
    },
  ]);
  const matchId = parseInt(answers2["selected_match"]);
  const { players, errors } = await getPlayersAndFeesForMatch(
    matchId,
    config.cricket.playCricket.teams,
  );
  if (errors > 0) {
    logger.error(
      "There were errors collecting player fee information. Aborting.",
    );
  } else {
    const answers3 = await inquirer.prompt([
      {
        type: "list",
        name: "dry_run",
        message: "Would you like to run a dry run first?",
        choices: [
          { name: "No - send the invoices", value: false },
          { name: "Yes - run a dry run and show output", value: true },
        ],
      },
    ]);
    const dryRun = answers3["dry_run"];
    await produceInvoices(players, dryRun, true);
  }
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
