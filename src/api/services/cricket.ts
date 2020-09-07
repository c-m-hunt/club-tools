import { Router } from "express";
import { Client } from "play-cricket-client";
import { config } from "config";

const router = Router();

router.get("/table/:id", async (req, res) => {
  const client = new Client(config.cricket.playCricket.apiKey);
  const div = await client.getLeagueTable(parseInt(req.params.id));
  res.json(div);
});

export default router;
