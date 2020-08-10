import moment from "moment";

import { Invoice, InvoiceOptions, getInvoiceSingleton } from "./../lib/paypal/invoice";
import { getDoc, getSheetByTitle } from "./../lib/googleSheets/sheets";
import { getRegisterFromSheet } from "./../lib/googleSheets/registerSheet";
import { GBP } from "./../consts";
import { MatchPlayer, MatchFeeType } from "./feeTypes";
import { config } from "./../config";

import logger from "./../logger";

const feeTypes = config.fees.feeTypes;

const { clientId, secret, sandbox, invoiceer } = config.fees.invoiceParams;

const createInvoices = async (players: MatchPlayer[], sendZeroInvoices: boolean = true, dryRun: boolean = false) => {
  const inv = await getInvoiceSingleton(clientId, secret, sandbox);
  for (const player of players) {
    logger.debug(player);
    const fee: MatchFeeType = feeTypes[player.feeType];
    logger.debug(fee);

    let note = "If you have any queries over the amount you've been charged, please contact us. ";

    if (fee.value == 0) {
      if (sendZeroInvoices) {
        note += `
        *** There is no balance on this invoice so no action is required by you. ***`;
      } else {
        console.log("Zero fee - not sending");
        continue;
      }
    }
    const invObj: InvoiceOptions = {
      dueDate: moment().add(14, "days").toDate(),
      note,
      currency: GBP,
      recipient: {
        name: player.name,
        emailAddress: player.email
      },
      invoicer: {
        companyName: invoiceer.company,
        name: invoiceer.contactName,
        email: invoiceer.email,
        logo: invoiceer.logo
      },
      fees: [{
        name: player.name,
        date: new Date(),
        description: player.match,
        type: fee
      }]
    };
    if (dryRun) {
      logger.info("Dry run. Would send:");
      logger.info(invObj);
    } else {
      const response = await inv.generate(invObj);
      logger.info(`Invoice sent to ${player.name}`);
      logger.debug(response);
    }
  }
};

const getRegister = async () => {
  const sheetId = config.register.sheet.sheetId;
  const tabName = config.register.sheet.tabName;
  const doc = await getDoc(sheetId);
  const sheet = await getSheetByTitle(tabName, doc);
  const players = await getRegisterFromSheet(sheet);
  return players;
};

const listTemplates = async () => {
  const inv = await getInvoiceSingleton(clientId, secret, sandbox);
  const templates = await inv.listTemplates();
  console.log(templates);
  console.log(templates.templates[3].settings);
};

const listInvoices = async () => {
  const inv = await getInvoiceSingleton(clientId, secret, sandbox);
  const invoices = await inv.list();
  console.log(invoices);
  console.log(invoices.items[0].detail);
};

const invoiceDetail = async (invoiceId: string) => {
  const inv = await getInvoiceSingleton(clientId, secret, sandbox);
  const invoice = await inv.detail(invoiceId);
  console.log(invoice);
};

const deleteInvoice = async (invoiceId: string) => {
  const inv = await getInvoiceSingleton(clientId, secret, sandbox);
  const invoice = await inv.delete(invoiceId);
  console.log(invoice);
};

export const produceInvoices = async (dryRun: boolean = false) => {
  const players = await getRegister();
  await createInvoices(players, config.fees.sendZeroInvoices, dryRun);
};

export const sendDraftInvoice = async (invoiceId: string) => {
  const invoices = await
}

export const owedInvoices = async () => {
  logger.info("Authorising with PayPal");
  const inv = await getInvoiceSingleton(clientId, secret, sandbox);
  logger.info("Authorised. Getting unpaid invoices");
  const invoices = await inv.search({ status: ["SENT"] });
  logger.info(`Found ${invoices.items.length}`);
  return invoices.items;
};