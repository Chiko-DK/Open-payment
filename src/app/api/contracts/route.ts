// src/app/api/contracts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// The path to your contracts.json file
const filePath = path.join(process.cwd(), 'src', 'data', 'contracts.json');

// This function handles all POST requests to /api/contracts
export async function POST(req: NextRequest) {
  try {
    const newContract = await req.json();

    let contracts = [];

    // --- Part 1: Save the contract to the local file system (Existing logic) ---
    try {
      const fileData = await fs.readFile(filePath, 'utf-8');
      contracts = JSON.parse(fileData);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        const dirPath = path.dirname(filePath);
        await fs.mkdir(dirPath, { recursive: true });
        contracts = [];
      } else {
        throw error;
      }
    }

    contracts.push(newContract);
    await fs.writeFile(filePath, JSON.stringify(contracts, null, 2), 'utf-8');

    // --- Part 2: Create the incoming payment on the Express server (New logic) ---
    // Hardcode the URL since you don't have an environment variable
    const backendUrl = "http://localhost:3001";

    const paymentData = {
      senderWalletAddress: newContract.pointer,
      receiverWalletAddress: "https://ilp.interledger-test.dev/sihle",
      amount: newContract.amount.replace('R ', '').replace('.', '').replace(',', ''),
    };
    
    const paymentResponse = await fetch(`${backendUrl}/api/create-incoming-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!paymentResponse.ok) {
      console.error('Failed to create incoming payment on Express server:', paymentResponse.status);
    }
    
    const paymentResult = await paymentResponse.json();
    console.log('Incoming Payment API Response:', paymentResult);

    return NextResponse.json({ 
      message: 'Contract saved and payment process initiated successfully.',
      paymentDetails: paymentResult
    }, { status: 201 });

  } catch (error) {
    console.error('Error writing contract or creating payment:', error);
    return NextResponse.json({ error: 'Failed to submit loan application.' }, { status: 500 });
  }
}