import { PayPal } from "./index";
import moment from "moment";

const currency = "GBP";
export class Invoice extends PayPal {

  generateNextInvoiceNumber = async () => {
    return await this.request("/invoicing/generate-next-invoice-number", "POST");
  }

  create = async (invData: object) => {
    return await this.request("/invoicing/invoices", "POST", invData);
  }

  send = async (invId: string) => {
    return await this.request(`/invoicing/invoices/${invId}/send`, "POST");
  }

  list = async() => {
    return await this.request("/invoicing/invoices");
  }

  generate = async (
    options: InvoiceOptions
  ) => {
    const invoiceNumber = options.invoiceNumber || await this.generateNextInvoiceNumber();
    const templateInvoice: any = {
      detail: {
        invoice_number: invoiceNumber,
        reference: options.reference,
        invoice_date: moment().format("YYYY-MM-DD"),
        currency_code: options.currency,
        note: options.note,
        payment_term: {
          due_date: moment(options.dueDate).format("YYYY-MM-DD"),
        }
      },
      primary_recipients: [
        {
          billing_info: {
            name: options.recipient.name,
            email_address: options.recipient.emailAddress
          }
        }
      ],
      items: options.fees.map(fee => ({
        name: fee.name,
        description: fee.description,
        quantity: 1,
        unit_amount: {
          currency_code: fee.type.currency,
          value: fee.type.value
        },
        unit_of_measure: "QUANTITY"
      }))
    };
  }
}

interface InvoiceOptions {
  invoiceNumber?: string;
  reference: string;
  note: string;
  dueDate: Date;
  currency: "GBP";
  recipient: {
    name: string;
    emailAddress: string;
  };
  fees: MatchFee[];
}

interface MatchFee {
  name: string;
  description: string;
  type: MatchFeeType;
}

interface MatchFeeType {
  description: string;
  value: number;
  currency: "GBP";
}