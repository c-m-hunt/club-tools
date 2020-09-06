import { FeeBand } from "./types";
import { FeeBandModel } from "./models";

export const insertFeeBand = async (feeBand: FeeBand) => {
  const createdFeeBand = await FeeBandModel.create(feeBand);
  return createdFeeBand._id;
};

export const getFeeBands = async () => {
  return await FeeBandModel.find();
};
