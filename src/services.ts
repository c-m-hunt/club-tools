import { Client } from "play-cricket-client";
import { config } from "config";

let playCricketClient: null | Client = null;
export const getPlayCricketClient = () => {
    if (!playCricketClient) {
        playCricketClient = new Client(config.cricket.playCricket.apiKey);
    }
    return playCricketClient;
};