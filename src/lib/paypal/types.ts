
export interface PaymentTerm {
  due_date: string;
}

export interface Detail {
  invoice_number: string;
  reference: string;
  invoice_date: string;
  currency_code: string;
  note: string;
  payment_term: PaymentTerm;
}

export interface Name {
  given_name: string;
  surname: string;
}

export interface BillingInfo {
  name: Name;
  email_address: string;
}

export interface PrimaryRecipient {
  billing_info: BillingInfo;
}

export interface UnitAmount {
  currency_code: string;
  value: string;
}

export interface Item {
  name: string;
  description: string;
  quantity: string;
  unit_amount: UnitAmount;
  unit_of_measure: string;
}

export interface PartialPayment {
  allow_partial_payment: boolean;
}

export interface Configuration {
  partial_payment: PartialPayment;
  allow_tip: boolean;
  tax_calculated_after_discount: boolean;
  tax_inclusive: boolean;
}

export interface Invoice {
  detail: Detail;
  primary_recipients: PrimaryRecipient[];
  items: Item[];
  configuration: Configuration;
}
