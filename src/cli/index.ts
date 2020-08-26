import { config } from "config";
import { getDoc, getSheetByTitle } from "lib/googleSheets/sheets";
import { importFromSpreadsheet } from "club/members/ops";

export * from "./subs";

export const financeListImport = async () => {
  const sheetId = config.clubDb.exportSheet.sheetId;
  const tabName = "FinanceImport";
  const doc = await getDoc(sheetId);
  const sheet = await getSheetByTitle(tabName, doc);
  const members = await importFromSpreadsheet(sheet);
  console.log(members);
};
