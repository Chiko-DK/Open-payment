import { Router } from "express";
import { PaymentController } from "../controllers/paymentController";
import { validatePaymentRequest, validatePaymentCompletion } from "../middleware/validation";

const router = Router();
const paymentController = new PaymentController();

// P2P Payment routes
router.post(
  "/initiate", 
  validatePaymentRequest,
  paymentController.initiatePayment.bind(paymentController)
);

router.post(
  "/complete",
  validatePaymentCompletion,
  paymentController.completePayment.bind(paymentController)
);

// Legacy routes for backward compatibility
router.post("/create-incoming-payment", /* your existing handler */);
router.post("/create-qoute", /* your existing handler */);
router.post("/outgoing-payment-auth", /* your existing handler */);
router.post("/outgoing-payment", /* your existing handler */);

export default router;
