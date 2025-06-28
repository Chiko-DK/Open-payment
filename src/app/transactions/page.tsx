"use client";

// app/routes/transactions.tsx
import { useState } from 'react';
import Nav from "@/components/navigation";

const dummyTransactions = [
  {
    date: 'Jun 26, 2025',
    time: '03:26 PM',
    details: 'Loan repayment from borrower A',
    amount: '+R 50.00',
    status: 'COMPLETED',
    pointerName: 'userA.lown.africa',
    currency: 'ZAR',
    account: 'Wallet 1',
    type: 'INCOMING'
  },
  {
    date: 'Jun 26, 2025',
    time: '02:50 PM',
    details: 'Lent funds to borrower B',
    amount: '-R 100.00',
    status: 'PENDING',
    pointerName: 'userB.lown.africa',
    currency: 'ZAR',
    account: 'Wallet 2',
    type: 'OUTGOING'
  },
  {
    date: 'Jun 26, 2025',
    time: '01:36 PM',
    details: 'Received interest from borrower A',
    amount: '+R 5.00',
    status: 'COMPLETED',
    pointerName: 'userA.lown.africa',
    currency: 'ZAR',
    account: 'Wallet 1',
    type: 'INCOMING'
  },
];

const unique = (arr: string[]) => Array.from(new Set(arr));

type FilterKey = 'account' | 'pointer' | 'type' | 'status';

type Transaction = typeof dummyTransactions[number];

export default function Transactions() {
  const [filters, setFilters] = useState<Record<FilterKey, string>>({ account: 'All', pointer: 'All', type: 'All', status: 'All' });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = dummyTransactions.filter(tx => {
    return (
      (filters.account === 'All' || tx.account === filters.account) &&
      (filters.pointer === 'All' || tx.pointerName === filters.pointer) &&
      (filters.type === 'All' || tx.type === filters.type) &&
      (filters.status === 'All' || tx.status === filters.status)
    );
  });

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const resetFilters = () => setFilters({ account: 'All', pointer: 'All', type: 'All', status: 'All' });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex">
      <Nav />

      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>

        <div className="grid grid-cols-5 gap-4 mb-4">
          {(['account', 'pointer', 'type', 'status'] as FilterKey[]).map(key => (
            <select
              key={key}
              className="bg-white p-2 rounded border border-gray-300"
              value={filters[key]}
              onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
            >
              <option>All</option>
              {unique(dummyTransactions.map(tx => key === 'pointer' ? tx.pointerName : tx[key])).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ))}
          <select
            className="bg-white p-2 rounded border border-gray-300"
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
          >
            {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <button className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition" onClick={resetFilters}>Clear filters</button>

        {/* Table Headers */}
        <div className="flex justify-between font-semibold text-sm text-gray-600 uppercase py-2 px-4 border-b border-gray-300">
          <div className="w-24">Time</div>
          <div className="flex-1">Details</div>
          <div className="w-24">Amount</div>
          <div className="w-24">Status</div>
          <div className="w-48">Pointer</div>
        </div>

        {paginatedTransactions.map((tx, i) => (
          <div key={i} className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-lg mb-2 shadow-sm">
            <div className="w-24 font-mono text-gray-500">{tx.time}</div>
            <div className="flex-1 text-sm">{tx.details}</div>
            <div className={`w-24 font-semibold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{tx.amount}</div>
            <div className="w-24">
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-300">{tx.status}</span>
            </div>
            <div className="w-48 text-sm">
              <div className="font-medium text-gray-700">{tx.pointerName}</div>
              <div className="text-gray-400">{tx.currency}</div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >Next</button>
        </div>
      </main>
    </div>
  );
}
