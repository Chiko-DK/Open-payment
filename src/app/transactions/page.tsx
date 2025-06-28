"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/navigation";

type Transaction = {
  time: string;
  details: string;
  amount: string;
  status: string;
  pointer: string; // Combined pointerName and currency
};

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    import("../data/transactions.json").then((data) => {
      const enriched = data.default.map((tx: any) => {
        const [pointerName, currency] = tx.pointer.split(" ");
        return {
          ...tx,
          pointerName,
          currency,
          account: "Wallet 1", // still usable for future filtering
          type: tx.amount.startsWith("+") ? "INCOMING" : "OUTGOING",
        };
      });
      setTransactions(enriched);
    });
  }, []);

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex">
      <Nav />

      <main className="flex-1 p-6 ml-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Transaction History
        </h2>

        <div className="mb-4 flex justify-end">
          <select
            className="bg-white p-2 rounded border border-gray-300"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </select>
        </div>

        {/* Table Headers */}
        <div className="flex justify-between font-semibold text-sm text-gray-600 uppercase py-2 px-4 border-b border-gray-300">
          <div className="w-24">Time</div>
          <div className="flex-1">Details</div>
          <div className="w-24">Amount</div>
          <div className="w-24">Status</div>
          <div className="w-48">Pointer</div>
        </div>

        {paginatedTransactions.map((tx, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-lg mb-2 shadow-sm"
          >
            <div className="w-24 font-mono text-gray-500">{tx.time}</div>
            <div className="flex-1 text-sm">{tx.details}</div>
            <div
              className={`w-24 font-semibold ${
                tx.amount.startsWith("+") ? "text-green-600" : "text-red-500"
              }`}
            >
              {tx.amount}
            </div>
            <div className="w-24">
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-300">
                {tx.status}
              </span>
            </div>
            <div className="w-48 text-sm">
              <div className="font-medium text-gray-700">{tx.pointer}</div>
              {/* <div className="text-gray-400">{tx.currency}</div> */}
            </div>
          </div>
        ))}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
