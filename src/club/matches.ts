import moment from "moment";
import { getPlayCricketClient } from "services";

export const getRecentMatches = async (days: number, siteId: number, teams: string[]) => {
    const client = getPlayCricketClient();

    const resultsPromises = teams.map(async teamId => {
        const res = await client.getResults(siteId, 2020, { teamId });
        return res.result_summary.filter(r => {
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
    if (teams.includes(match.home_team_id)) {
        teamName = "home_team";
        teamIdx = 0;
        oppoTeamName = "away_club_name";
        venue = "Home";
    } else {
        teamName = "away_team";
        teamIdx = 1;
        oppoTeamName = "home_club_name";
        venue = "Away";
    }

    //@ts-ignore
    return match.players[teamIdx][teamName].map(p => ({
        id: p.player_id,
        name: p.player_name,
        oppo: match[oppoTeamName],
        venue,
        date: moment(match.match_date, "DD/MM/YY").format("DD MMM")
    }));
};