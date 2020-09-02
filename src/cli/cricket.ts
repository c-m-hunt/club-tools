import Table from "cli-table3";
import { Client } from "play-cricket-client";
import { config } from "config";

export const leagueTables = async (divIds: string[]) => {
  const client = new Client(config.cricket.playCricket.apiKey);
  for (const id of divIds) {
    const div = (await client.getLeagueTable(parseInt(id)));
    const table = div.league_table[0];
    const divider = new Array(table.name.length).fill("-").join("");
    console.log(divider);
    console.log(table.name);
    console.log(divider);
    const t = new Table(
      { head: ["Pos", ...Object.values(table.headings)] },
    );
    t.push(...table.values.map((r) => {
      const vals = Object.values(r);
      vals.splice(1, 1);
      return vals;
    }));
    console.log(t.toString());
  }
};
