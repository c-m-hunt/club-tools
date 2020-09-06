import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { getAllMembers } from "../mailingList/mailchimp";
import {
  Member,
  memberToSpreadsheetRow,
  MemberDB,
  spreadsheetRowToMember,
} from "lib/clubDb/types";
import {
  connect,
  disconnect,
  insertMember,
  updateMembersById,
  updateMembersByPlayCricketId,
} from "lib/clubDb";
import {
  getMembers,
} from "lib/clubDb/query";
import logger from "logger";
import { config } from "config";
import moment from "moment";
import { getFeeBands } from "lib/clubDb/fees";

export const importFromSpreadsheet = async (
  sheet: GoogleSpreadsheetWorksheet,
) => {
  await connect();
  const feeBands = await getFeeBands();
  const feeBandCodes = feeBands.map((f) => f.bandCode);
  const rows = await sheet.getRows({ offset: 0, limit: 500 });
  const members: Member[] = rows.map((row) => {
    return {
      firstName: row._rawData[0] as string,
      lastName: row._rawData[1] as string,
      dateOfBirth: row._rawData[2]
        ? moment(row._rawData[2], "DD-MMM-YYYY").toDate()
        : null,
      externalMapping: {
        playCricketId: row._rawData[3] as string,
      },
      matchFeeBand: row._rawData[5] && feeBandCodes.includes(row._rawData[5])
        ? row._rawData[5]
        : null,
      email: row._rawData[4] as string,
      tags: ["Player"],
    };
  });
  const response = await updateMembersByPlayCricketId(members);
  disconnect();
  return response;
};

export const importMembers = async () => {
  await connect();
  const members = await getAllMembers(config.communication.mailchimp.listId);
  const importedMembers = [];
  for (const m of members) {
    try {
      importedMembers.push((m as Member));
    } catch (ex) {
      logger.error("Failed to insert for:");
      logger.error(JSON.stringify(m, null, 2));
    }
  }
  const responses = await Promise.all(importedMembers);
  disconnect();
  return responses;
};

export const exportToSpreadsheet = async (
  sheet: GoogleSpreadsheetWorksheet,
) => {
  await sheet.clear();
  await sheet.setHeaderRow(
    ["id", "firstName", "lastName", "phone", "email", "tags"],
  );
  const members = await getMembers();
  console.log(members);
  const rows = members.map((m) => memberToSpreadsheetRow(m));
  await sheet.addRows(rows);
};

const getMembersExport = async (
  sheet: GoogleSpreadsheetWorksheet,
): Promise<Partial<MemberDB>[]> => {
  const rows = await sheet.getRows({ offset: 1, limit: 500 });
  const members = rows.map((row) => spreadsheetRowToMember(row));
  return members;
};

export const updateMembersFromSpreadsheet = async (
  sheet: GoogleSpreadsheetWorksheet,
) => {
  const members = await getMembersExport(sheet);
  await updateMembersById(members);
};

export const getContactFormResponses = async (
  sheet: GoogleSpreadsheetWorksheet,
): Promise<object[]> => {
  const rows = await sheet.getRows({ offset: 0, limit: 50 });
  const contactForms = rows.map((row) => {
    return {
      dateCompleted: row._rawData[0] as string,
      email: row._rawData[1] as string,
      name: row._rawData[2] as string,
      address: row.__rawData[3] as string,
      phone: row._rawData[3] as string,
    };
  });
  return contactForms;
};
