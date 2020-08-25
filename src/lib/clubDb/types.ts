import { prop } from "@typegoose/typegoose";
import { GoogleSpreadsheetRow } from "google-spreadsheet";

export class ExternalMapping {
  @prop()
  mailchimpId?: string;
  @prop()
  playCricketId?: string;
}

export class Member {
  @prop({ required: true })
  firstName: string;
  @prop({ required: true })
  lastName: string;
  @prop()
  dateOfBirth?: Date;
  @prop()
  phone?: string;
  @prop()
  email?: string;
  @prop({ _id: false })
  externalMapping?: ExternalMapping;
  @prop({ type: String })
  tags: string[];
}

export class MemberDB extends Member {
  _id: string;
}

export const memberToSpreadsheetRow = (m: MemberDB) => ({
  id: m._id,
  firstName: m.firstName,
  lastName: m.lastName,
  phone: m.phone,
  email: m.email,
  tags: m.tags?.join(","),
});

export const spreadsheetRowToMember = (
  row: GoogleSpreadsheetRow,
): Partial<MemberDB> => {
  const tagString = row._rawData[4] as string;
  return {
    _id: row._rawData[0] as string,
    firstName: row._rawData[1] as string,
    lastName: row._rawData[2] as string,
    phone: row._rawData[3] as string,
    email: row._rawData[4] as string,
    tags: tagString ? tagString.split(",") : [],
  };
};
