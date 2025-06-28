"use client";

import { useState } from 'react';
import Nav from '@/components/navigation';

const contracts = [
  {
    id: 'c1',
    borrower: 'Sibongile Ndlovu',
    pointer: 'sibongile.lown.africa',
    amount: 'R 200.00',
    interestRate: '8%',
    duration: '4 weeks',
    startDate: 'Jun 1, 2025',
    status: 'ACTIVE',
    repaymentSchedule: ['R 54.00 - Jun 8', 'R 54.00 - Jun 15', 'R 54.00 - Jun 22', 'R 54.00 - Jun 29'],
  },
  {
    id: 'c2',
    borrower: 'Thabo Maseko',
    pointer: 'thabo.lown.africa',
    amount: 'R 100.00',
    interestRate: '5%',
    duration: '2 weeks',
    startDate: 'May 20, 2025',
    status: 'COMPLETED',
    repaymentSchedule: ['R 52.50 - May 27', 'R 52.50 - Jun 3'],
  }
];

export default function Contracts() {
  const [selectedContract, setSelectedContract] = useState<typeof contracts[0] | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex">
      <Nav />

      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Contracts</h2>

        {!selectedContract ? (
          <div className="space-y-4">
            {contracts.map(contract => (
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
            >← Back to contracts</button>

            <h3 className="text-xl font-bold mb-2">Contract with {selectedContract.borrower}</h3>
            <p className="text-sm text-gray-600 mb-4">Pointer: {selectedContract.pointer}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Loan Amount</div>
                <div className="font-semibold text-gray-800">{selectedContract.amount}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Interest Rate</div>
                <div className="font-semibold text-gray-800">{selectedContract.interestRate}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Duration</div>
                <div className="font-semibold text-gray-800">{selectedContract.duration}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Start Date</div>
                <div className="font-semibold text-gray-800">{selectedContract.startDate}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Status</div>
                <div className="font-semibold text-indigo-600">{selectedContract.status}</div>
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

// Or this below
// import { useState } from "react";
// import { Dialog } from "@headlessui/react";

// const contracts = [
//   {
//     id: 1,
//     client: "$ilp.interledger-test.dev/da054740",
//     status: "APPROVED",
//     date: "Jun 26, 2025, 03:27 PM",
//     amount: "R500",
//     rate: "10%",
//     period: "3 months",
//   },
//   {
//     id: 2,
//     client: "$ilp.interledger-test.dev/da054740",
//     status: "PENDING",
//     date: "Jun 26, 2025, 02:41 PM",
//     amount: "R200",
//     rate: "12%",
//     period: "1 month",
//   },
// ];

// export default function ContractPage() {
//   const [selectedContract, setSelectedContract] = useState(null);

//   return (
//     <div className="p-6 bg-purple-900 min-h-screen text-white font-mono">
//       <h2 className="text-2xl font-bold mb-6">Digital Contracts</h2>
//       <table className="w-full border-separate border-spacing-y-2">
//         <thead>
//           <tr className="text-left text-pink-300 text-sm">
//             <th>Client</th>
//             <th>Status</th>
//             <th>Date</th>
//             <th>Details</th>
//           </tr>
//         </thead>
//         <tbody>
//           {contracts.map((contract) => (
//             <tr key={contract.id} className="text-white text-sm">
//               <td>{contract.client}</td>
//               <td>
//                 <span
//                   className={`px-2 py-1 rounded-md text-xs font-bold ${
//                     contract.status === "APPROVED"
//                       ? "bg-cyan-500 text-black"
//                       : "bg-yellow-400 text-black"
//                   }`}
//                 >
//                   {contract.status}
//                 </span>
//               </td>
//               <td>{contract.date}</td>
//               <td>
//                 <button
//                   onClick={() => setSelectedContract(contract)}
//                   className="text-pink-400 hover:underline"
//                 >
//                   View
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <Dialog
//         open={selectedContract !== null}
//         onClose={() => setSelectedContract(null)}
//         className="relative z-50"
//       >
//         <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-md text-black">
//             {selectedContract && (
//               <>
//                 <Dialog.Title className="text-lg font-bold mb-4">
//                   Contract Details
//                 </Dialog.Title>
//                 <p><strong>Client:</strong> {selectedContract.client}</p>
//                 <p><strong>Amount:</strong> {selectedContract.amount}</p>
//                 <p><strong>Interest Rate:</strong> {selectedContract.rate}</p>
//                 <p><strong>Repayment Period:</strong> {selectedContract.period}</p>
//                 <p><strong>Status:</strong> {selectedContract.status}</p>
//                 <p><strong>Date:</strong> {selectedContract.date}</p>
//                 <div className="mt-6 text-right">
//                   <button
//                     onClick={() => setSelectedContract(null)}
//                     className="px-4 py-2 bg-purple-800 text-white rounded hover:bg-purple-700"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </>
//             )}
//           </Dialog.Panel>
//         </div>
//       </Dialog>
//     </div>
//   );
// }