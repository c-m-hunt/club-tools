export interface MatchFee {
  name: string;
  date: Date;
  description: string;
  type: MatchFeeType;
}

export interface MatchFeeType {
  description: string;
  value: number;
  currency: "GBP";
}

export interface FeeTypes {
  [key: string]: MatchFeeType;
}

export interface MatchPlayer {
  playerId: number;
  matchId: number;
  name: string;
  oppo: string;
  team: string;
  venue: "Home" | "Away";
  date: string;
  email?: string;
  fee?: MatchFeeType;
}
