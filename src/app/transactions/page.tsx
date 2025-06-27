"use client";

import { useState } from 'react';

const dummyTransactions = [
  {
    date: 'Jun 26, 2025',
    time: '03:26 PM',
    details: 'No description',
    amount: '+ZAR 0.50',
    status: 'EXPIRED',
    pointerName: 'randmooney',
    currency: 'Rand',
  },
  {
    date: 'Jun 26, 2025',
    time: '02:50 PM',
    details: 'No description',
    amount: '+$1.47',
    status: 'EXPIRED',
    pointerName: 'USD',
    currency: 'money',
  },
  {
    date: 'Jun 26, 2025',
    time: '01:36 PM',
    details: 'No description',
    amount: '+ZAR 5.25',
    status: 'EXPIRED',
    pointerName: 'randmooney',
    currency: 'Rand',
  },
];

export default function Transactions() {
  const [filters, setFilters] = useState({ account: 'All', pointer: 'All', type: 'All', status: 'All' });

  return (
    <div className="min-h-screen bg-purple-900 text-white flex">
      <aside className="w-64 p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Interledger<br />test wallet</h1>
        <nav className="space-y-2">
          <div>🏠 Accounts</div>
          <div>✈️ Send</div>
          <div>📷 Request</div>
          <div className="bg-pink-500 text-white px-2 py-1 rounded">📄 Transactions</div>
          <div>🔑 Grants</div>
          <div>⚙️ Settings</div>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-4">Transactions</h2>

        <div className="grid grid-cols-5 gap-4 mb-4">
          {['Account', 'Payment Pointer', 'Type', 'Status'].map(label => (
            <select key={label} className="bg-purple-800 p-2 rounded border border-pink-400">
              <option>All</option>
            </select>
          ))}
          <select className="bg-purple-800 p-2 rounded border border-pink-400">
            <option>10</option>
          </select>
        </div>

        <button className="mb-4 px-4 py-2 bg-pink-500 rounded">Clear filters</button>

        {['Jun 26, 2025', 'Jun 25, 2025'].map((groupDate) => (
          <div key={groupDate}>
            <div className="text-pink-400 font-bold text-sm mt-4 mb-2">{groupDate}</div>
            {dummyTransactions
              .filter(tx => tx.date === groupDate)
              .map((tx, i) => (
                <div key={i} className="flex justify-between items-center bg-purple-800 p-3 rounded mb-2">
                  <div className="w-24">{tx.time}</div>
                  <div className="flex-1">{tx.details}</div>
                  <div className="w-24 text-green-400">{tx.amount}</div>
                  <div className="w-24">
                    <span className="border border-pink-400 text-pink-300 px-2 py-1 rounded text-xs">{tx.status}</span>
                  </div>
                  <div className="w-32">
                    <div>{tx.pointerName}</div>
                    <div className="text-sm text-purple-300">{tx.currency}</div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </main>
    </div>
  );
}
