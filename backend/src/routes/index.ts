import { Router } from "express";
import paymentRoutes from "./payments";
import walletRoutes from "./wallets";

const router = Router();

router.use("/payments", paymentRoutes);
router.use("/wallets", walletRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
