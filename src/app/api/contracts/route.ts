import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const filePath = path.resolve(process.cwd(), 'src/app/data/contracts.json');

export async function POST(req: NextRequest) {
  try {
    const newContract = await req.json();

    // Read current contracts
    const fileData = await fs.readFile(filePath, 'utf-8');
    const contracts = JSON.parse(fileData);

    // Add the new contract
    contracts.push(newContract);

    // Save updated contracts
    await fs.writeFile(filePath, JSON.stringify(contracts, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Contract saved successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Error writing contract:', error);
    return NextResponse.json({ error: 'Failed to save contract' }, { status: 500 });
  }
}
