import { getModelForClass } from "@typegoose/typegoose";
import { Member, FeeBand } from "./types";

export const MemberModel = getModelForClass(Member);
export const FeeBandModel = getModelForClass(FeeBand);
//@ts-ignore
console.log(MemberModel.schema);
