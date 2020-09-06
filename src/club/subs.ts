import moment from "moment";

import {
  InvoiceOptions,
  getInvoiceSingleton,
} from "lib/paypal/invoice";
import { GBP } from "consts";
import { MatchPlayer, MatchFeeType, FeeTypes } from "./feeTypes";
import { config } from "config";
import logger from "logger";
import { getPlayers } from "./matches";
import { getPlayerByPlayCricketId } from "lib/clubDb/query";

const feeTypes = config.fees.feeTypes;

const { clientId, secret, sandbox, invoiceer } = config.fees.invoiceParams;

export const getMatchFee = async (feeCode: string) => {
  return feeTypes[feeCode];
};

export const getPlayersAndFeesForMatch = async (
  matchId: number,
  chargeTeams: string[],
): Promise<{ players: MatchPlayer[]; errors: number }> => {
  const players = await getPlayers(matchId, chargeTeams);
  let errors = 0;
  for (const p of players) {
    if (p.playerId === null) {
      logger.error(
        `Player ${p.name} does not have a Play Cricket ID. Please fix and rerun.`,
      );
      errors += 1;
      break;
    }
    const mappedPlayerResponse = await getPlayerByPlayCricketId(p.playerId);
    if (mappedPlayerResponse.length == 0) {
      logger.error(
        `No player found for Play Cricket ID ${p.playerId} (${p.name})`,
      );
      errors += 1;
    } else if (mappedPlayerResponse.length > 1) {
      logger.error(
        `Multiple players found for Play Cricket ID ${p.playerId} (${p.name})`,
      );
      errors += 1;
    }

    // Only do the checks on player and fees if there have been no errors so far
    if (errors === 0) {
      const mappedPlayer = mappedPlayerResponse[0];
      if (!Object.keys(feeTypes).includes(mappedPlayer.matchFeeBand)) {
        logger.error(
          `Player ${p.name} has fee band ${mappedPlayer.matchFeeBand} which doesn't exist`,
        );
        errors += 1;
      }

      const fee = await getMatchFee(mappedPlayer.matchFeeBand);
      if (!mappedPlayer.email || mappedPlayer.email.length === 0) {
        logger.error(`Player ${p.name} has no email address`);
        errors += 1;
      } else {
        p.fee = fee;
        p.email = mappedPlayer.email;
      }
    }
  }
  return { players, errors };
};

export const sendDraftInvoice = async (invoiceId: string) => {
  const inv = await getInvoiceSingleton(clientId, secret, sandbox);
  logger.debug(`Sending invoice ${invoiceId}`);
  await inv.send(invoiceId);
};

const createInvoices = async (
  players: MatchPlayer[],
  sendZeroInvoices: boolean = true,
  autoSend: boolean = false,
  dryRun: boolean = false,
) => {
  const inv = await getInvoiceSingleton(clientId, secret, sandbox);
  for (const player of players) {
    const fee: MatchFeeType = player.fee;
    const match =
      `${player.date} - ${player.team} ${player.venue} v ${player.oppo}`;
    let note =
      "If you have any queries over the amount you've been charged, please contact us. ";

    if (fee.value == 0) {
      if (sendZeroInvoices) {
        note += `
        *** There is no balance on this invoice so no action is required by you. ***`;
      } else {
        logger.info(
          `Zero fee - ${player.name} - ${match} - ${fee.description}`,
        );
        continue;
      }
    }
    const invObj: InvoiceOptions = {
      dueDate: moment().add(5, "days").toDate(),
      note,
      currency: GBP,
      recipient: {
        name: player.name,
        emailAddress: player.email,
      },
      invoicer: {
        companyName: invoiceer.company,
        name: invoiceer.contactName,
        email: invoiceer.email,
        logo: invoiceer.logo,
      },
      fees: [{
        name: player.name,
        date: new Date(),
        description: match,
        type: fee,
      }],
    };
    if (dryRun) {
      logger.info(
        `Dry run. Would send: ${player.name} - ${match} - ${fee.description} - ${fee.currency} ${fee.value}`,
      );
    } else {
      const response = await inv.generate(invObj);
      logger.info("-----------------------------------");
      logger.debug(response);
      logger.debug(JSON.stringify(response));
      const responseHrefParts = response.href.split("/");
      const createdId = responseHrefParts[responseHrefParts.length - 1];
      logger.info(`Invoice ID created: ${createdId}`);
      logger.info(
        `Detail - ${player.name} - ${match} - ${fee.description} - ${fee.currency} ${fee.value}`,
      );
      if (autoSend) {
        await sendDraftInvoice(createdId);
        logger.info(`${createdId} sent`);
      }
    }
  }
};

const getTemplates = async () => {
  const inv = await getInvoiceSingleton(clientId, secret, sandbox);
  const templates = await inv.listTemplates();
  return templates;
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

export const produceInvoices = async (
  players: MatchPlayer[],
  dryRun: boolean = false,
  autoSend: boolean = true,
) => {
  if (dryRun) {
    logger.info("Running dry run - nothing will be created");
  } else {
    logger.info("THIS IS A LIVE RUN - INVOICES WILL BE CREATED");
    if (autoSend) {
      logger.info(
        "AUTOSEND IS ON - INVOICES WILL AUTOMATICALLY BE SENT ONCE CREATED",
      );
    }
  }
  await createInvoices(players, config.fees.sendZeroInvoices, autoSend, dryRun);
};

export const owedInvoices = async () => {
  logger.info("Authorising with PayPal");
  const inv = await getInvoiceSingleton(clientId, secret, sandbox);
  logger.info("Authorised. Getting unpaid invoices");
  const invoices = await inv.search({ status: ["SENT"] });
  logger.info(`Found ${invoices.items.length}`);
  return invoices.items;
};

export const feeKeyExists = (key: string, feeTypes: FeeTypes) => {
  return Object.keys(feeTypes).includes(key);
};
