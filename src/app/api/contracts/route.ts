//in api\contracts
//import { NextRequest, NextResponse } from 'next/server';
//import path from 'path';
//import fs from 'fs/promises';

//const filePath = path.resolve(process.cwd(), 'src/app/data/contracts.json');

// export async function POST(req: NextRequest) {
//   try {
//     const newContract = await req.json();

//     const fileData = await fs.readFile(filePath, 'utf-8');
//     const contracts = JSON.parse(fileData);

//     contracts.push(newContract);

//     await fs.writeFile(filePath, JSON.stringify(contracts, null, 2), 'utf-8');

//     return NextResponse.json({ message: 'Contract saved successfully.' }, { status: 201 });
//   } catch (error) {
//     console.error('Error writing contract:', error);
//     return NextResponse.json({ error: 'Failed to save contract' }, { status: 500 });
//   }
// }
