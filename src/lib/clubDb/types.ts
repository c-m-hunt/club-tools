import { prop } from "@typegoose/typegoose";
import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { Schema } from "mongoose";

export class ExternalMapping {
    @prop()
    mailchimpId: string;
}


export class Member {
    @prop({ required: true })
    public firstName: string;
    @prop({ required: true })
    lastName: string;
    @prop()
    mobilePhone?: string;
    @prop()
    email?: string;
    @prop({ _id: false })
    externalMapping?: ExternalMapping
    @prop({ type: String })
    tags: string[];
}

export const MemberSchema = new Schema({
    firstName: String,
    lastName: String,
    mobilePhone: String,
    email: String,
    externalMapping: {
        mailchimpId: String
    },
    tags: [String]
});

export class MemberDB extends Member {
    _id: string;
}

export const memberToSpreadsheetRow = (m: MemberDB) => ({
    id: m._id,
    firstName: m.firstName,
    lastName: m.lastName,
    email: m.email,
    tags: m.tags?.join(",")
});

export const spreadsheetRowToMember = (row: GoogleSpreadsheetRow): Partial<MemberDB> => {
    const tagString = row._rawData[4] as string;
    return {
        _id: row._rawData[0] as string,
        firstName: row._rawData[1] as string,
        lastName: row._rawData[2] as string,
        email: row._rawData[3] as string,
        tags: tagString ? tagString.split(",") : []
    };
};