import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import {
  createIncomingPayment,
  createOutgoingPayment,
  createQoute,
  getAuthenticatedClient,
  getOutgoingPaymentAuthorization,
  getWalletAddressInfo,
  processSubscriptionPayment,
} from "./src/services/openPaymentsServices"; // Update this path and filename to match your actual file, e.g., openPaymentsService.ts

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

// Root endpoint
app.get("/", (req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// Health check endpoint
app.get("/api/health", (req: Request, res: Response): void => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// ============== ENDPOINTS ==============

app.post(
  "/api/create-incoming-payment",
  async (req: Request, res: Response): Promise<void> => {
    const { senderWalletAddress, receiverWalletAddress, amount } = req.body;

    if (!senderWalletAddress || !receiverWalletAddress || !amount) {
      res.status(400).json({
        error: "Validation failed",
        message: "Please fill in all the required fields",
        received: req.body,
      });
      return;
    }

    try {
      // Initialize Open Payments client
      const client = await getAuthenticatedClient();

      // get wallet details
      const { walletAddressDetails } = await getWalletAddressInfo(
        client,
        receiverWalletAddress
      );

      // create incoming payment resource
      const incomingPayment = await createIncomingPayment(
        client,
        amount,
        walletAddressDetails
      );
      
      res.status(200).json({ data: incomingPayment });
      return;
    } catch (err: any) {
      console.error("Error creating incoming payment:", err);
      res.status(500).json({ error: "Failed to create incoming payment" });
      return;
    }
  }
);

app.post(
  "/api/create-qoute",
  async (req: Request, res: Response): Promise<void> => {
    const { senderWalletAddress, incomingPaymentUrl } = req.body;

    if (!senderWalletAddress || !incomingPaymentUrl) {
      res.status(400).json({
        error: "Validation failed",
        message: "Please fill in all the required fields",
        received: req.body,
      });
      return;
    }

    try {
      // Initialize Open Payments client
      const client = await getAuthenticatedClient();

      // get wallet details
      const { walletAddressDetails } = await getWalletAddressInfo(
        client,
        senderWalletAddress
      );

      // create quote
      const quote = await createQoute(
        client,
        incomingPaymentUrl,
        walletAddressDetails
      );
      
      res.status(200).json({ data: quote });
      return;
    } catch (err: any) {
      console.error("Error creating quote:", err);
      res.status(500).json({ error: "Failed to create quote" });
      return;
    }
  }
);

app.post(
  "/api/outgoing-payment-auth",
  async (req: Request, res: Response): Promise<void> => {
    const {
      senderWalletAddress,
      qouteId,
      debitAmount,
      receiveAmount,
      type,
      payments,
      redirectUrl,
      duration,
    } = req.body;

    if (!senderWalletAddress || !qouteId) {
      res.status(400).json({
        error: "Validation failed",
        message: "Please fill in all the required fields",
        received: req.body,
      });
      return;
    }

    try {
      // Initialize Open Payments client
      const client = await getAuthenticatedClient();

      // get wallet details
      const { walletAddressDetails } = await getWalletAddressInfo(
        client,
        senderWalletAddress
      );

      // get outgoing payment auth details
      const outgoingPaymentAuthResponse = await getOutgoingPaymentAuthorization(
        client,
        {
          qouteId,
          debitAmount,
          receiveAmount,
          type,
          payments,
          redirectUrl,
          duration,
        },
        walletAddressDetails
      );
      
      res.status(200).json({ data: outgoingPaymentAuthResponse });
      return;
    } catch (err: any) {
      console.error("Error getting outgoing payment authorization:", err);
      res.status(500).json({ error: "Failed to get payment authorization" });
      return;
    }
  }
);

app.post(
  "/api/outgoing-payment",
  async (req: Request, res: Response): Promise<void> => {
    const {
      senderWalletAddress,
      continueAccessToken,
      qouteId,
      interactRef,
      continueUri,
    } = req.body;

    if (!senderWalletAddress || !qouteId) {
      res.status(400).json({
        error: "Validation failed",
        message: "Please fill in all the required fields",
        received: req.body,
      });
      return;
    }

    try {
      // Initialize Open Payments client
      const client = await getAuthenticatedClient();

      // get wallet details
      const { walletAddressDetails } = await getWalletAddressInfo(
        client,
        senderWalletAddress
      );

      // create outgoing payment resource
      const outgoingPaymentResponse = await createOutgoingPayment(
        client,
        {
          senderWalletAddress,
          continueAccessToken,
          qouteId,
          interactRef,
          continueUri,
        },
        walletAddressDetails
      );
      
      res.status(200).json({ data: outgoingPaymentResponse });
      return;
    } catch (err: any) {
      console.error("Error creating outgoing payment:", err);
      res.status(500).json({ error: "Failed to create outgoing payment" });
      return;
    }
  }
);

app.post(
  "/api/subscription-payment",
  async (req: Request, res: Response): Promise<void> => {
    const { receiverWalletAddress, manageUrl, previousToken } = req.body;

    if (!receiverWalletAddress || !manageUrl) {
      res.status(400).json({
        error: "Validation failed",
        message: "Please fill in all the required fields",
        received: req.body,
      });
      return;
    }

    try {
      // Initialize Open Payments client
      const client = await getAuthenticatedClient();

      // create subscription payment
      const outgoingPaymentResponse = await processSubscriptionPayment(client, {
        receiverWalletAddress,
        manageUrl,
        previousToken,
      });

      res.status(200).json({ data: outgoingPaymentResponse });
      return;
    } catch (err: any) {
      console.error("Error processing subscription payment:", err);
      res.status(500).json({ error: "Failed to process subscription payment" });
      return;
    }
  }
);

// ============== ERROR HANDLING ==============

// 404 handler
app.use("*", (req: Request, res: Response): void => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      "GET /",
      "GET /api/health",
      "POST /api/create-incoming-payment",
      "POST /api/create-qoute",
      "POST /api/outgoing-payment-auth",
      "POST /api/outgoing-payment",
      "POST /api/subscription-payment"
    ],
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log("\n📋 Available endpoints:");
  console.log("  GET    /                           - API Playground");
  console.log("  GET    /api/health                 - Health check");
  console.log("  POST   /api/create-incoming-payment - Create incoming payment resource");
  console.log("  POST   /api/create-qoute           - Create quote resource");
  console.log("  POST   /api/outgoing-payment-auth  - Get payment authorization");
  console.log("  POST   /api/outgoing-payment       - Create outgoing payment");
  console.log("  POST   /api/subscription-payment   - Process subscription payment");
});

export default app;
