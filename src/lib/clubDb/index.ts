import mongoose from "mongoose";
import { Member, MemberDB } from "./types";

import { config } from "config";
import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import logger from "logger";

let MemberModel: null | ReturnModelType<typeof Member> = null;
export const getMembmerModel = () => {
  if (MemberModel) {
    return MemberModel;
  }
  MemberModel = getModelForClass(Member);
  return MemberModel;
};

export const connect = async () => {
  await mongoose.connect(
    config.clubDb.connectionString,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      dbName: config.clubDb.dbName,
    },
  );
};

export const insertMember = async (member: Member) => {
  const MemberModel = getMembmerModel();
  const createdMember = await MemberModel.create(member);
  return createdMember._id;
};

export const updateMembersByPlayCricketId = async (
  members: Partial<Member>[],
) => {
  const MemberModel = getMembmerModel();
  const bulk = MemberModel.collection.initializeUnorderedBulkOp();
  for (const m of members) {
    if (m.externalMapping.playCricketId) {
      bulk.find(
        {
          "externalMapping.playCricketId": m.externalMapping.playCricketId,
        },
      ).upsert().updateOne(m);
    } else {
      logger.info(
        `Could not insert/update ${m.firstName} ${m.lastName} as they have no Play Cricket ID`,
      );
    }
  }
  const results = await bulk.execute();
  console.log(results);
};

export const updateMembersById = async (members: Partial<MemberDB>[]) => {
  const MemberModel = getMembmerModel();
  const bulk = MemberModel.collection.initializeUnorderedBulkOp();
  for (const m of members) {
    if (m._id) {
      const id = m._id;
      delete m._id;
      bulk.find({ "_id": mongoose.Types.ObjectId(id) }).updateOne({ $set: m });
    } else {
      bulk.insert(m);
    }
  }
  const results = await bulk.execute();
  console.log(results);
};

export const disconnect = async () => {
  await mongoose.disconnect();
};
