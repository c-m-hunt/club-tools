import { getDoc as getDocAsync, getSheetByTitle } from "./../googleSheets/sheets";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Sheet } from "./../config";

let doc: null | GoogleSpreadsheet = null;
const getDoc = async (docId: string) => {
    if (doc) {
        return doc;
    }
    doc = await getDocAsync(docId);
    return doc;
};

export const getAvailability = async (sheetLocation: Sheet) => {
    const doc = await getDoc(sheetLocation.sheetId);
    const sheet = await getSheetByTitle(sheetLocation.tabName, doc);
    const rows = await sheet.getRows();
    const data = rows.map(r => ({
        name: r._rawData[1],
        availability: r._rawData[2].split(",").map((a: string) => a.trim()),
        transport: r._rawData[3],
        comments: r._rawData[4]
    }));
    return data;
};

