import { PayPal } from "./index";
import moment from "moment";
import { MatchFee } from "../club/feeTypes";

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

  detail = async(invoiceId: string) => {
    return await this.request(`/invoicing/invoices/${invoiceId}`);
  }

  delete = async(invoiceId: string) => {
    return await this.request(`/invoicing/invoices/${invoiceId}`, "DELETE", null, null, null, false);
  }

  listTemplates = async () => {
    return await this.request("/invoicing/templates");
  }

  generate = async (
    options: InvoiceOptions
  ) => {
    const templateInvoice: any = {
      detail: {
        reference: options.reference,
        invoice_date: moment().format("YYYY-MM-DD"),
        currency_code: options.currency,
        note: options.note,
        payment_term: {
          due_date: moment(options.dueDate).format("YYYY-MM-DD"),
        }
      },
      invoicer: {
        business_name: options.invoicer.companyName,
        name: {
          full_name: options.invoicer.name
        },
        email_address: options.invoicer.email,
        logo_url: options.invoicer.logo
      },
      primary_recipients: [
        {
          billing_info: {
            full_name: options.recipient.name,
            email_address: options.recipient.emailAddress
          }
        }
      ],
      items: options.fees.map(fee => ({
        name: fee.name,
        description: `${fee.type.description} - ${fee.description}`,
        quantity: 1,
        unit_amount: {
          currency_code: options.currency,
          value: fee.type.value
        },
        unit_of_measure: "AMOUNT"
      })),
    };

    return await this.create(templateInvoice);
  }
}

interface InvoiceOptions {
  invoiceNumber?: string;
  reference?: string;
  note: string;
  dueDate: Date;
  currency: "GBP";
  recipient: {
    name: string;
    emailAddress: string;
  };
  invoicer: {
    companyName: string;
    name: string;
    email: string;
    logo: string;
  };
  fees: MatchFee[];
}
