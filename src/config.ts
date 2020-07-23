import dotenv from "dotenv";
import { GBP } from "./consts";

dotenv.config();

export interface Sheet {
    sheetId: string;
    tabName: string;
}

export interface Config {
    availability: {
        sheet: Sheet;
    };
    fees: {
        feeTypes: FeeTypes;
    };
}

export interface FeeTypes {
    [key: string]: {
        description: string;
        value: number;
        currency: "GBP";
    };
}

const feeTypes: FeeTypes = {
    A: {
        description: "Adult",
        value: 10,
        currency: GBP
    },
    A1: {
        description: "Adult (one 100 Club number)",
        value: 5,
        currency: GBP
    },
    A2: {
        description: "Adult (two 100 Club numbers)",
        value: 0,
        currency: GBP
    },
    A3: {
        description: "Adult (three or more 100 Club numbers)",
        value: 0,
        currency: GBP
    },
    Y: {
        description: "Youth",
        value: 0,
        currency: GBP
    },
    S: {
        description: "Student",
        value: 5,
        currency: GBP
    },
};

export const config: Config = {
    availability: {
        sheet: {
            sheetId: process.env.AVAILABILITY_SHEET_ID,
            tabName: process.env.AVAILABILITY_TAB_NAME
        }
    },
    fees: {
        feeTypes
    }
};

