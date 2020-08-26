import { getMembmerModel } from ".";
import { MemberDB, Member } from "./types";

export const getMembers = async (): Promise<MemberDB[]> => {
  const MemberModel = getMembmerModel();
  return await MemberModel.find({}).sort({ lastName: 1, firstName: 1 }).exec();
};

export const getPlayerByPlayCricketId = async (
  id: number,
): Promise<MemberDB[]> => {
  const MemberModel = getMembmerModel();
  return await MemberModel.find(
    { "externalMapping.playCricketId": id.toString() },
  )
    .exec();
};
