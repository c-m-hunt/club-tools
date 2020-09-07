import { Router } from "express";
import { owedInvoices } from "club/subs";

const router = Router();

router.get("/owing", async (req, res) => {
  const { invoices, summary } = await owedInvoices();
  res.json(invoices);
});

router.get("/owing_summary", async (req, res) => {
  const { invoices, summary } = await owedInvoices();
  res.json(
    Object.keys(summary).map((p) => ({
      email: p,
      ...summary[p],
    })),
  );
});

export default router;
