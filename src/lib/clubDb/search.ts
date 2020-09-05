import { MemberModel } from "./models";
export const searchNames = async (search: string): Promise<any[]> => {
  const searchResults = await MemberModel.find({ $text: { $search: search } })
    .sort({ lastName: 1, firstName: 1 }).exec();
  return searchResults;
};
