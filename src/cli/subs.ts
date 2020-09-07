import Table from "cli-table3";
import inquirer from "inquirer";
import chalk from "chalk";

import { config } from "config";
import { connect, disconnect } from "lib/clubDb";
import {
  produceInvoices,
  getPlayersAndFeesForMatch,
  owedInvoices as getOwedInvoices,
} from "club/subs";
import { getRecentMatches } from "club/matches";
import logger from "logger";
import { insertFeeBand, getFeeBands } from "lib/clubDb/fees";
import { getMembers } from "lib/clubDb/query";
import { MatchFee } from "club/feeTypes";
import { FeeBand } from "lib/clubDb/types";

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
        type: "checkbox",
        name: "selected_players",
        pageSize: 15,
        message: "Select players to charge?",
        choices: players.map((p) => ({
          name:
            `${p.name} - ${p.fee.description} - ${p.fee.currency} ${p.fee.amount}`,
          value: p,
          checked: true,
        })),
      },
    ]);
    const playersToInvoice = answers3["selected_players"];
    await produceInvoices(playersToInvoice, false, true);
  }
  disconnect();
};

export const owedInvoices = async () => {
  const { invoices, summary } = await getOwedInvoices();

  const tableList = new Table(
    {
      head: ["Invoice ID", "Date", "Curr", "Amount", "Read", "Email"],
      chars: { "mid": "", "left-mid": "", "mid-mid": "", "right-mid": "" },
    },
  );
  tableList.push(
    ...invoices.reverse().map((i: any) => Object.values(i)),
  );
  console.log(tableList.toString());

  const tablePlayers = new Table(
    {
      head: [
        "Email",
        "Count",
        "Total",
      ],
      chars: { "mid": "", "left-mid": "", "mid-mid": "", "right-mid": "" },
    },
  );
  tablePlayers.push(
    ...Object.keys(summary).map((
      k,
    ) => ([
      k,
      summary[k].count,
      `GBP ${summary[k].amount.toFixed(2)}`,
    ])),
  );
  console.log(tablePlayers.toString());

  console.log(chalk.bold.bgRed.white(
    ` TOTAL OUTSTANDING: GBP ${
      Object.values(summary).reduce((a, b) => a + b.amount, 0)
    } `,
  ));
};

export const feeBands = async () => {
  connect();
  const feeBands = await getFeeBands();
  const tableFees = new Table(
    {
      head: [
        "Code",
        "Name",
        "Amount",
      ],
      chars: { "mid": "", "left-mid": "", "mid-mid": "", "right-mid": "" },
    },
  );
  tableFees.push(...feeBands.map((f) => {
    const fee = f.toObject();
    return [
      fee.bandCode,
      fee.description,
      `${fee.currency} ${fee.amount}`,
    ];
  }));

  console.log(tableFees.toString());
  disconnect();
};

export const addFeeBand = async () => {
  connect();
  const feeBands = await getFeeBands();
  const feeBandCodes = feeBands.map((f) => f.bandCode);
  const answers = await inquirer.prompt([
    {
      type: "string",
      name: "code",
      message: "Enter a code for the fee band",
      validate: (val) => {
        if (feeBandCodes.includes(val)) {
          return "Fee band code already exists. Please try again.";
        }
        if (val.length >= 3) {
          return "Please ensure the code is less than three characters";
        }
        return true;
      },
    },
    {
      type: "string",
      name: "description",
      message: "Enter a description for the fee band",
      validate: (val) => {
        if (val.length >= 4) {
          return true;
        }
        return "Please enter a valid fee band description";
      },
    },
    {
      type: "number",
      name: "amount",
      message: "Enter an amount for the fee band",
    },
  ]);
  const fee: FeeBand = {
    amount: answers["amount"],
    description: answers["description"],
    currency: "GBP",
    bandCode: answers["code"],
  };
  const id = await insertFeeBand(fee);
  console.log(`Fee band inserted as id ${id}`);
  disconnect();
};
