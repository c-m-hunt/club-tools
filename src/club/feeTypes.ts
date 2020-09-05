export interface MatchFee {
  name: string;
  date: Date;
  description: string;
  type: FeeBand;
}

export interface FeeBand {
  description: string;
  amount: number;
  currency: "GBP";
}

export interface FeeTypes {
  [key: string]: FeeBand;
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
  fee?: FeeBand;
}
