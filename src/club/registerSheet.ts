import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { MatchPlayer } from "./feeTypes";
import moment from "moment";

export interface Player {
  name: string;
  feeType: string;
}

// export const getRegisterFromSheet = async (sheet: GoogleSpreadsheetWorksheet): Promise<MatchPlayer[]> => {
//     const rows = await sheet.getRows({ offset: 0, limit: 50 });
//     const register = rows.map(row => {
//         return {
//             dateCompleted: row._rawData[0] as string,
//             name: row._rawData[1] as string,
//             phone: row._rawData[2] as string,
//             email: row._rawData[3] as string,
//             confirm: (row._rawData[4] as string) === "Confirmed",
//             match: row._rawData[5] as string,
//             feeType: row._rawData[7] as string,
//             date: moment(row._rawData[6])
//         };
//     });
//     return register;
// };
