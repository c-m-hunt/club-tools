import { produceInvoices } from "./club/subs";
import { getAvailability } from "./club/availability";
import dotenv from "dotenv";

dotenv.config();

// produceInvoices();


getAvailability(
    process.env.AVAILABILITY_SHEET_ID,
    process.env.AVAILABILITY_TAB_NAME
).then(data => {
    const available = data.filter(a => (a.availability.includes("Saturday 25th July"))).map(a => a.name);
    console.log(available);
});