import moment from "moment";


const formatDate = (date: string): string => {
    return moment(date, "YYYY-MM-DD").format("Do MMM, YYYY");
};

export const invoicesList = (title: string, invoices: any) => {
    const message: any = {
        replace_original: "true",
        response_type: "in_channel",
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*${title}*`
                }
            }
        ]
    };
    for (const i of invoices) {
        const text = `
*${i.detail.invoice_number}* - ${formatDate(i.detail.invoice_date)} - ${i.primary_recipients[0].billing_info.email_address}
*Amount:* ${ i.amount.currency_code} ${i.amount.value}
*Due:* ${formatDate(i.detail.payment_term.due_date)}`;
        message.blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: text
            },
        });
        message.blocks.push({
            type: "divider",
        });
    }
    return message;
};