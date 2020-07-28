import { GBP } from "./../consts";
import { FeeTypes } from "./types";

export const feeTypes: FeeTypes = {
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
