export interface FeeTypes {
  [key: string]: {
    description: string;
    amount: number;
    currency: "GBP";
  };
}

export interface Sheet {
  sheetId: string;
  tabName: string;
}

export interface PayPalInvoiceParams {
  clientId: string;
  secret: string;
  sandbox: boolean;
  invoiceer: {
    company: string;
    contactName: string;
    email: string;
    logo: string;
  };
}

interface ClubDb {
  connectionString: string;
  dbName: string;
  exportSheet: Sheet;
}

export interface Config {
  clubDb: ClubDb;
  availability: {
    sheet: Sheet;
  };
  fees: {
    sendZeroInvoices: boolean;
    slackWebhookUrl: string;
    invoiceParams: PayPalInvoiceParams;
  };
  cricket: {
    playCricket: {
      apiKey: string;
      siteId: number;
      teams: string[];
      divisions: string[];
    };
  };
  communication: {
    slack: {
      commandToken: string;
    };
    mailchimp: {
      apiKey: string;
      listId: string;
    };
  };
}
