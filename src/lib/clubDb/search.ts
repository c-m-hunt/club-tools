import { Member } from "./types";
import { getMembmerModel } from ".";
export const searchNames = async (search: string): Promise<Member[]> => {
    const MemberModel = getMembmerModel();
    const searchResults = await MemberModel.find({ $text: { $search: search } }).sort({ lastName: 1, firstName: 1 }).exec();
    return searchResults;
};