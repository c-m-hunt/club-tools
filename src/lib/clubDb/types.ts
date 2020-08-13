import { prop } from "@typegoose/typegoose";

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
    homePhone?: string;
    @prop()
    mobilePhone?: string;
    @prop()
    email?: string;
    @prop({ _id: false })
    externalMapping: ExternalMapping
    @prop()
    tags?: string[];
}

export const memberToSpreadsheetRow = (m: any) => ({
    id: (m as any)._id,
    firstName: m.firstName,
    lastName: m.lastName,
    email: m.email,
    tags: m.tags?.join(",")
});