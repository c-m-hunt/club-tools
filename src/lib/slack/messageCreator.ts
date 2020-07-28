
export const invoicesList = (title: string, invoices: any) => {
    const message = {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*${title}*
`
                }
            }
        ]
    };
    for (const i of invoices.items) {
        message.blocks[0].text.text += `*${i.detail.invoice_number}* - ${i.detail.invoice_date} - ${i.amount.currency_code} ${i.amount.value} - ${i.primary_recipients[0].billing_info.email_address}
`;
    }
    return message;
};