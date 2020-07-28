export interface FeeTypes {
    [key: string]: {
        description: string;
        value: number;
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

export interface Config {
    availability: {
        sheet: Sheet;
    };
    register: {
        sheet: Sheet;
    };
    fees: {
        feeTypes: FeeTypes;
        sendZeroInvoices: boolean;
        slackWebhookUrl: string;
        invoiceParams: PayPalInvoiceParams;
    };
    cricket: {
        playCricket: {
            apiKey: string;
        };
    };
    communication: {
        slack: {
            commandToken: string;
        }
    }
}