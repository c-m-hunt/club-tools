import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import moment from "moment";
import { getAllMembers, searchMembers } from "../mailingList/mailchimp";
import { Member } from "./../../lib/clubDb/types";
import { connect, insertMember } from "./../../lib/clubDb";
import logger from "./../../logger";
import { config } from "./../../config";

const importMembers = async () => {
    await connect();
    const members = await getAllMembers(config.communication.mailchimp.listId);
    const importedMembers = [];
    for (const m of members) {
        try {
            importedMembers.push(await insertMember(m as Member));
        } catch (ex) {
            logger.error("Failed to insert for:");
            logger.error(JSON.stringify(m, null, 2));
        }

    }
    console.log(importedMembers);
};

export const getContactFormResponses = async (sheet: GoogleSpreadsheetWorksheet): Promise<Member[]> => {
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

importMembers();