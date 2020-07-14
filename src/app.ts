import logger from "./util/logger";

import { Invoice } from "./paypal/invoice";


const accessToken = "";

const inv = new Invoice(accessToken, true);



//inv.generateNextInvoiceNumber();

const invData = {
  "detail": {
    "invoice_number": "#124",
    "reference": "deal-ref",
    "invoice_date": "2020-07-13",
    "currency_code": "GBP",
    "note": "Hope you had a good game!",
    "payment_term": {
      "due_date": "2020-07-18"
    }
  },
  "primary_recipients": [
    {
      "billing_info": {
        "name": {
          "given_name": "Stephanie",
          "surname": "Meyers"
        },
        "email_address": "bill-me@example.com"
      }
    }
  ],
  "items": [
    {
      "name": "Match Fees",
      "description": "July 11th, Benfleet 3s home",
      "quantity": "1",
      "unit_amount": {
        "currency_code": "GBP",
        "value": "10.00"
      },
      "unit_of_measure": "QUANTITY"
    }
  ],
  "configuration": {
    "partial_payment": {
      "allow_partial_payment": false
    },
    "allow_tip": true,
    "tax_calculated_after_discount": true,
    "tax_inclusive": false,
    // "template_id": "TEMP-19V05281TU309413B"
  }
};




inv.create(invData)
  .then(data => {
    console.log(data);
    // inv.send(data["invoice_number"])
    //   .then(data => {
    //     console.log(data);
    //   });
  });

// inv.list()
//   .then(data => {
//     console.log(data);
//   });
