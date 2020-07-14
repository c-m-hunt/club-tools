import fetch from "node-fetch";
const BASE_URL = "https://api.paypal.com";
const SANDBOX_BASE_URL = "https://api.sandbox.paypal.com";

type RequestMethod = "GET" | "POST"
interface RequestOptions {
  method: RequestMethod;
  headers: any;
  body?: string;
}

export class PayPal {

  baseUrl: string;
  accessToken: string;
  version: string
  constructor(accessToken: string, sandbox: boolean = false, version: string = "v2") {
    this.accessToken = accessToken;
    this.baseUrl = sandbox ? SANDBOX_BASE_URL : BASE_URL;
    this.version = version;
  }

  request = async (url: string, method: RequestMethod = "GET", data: object | null = null) => {
    const options: RequestOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.accessToken}`
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }
    const response = await fetch(
      `${this.baseUrl}/${this.version}${url}`,
      options
    );
    return await response.json();
  }

}


