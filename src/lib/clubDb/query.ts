import { MemberDB } from "./types";
import { MemberModel } from "./models";

export const getMembers = async (): Promise<MemberDB[]> => {
  return await MemberModel.find({}).sort({ lastName: 1, firstName: 1 })
    .populate("matchFeeDetails")
    .exec();
};

export const getPlayerByPlayCricketId = async (
  id: number,
): Promise<MemberDB[]> => {
  return await MemberModel.find(
    { "externalMapping.playCricketId": id.toString() },
  )
    .populate("matchFeeDetails")
    .exec();
};
