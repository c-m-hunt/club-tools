import mongoose from "mongoose";
import { Member, MemberDB, MemberSchema } from "./types";

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
    //logger.debug(JSON.stringify(member, null, 2));
    //logger.debug(JSON.stringify(createdMember, null, 2));
    return createdMember._id;
};

export const updateMembers = async (members: Partial<MemberDB>[]) => {
    const MemberModel = getMembmerModel();
    const bulk = MemberModel.collection.initializeUnorderedBulkOp();
    for (const m of members) {
        if (m._id) {
            const id = m._id;
            delete m._id;
            bulk.find({ "_id": mongoose.Types.ObjectId(id) }).updateOne({ $set: m });
        }
    }
    const results = await bulk.execute();
    console.log(results);
};

export const getMembers = async (): Promise<any[]> => {
    const MemberModel = getMembmerModel();
    return await MemberModel.find({}).sort({ lastName: 1, firstName: 1 }).exec();
};

export const disconnect = async () => {
    await mongoose.disconnect();
};