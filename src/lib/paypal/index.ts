import fetch from "node-fetch";
import { base64Encode } from "util/utils";
import logger from "logger";

const BASE_URL = "https://api.paypal.com";
const SANDBOX_BASE_URL = "https://api.sandbox.paypal.com";

type RequestMethod = "GET" | "POST" | "DELETE";
interface RequestOptions {
  method: RequestMethod;
  headers: any;
  body?: string;
}

export class PayPal {
  baseUrl: string;
  accessToken: string = null;
  clientID: string;
  secret: string;
  version: string;
  constructor(
    clientId: string,
    secret: string,
    sandbox: boolean = false,
    version: string = "v2",
  ) {
    this.clientID = clientId;
    this.secret = secret;
    this.baseUrl = sandbox ? SANDBOX_BASE_URL : BASE_URL;
    this.version = version;
  }

  authenticate = async () => {
    const headers = {
      "Accept": "application/json",
      "Accept-Language": "en_GB",
      Authorization: `Basic ${base64Encode(`${this.clientID}:${this.secret}`)}`,
    };

    const options: RequestOptions = {
      method: "POST",
      headers,
      body: "grant_type=client_credentials",
    };

    const response = await fetch(
      `${this.baseUrl}/v1/oauth2/token`,
      options,
    );
    if (response.status === 200) {
      const responseObject = await response.json();
      this.accessToken = responseObject["access_token"];
    }
  };

  request = async (
    url: string,
    method: RequestMethod = "GET",
    data: object | null = null,
    headers: object | null = null,
    body: object | string = null,
    expectJson = true,
  ) => {
    headers = headers || {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.accessToken}`,
    };

    const options: RequestOptions = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    logger.debug(`${this.baseUrl}/${this.version}${url}`);

    const response = await fetch(
      `${this.baseUrl}/${this.version}${url}`,
      options,
    );

    logger.debug(`Status code ${response.status}`);

    if (expectJson) {
      return await response.json();
    } else {
      return await response.text();
    }
  };
}
