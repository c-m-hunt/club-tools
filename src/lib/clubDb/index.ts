import mongoose from "mongoose";
import { Member } from "./types";

import { config } from "config";
import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import logger from "logger";


let MemberModel: null | ReturnModelType<typeof Member> = null;
export const getMembmerModel = () => {
    if (MemberModel) {
        return MemberModel;
    }
    MemberModel = getModelForClass(Member);
    MemberModel.schema.index({ firstName: "text", lastName: "text" });
    return MemberModel;
};

export const connect = async () => {
    await mongoose.connect(config.clubDb.connectionString, { useNewUrlParser: true, useUnifiedTopology: true, dbName: config.clubDb.dbName });
};

export const insertMember = async (member: Member) => {
    const MemberModel = getMembmerModel();
    const createdMember = await MemberModel.create(member);
    // logger.debug("Inserted:");
    // logger.debug(JSON.stringify(createdMember, null, 2));
    return createdMember._id;
};

export const getMembers = async (): Promise<Member[]> => {
    const MemberModel = getMembmerModel();
    return await MemberModel.find({}).sort({ lastName: 1, firstName: 1 }).exec();
};

export const disconnect = async () => {
    await mongoose.disconnect();
};