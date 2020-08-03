import { getAllMembers, searchMembers } from "./index";
import { Member } from "./../../lib/clubDb/types";
import { connect, insertMember } from "./../../lib/clubDb";
import logger from "./../../logger";

const importMembers = async () => {
    await connect();

    const members = await getAllMembers();
    const importedMembers = [];
    for (const m of members) {
        try {
            importedMembers.push(await insertMember(m as Member));
        } catch (ex) {
            logger.error("Failed to insert for:");
            logger.error(JSON.stringify(m, null, 2));
        }

    }
    console.log(importedMembers);
};

importMembers();