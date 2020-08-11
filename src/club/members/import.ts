import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { getAllMembers } from "../mailingList/mailchimp";
import { Member } from "lib/clubDb/types";
import { connect, disconnect, insertMember } from "lib/clubDb";
import logger from "logger";
import { config } from "config";

export const importMembers = async () => {
    await connect();
    const members = await getAllMembers(config.communication.mailchimp.listId);
    const importedMembers = [];
    for (const m of members) {
        try {
            importedMembers.push(insertMember(m as Member));
        } catch (ex) {
            logger.error("Failed to insert for:");
            logger.error(JSON.stringify(m, null, 2));
        }
    }
    const responses = await Promise.all(importedMembers);
    disconnect();
    return responses;
};

export const exportToSpreadsheet = () => {

};

export const importFromSpreadsheet = () => {

};

export const updateDatabase = (members: Member[]) => {

};

export const getContactFormResponses = async (sheet: GoogleSpreadsheetWorksheet): Promise<object[]> => {
    const rows = await sheet.getRows({ offset: 0, limit: 50 });
    const contactForms = rows.map(row => {
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