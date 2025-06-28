"use client";

import { useState, useEffect } from 'react';
import Nav from '@/components/navigation';

type Contract = {
  id: string;
  borrower: string;
  pointer: string;
  amount: string;
  interestRate: string;
  duration: string;
  startDate: string;
  status: string;
  repaymentSchedule: string[];
};

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  useEffect(() => {
    import('../data/contracts.json').then((data) => {
      // Enrich the imported JSON data with default details
      const enriched = data.default.map((c: any, index: number) => ({
        id: `c${index + 1}`,
        borrower: c.name,
        pointer: c.pointer,
        amount: c.amount,
        status: c.status,
        interestRate: index === 0 ? '8%' : '5%',
        duration: index === 0 ? '4 weeks' : '2 weeks',
        startDate: index === 0 ? 'Jun 1, 2025' : 'May 20, 2025',
        repaymentSchedule:
          index === 0
            ? ['R 54.00 - Jun 8', 'R 54.00 - Jun 15', 'R 54.00 - Jun 22', 'R 54.00 - Jun 29']
            : ['R 52.50 - May 27', 'R 52.50 - Jun 3'],
      }));
      setContracts(enriched);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex">
      <Nav />

      <main className="flex-1 p-6 ml-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Contracts</h2>

        {!selectedContract ? (
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-center hover:bg-gray-50 transition cursor-pointer"
                onClick={() => setSelectedContract(contract)}
              >
                <div>
                  <div className="font-medium text-lg">{contract.borrower}</div>
                  <div className="text-sm text-gray-500">{contract.pointer}</div>
                </div>
                <div className="text-sm text-gray-600">{contract.amount}</div>
                <div className="text-sm text-indigo-600 font-semibold">{contract.status}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <button
              className="mb-4 text-sm text-indigo-600 hover:underline"
              onClick={() => setSelectedContract(null)}
            >
              ← Back to contracts
            </button>

            <h3 className="text-xl font-bold mb-2">
              Contract with {selectedContract.borrower}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Pointer: {selectedContract.pointer}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Loan Amount</div>
                <div className="font-semibold text-gray-800">
                  {selectedContract.amount}
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Interest Rate</div>
                <div className="font-semibold text-gray-800">
                  {selectedContract.interestRate}
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Duration</div>
                <div className="font-semibold text-gray-800">
                  {selectedContract.duration}
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Start Date</div>
                <div className="font-semibold text-gray-800">
                  {selectedContract.startDate}
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Status</div>
                <div className="font-semibold text-indigo-600">
                  {selectedContract.status}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-bold mb-2">Repayment Schedule</h4>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {selectedContract.repaymentSchedule.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
