// src/components/PaymentButton.tsx

"use client"; // This is a client component

import { useState } from 'react';

// Use your environment variable for the backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function PaymentButton() {
  const [status, setStatus] = useState("idle");

  const handleCreateIncomingPayment = async () => {
    setStatus("loading");
    try {
      // Data to send to the server
      const paymentData = {
        senderWalletAddress: "https://ilp.interledger-test.dev/thokozani",
        receiverWalletAddress: "https://ilp.interledger-test.dev/sihle",
        amount: "100", // The amount to be paid
      };

      // Make a POST request to the Express server
      const response = await fetch(`${BACKEND_URL}/api/create-incoming-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Incoming Payment created successfully:", result);
      setStatus("success");

    } catch (error) {
      console.error("Failed to create incoming payment:", error);
      setStatus("error");
    }
  };

  return (
    <div>
      <button onClick={handleCreateIncomingPayment} disabled={status === "loading"}>
        {status === "loading" ? "Processing..." : "Create Incoming Payment"}
      </button>
      {status === "success" && <p>✅ Payment process started successfully!</p>}
      {status === "error" && <p>❌ Failed to start payment process.</p>}
    </div>
  );
}