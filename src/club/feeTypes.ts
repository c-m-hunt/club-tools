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
  dateCompleted: string;
  name: string;
  phone: string;
  email: string;
  confirm: boolean;
  match: string;
  feeType: keyof FeeTypes;
  date: moment.Moment;
}
