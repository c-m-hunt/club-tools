import mongoose from "mongoose";
import { Member } from "./types";

import { config } from "config";
import { getModelForClass } from "@typegoose/typegoose";
import logger from "logger";

const MemberModel = getModelForClass(Member);

export const connect = async () => {
    await mongoose.connect(config.clubDb.connectionString, { useNewUrlParser: true, useUnifiedTopology: true, dbName: config.clubDb.dbName });
};

export const insertMember = async (member: Member) => {
    const createdMember = await MemberModel.create(member);
    // logger.debug("Inserted:");
    // logger.debug(JSON.stringify(createdMember, null, 2));
    return createdMember._id;
};

export const disconnect = async () => {
    await mongoose.disconnect();
};