import { config } from "config";
import { getDoc, getSheetByTitle } from "lib/googleSheets/sheets";
import { importFromSpreadsheet } from "club/members/ops";
import { connect, disconnect } from "lib/clubDb";
import { searchNames } from "lib/clubDb/search";
import inquirer from "inquirer";
import logger from "logger";
import { Member } from "lib/clubDb/types";

export * from "./subs";

export const financeListImport = async () => {
  const sheetId = config.clubDb.exportSheet.sheetId;
  const tabName = "FinanceImport";
  const doc = await getDoc(sheetId);
  const sheet = await getSheetByTitle(tabName, doc);
  const members = await importFromSpreadsheet(sheet);
  console.log(members);
};

export const searchMembers = async (searchText: string) => {
  connect();
  const members = await searchNames(searchText);
  const answers1 = await inquirer.prompt([
    {
      type: "list",
      name: "select_member",
      message: "Select a member",
      choices: members.map((m) => ({
        name: `${m.firstName} ${m.lastName}`,
        value: m,
      })),
    },
  ]);
  const member = answers1["select_member"];
  logger.info(`Selected ${member.firstName} ${member.lastName}`);
  await selectMemberAction(member);
  disconnect();
};

const selectMemberAction = async (m: Member) => {
  const answers1 = await inquirer.prompt([
    {
      type: "list",
      name: "select_action",
      message: "Select an action",
      choices: [
        { name: "Change fee band", value: "fee" },
        { name: "Change email address", value: "email" },
      ],
    },
  ]);
};
