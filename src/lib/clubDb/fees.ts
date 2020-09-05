import { FeeBand } from "./types";
import { FeeBandModel } from "./models";

export const insertFeeBand = async (feeBand: FeeBand) => {
  const createdFeeBand = await FeeBandModel.create(feeBand);
  console.log(createdFeeBand);
  return createdFeeBand._id;
};
