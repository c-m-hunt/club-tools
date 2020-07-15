import { PayPal } from "./index";

export class Invoice extends PayPal {

  generateNextInvoiceNumber = async () => {
    const data = await this.request("/invoicing/generate-next-invoice-number", "POST");
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

  generate = (
    options: InvoiceOptions
  ) => {
    const templateInvoice: any = {
      detail: {
        invoice_number: "",
        reference: "deal-ref",
        invoice_date: "",
        currency_code: GBP,
        note: "Hope you had a good game!",
        payment_term: {
          due_date: "",
        }
      },
      primary_recipients: [
        {
          billing_info: {
            name: {
              given_name: "Stephanie",
              surname: "Meyers"
            },
            email_address: "bill-me@example.com"
          }
        }
      ],
      items: [
        {
          name: "Match Fees",
          description: "July 11th, Benfleet 3s home",
          quantity: 1,
          unit_amount: {
            currency_code: "GBP",
            value: 10.00
          },
          unit_of_measure: "QUANTITY"
        }
      ]
    };
  }
}

interface InvoiceOptions {
  invoiceNumber?: string;
  reference: string;
  note: string;
  dueDate: Date;
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