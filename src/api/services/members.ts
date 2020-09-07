import { Router } from "express";
import { searchNames } from "lib/clubDb/search";

const router = Router();

router.get("/search", async (req, res) => {
  const term = (req.query["term"] || "") as string;
  if (term.length > 3) {
    const members = await searchNames(term);
    res.json(members);
  } else {
    res.status(500);
    res.send("Enter a term greater than 3 characters");
  }
});

export default router;
