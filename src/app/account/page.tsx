"use client";

import { useState } from "react";
import Nav from "@/components/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";

const initialUser = {
  name: 'chiko Kasongo',
  email: 'chiko@lown.africa',
  phone: '+27 71 234 5678',
  joined: 'March 2024',
  location: 'Rondebosch, Cape Town',
  avatarUrl: '/avatar.png',
  creditScore: 712,
  reliability: 4.7,
  completedLoans: 28,
  activeLoans: 2,
  missedRepayments: 0,
  walletBalance: 'R 325.00',
  role: 'borrower', // or 'lender'
};

export default function Account() {
  const [user, setUser] = useState(initialUser);
  const router = useRouter();

  const toggleRole = () => {
    const newRole = user.role === 'lender' ? 'borrower' : 'lender';
    setUser({ ...user, role: newRole });
    alert(`Switched to ${newRole.toUpperCase()} mode`);

    // Redirect if on wrong page after switching
    if (newRole === "borrower" && location.pathname === "/lender") {
      router.push("/borrower");
    } else if (newRole === "lender" && location.pathname === "/borrower") {
      router.push("/lender");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex">
      <Nav />

      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">My Account</h2>

        <div className="bg-white p-6 rounded-lg shadow mb-8 flex gap-6">
          <Image
            src={user.avatarUrl}
            alt="Profile Picture"
            width={100}
            height={100}
            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-600"
          />

          <div className="flex-1">
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phone}</p>
            <p className="text-gray-600">Joined: {user.joined}</p>
            <p className="text-gray-600">Location: {user.location}</p>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Credit Score</div>
                <div className="font-semibold text-indigo-600 text-xl">{user.creditScore}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Reliability Rating</div>
                <div className="font-semibold text-green-600 text-xl">{user.reliability} / 5</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Loans Completed</div>
                <div className="font-semibold text-gray-700 text-xl">{user.completedLoans}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Active Loans</div>
                <div className="font-semibold text-yellow-600 text-xl">{user.activeLoans}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-gray-500">Missed Repayments</div>
                <div className="font-semibold text-red-500 text-xl">{user.missedRepayments}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-600 text-white rounded-lg p-6 shadow text-center mb-6">
          <h4 className="text-lg">Wallet Balance</h4>
          <div className="text-3xl font-bold mt-2">{user.walletBalance}</div>
        </div>

        <div className="text-center">
          <p className="mb-2 text-sm text-gray-600">Current Role: <span className="font-bold">{user.role.toUpperCase()}</span></p>
          <button
            onClick={toggleRole}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg transition"
          >
            Switch to {user.role === 'borrower' ? 'LENDER' : 'BORROWER'} Mode
          </button>
        </div>
      </main>
    </div>
  );
}
