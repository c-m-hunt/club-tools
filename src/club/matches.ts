import moment from "moment";
import { getPlayCricketClient } from "services";

export const getRecentMatches = async (
  days: number,
  siteId: number,
  teams: string[],
) => {
  const client = getPlayCricketClient();

  const resultsPromises = teams.map(async (teamId) => {
    const res = await client.getResults(siteId, 2020, { teamId });
    return res.result_summary.filter((r) => {
      const matchDate = moment(r.match_date, "DD/MM/YYYY");
      if (matchDate.isAfter(moment().subtract(7, "days"))) {
        return true;
      }
      return false;
    });
  });
  const results = await Promise.all(resultsPromises);
  return results.flat();
};

export const getPlayers = async (matchId: number, teams: string[]) => {
  const client = getPlayCricketClient();
  const matchResponse = await client.getMatchDetail(matchId);
  const match = matchResponse.match_details[0];
  let teamIdx;
  let teamName;
  let oppoTeamName: "home_club_name" | "away_club_name";
  let venue: "Home" | "Away";
  let players;
  if (teams.includes(match.home_team_id)) {
    players = match.players[0].home_team;
    oppoTeamName = "away_club_name";
    venue = "Home";
  } else {
    players = match.players[1].away_team;
    oppoTeamName = "home_club_name";
    venue = "Away";
  }
  return players.map((p) => ({
    playerId: p.player_id,
    matchId,
    name: p.player_name,
    oppo: match[oppoTeamName],
    venue,
    date: moment(match.match_date, "DD/MM/YY").format("DD MMM"),
  }));
};
