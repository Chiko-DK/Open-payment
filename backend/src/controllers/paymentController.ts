import { Request, Response } from "express";
import { PaymentService } from "../services/paymentService";
import { validationResult } from "express-validator";

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  async initiatePayment(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: errors.array() 
      });
    }

    try {
      const { senderWalletAddress, receiverWalletAddress, amount } = req.body;
      
      const result = await this.paymentService.initiateP2PPayment(
        senderWalletAddress,
        receiverWalletAddress,
        amount
      );
      
      return res.status(200).json({
        success: true,
        data: result
      });
      
    } catch (error) {
      console.error("Payment initiation failed:", error);
      return res.status(500).json({ 
        error: "Payment initiation failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  async completePayment(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: errors.array() 
      });
    }

    try {
      const result = await this.paymentService.completePayment(req.body);
      
      return res.status(200).json({
        success: true,
        data: result
      });
      
    } catch (error) {
      console.error("Payment completion failed:", error);
      return res.status(500).json({ 
        error: "Payment completion failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
}
