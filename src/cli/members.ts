import { config } from "config";
import { getDoc, getSheetByTitle } from "lib/googleSheets/sheets";
import { importFromSpreadsheet } from "club/members/ops";
import { connect, disconnect } from "lib/clubDb";
import { searchNames } from "lib/clubDb/search";
import inquirer from "inquirer";
import logger from "logger";
import { Member } from "lib/clubDb/types";
import { insertMember as insertMemberIntoDB } from "lib/clubDb";

export * from "./subs";

export const financeListImport = async () => {
  const sheetId = config.clubDb.exportSheet.sheetId;
  const tabName = "FinanceImport";
  const doc = await getDoc(sheetId);
  const sheet = await getSheetByTitle(tabName, doc);
  const members = await importFromSpreadsheet(sheet);
  console.log(members);
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
  displayMember(member);
  await selectMemberAction(member);
  disconnect();
};

const displayMember = (m: Member) => {
  console.log(`Name:             ${m.firstName} ${m.lastName}`);
  console.log(`Email:            ${m.email}`);
  console.log(`Play Cricket ID:  ${m.externalMapping?.playCricketId}`);
};

export const insertMember = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "member_first_name",
      message: "First name",
      validate: (val) => {
        if (val.length <= 2) {
          return "Please enter a name longer than two characters";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "member_last_name",
      message: "Last name",
      validate: (val) => {
        if (val.length <= 2) {
          return "Please enter a name longer than two characters";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "member_email",
      message: "Email address",
      validate: (val) => {
        if (val.length <= 2) {
          return "Please enter a valid email address";
        }
        if (val.indexOf("@") === -1) {
          return "Please enter a valid email address";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "member_play_cricket_mapping",
      message: "Play Cricket ID",
    },
  ]);

  const member: Member = {
    firstName: answers["member_first_name"],
    lastName: answers["member_last_name"],
    email: answers["member_email"],
    externalMapping: {
      playCricketId: answers["member_play_cricket_mapping"].length > 0
        ? answers["member_play_cricket_mapping"]
        : null,
    },
    tags: ["player"],
  };
  connect();
  const id = await insertMemberIntoDB(member);
  disconnect();
  console.log(`Member inserted with ID ${id}`);
};
