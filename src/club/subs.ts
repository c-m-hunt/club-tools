import moment from "moment";

import { Invoice } from "./../paypal/invoice";
import { getDoc, getSheetByTitle } from "./../googleSheets/sheets";
import { getRegisterFromSheet } from "./../googleSheets/registerSheet";
import { GBP } from "./../consts";
import { MatchPlayer, FeeTypes } from "./feeTypes";
import { feeTypes } from "././clubFeeTypes";

const clientId = process.env["PAYPAL_CLIENT_ID"];
const secret = process.env["PAYPAL_SECRET"];
const sandbox = process.env["PAYPAL_SANDBOX"] == "1";
const invoicerCompany = process.env["PAYPAL_INVOICER_BUSINESS"];
const invoicerContactName = process.env["PAYPAL_INVOICER_CONTACT"];
const invoicerEmail = process.env["PAYPAL_INVOICER_EMAIL"];
const invoicerLogo = process.env["PAYPAL_INVOICER_LOGO"];

const sendInvoices = async (players: MatchPlayer[]) => {
  const inv = new Invoice(clientId, secret, sandbox);
  await inv.authenticate();
  
  const player = players[2];

  //for (const player of players) {
    console.log(player);
    //@ts-ignore
    const fee: FeeType = feeTypes[player.feeType];
    console.log(fee);

    let note = "If you have any queries over the amount you've been charged, please contact us. ";

    if (fee.value == 0) {
      note += `
*** There is no balance on this invoice so no action is required by you. ***`;
    }

    const response = await inv.generate({
      // reference: "Test",
      dueDate: moment().add(14, "days").toDate(),
      note,
      currency: GBP,
      recipient: {
        name: player.name,
        emailAddress: player.email
      },
      invoicer: {
        companyName: invoicerCompany,
        name: invoicerContactName,
        email: invoicerEmail,
        logo: invoicerLogo
      },
      fees: [{
        name: player.name,
        date: new Date(),
        description: player.match,
        type: fee
      }]
    });
    console.log(response);
  //}
};

const getRegister = async () => {
  const sheetId = process.env.SHEET_ID;
  const tabName = process.env.TAB_NAME;
  const doc = await getDoc(sheetId);
  const sheet = await getSheetByTitle(tabName, doc);
  const players = await getRegisterFromSheet(sheet);
  return players;
};

export const produceInvoices = async () => {
  const players = await getRegister();
  await sendInvoices(players);
};

const listTemplates = async () => {
  const inv = new Invoice(clientId, secret, sandbox);
  await inv.authenticate();
  const templates = await inv.listTemplates();
  console.log(templates);
  console.log(templates.templates[3].settings);
};

const listInvoices = async () => {
  const inv = new Invoice(clientId, secret, sandbox);
  await inv.authenticate();
  const invoices = await inv.list();
  console.log(invoices);
  console.log(invoices.items[0].detail);
};

const invoiceDetail = async (invoiceId: string) => {
  const inv = new Invoice(clientId, secret, sandbox);
  await inv.authenticate();
  const invoice = await inv.detail(invoiceId);
  console.log(invoice);
};

const deleteInvoice = async (invoiceId: string) => {
  const inv = new Invoice(clientId, secret, sandbox);
  await inv.authenticate();
  const invoice = await inv.delete(invoiceId);
  console.log(invoice);
};

