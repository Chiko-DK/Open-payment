import { Router, Request, Response } from "express";
import { getWalletAddressInfo, getAuthenticatedClient } from "../services/openPaymentsServices";

const router = Router();

// Get wallet address information
router.get("/info/:walletAddress", async (req: Request, res: Response): Promise<void> => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      res.status(400).json({
        error: "Wallet address is required"
      });
      return; // Important: return void, not the response object
    }

    const client = await getAuthenticatedClient();
    const { walletAddressDetails } = await getWalletAddressInfo(client, walletAddress);
    
    res.status(200).json({
      success: true,
      data: walletAddressDetails
    });
    return; // Important: return void
    
  } catch (error) {
    console.error("Error getting wallet info:", error);
    res.status(500).json({
      error: "Failed to get wallet information"
    });
    return; // Important: return void
  }
});

// Health check for wallet service
router.get("/health", (req: Request, res: Response): void => {
  res.json({
    status: "healthy",
    service: "wallet-service"
  });
});

export default router;
