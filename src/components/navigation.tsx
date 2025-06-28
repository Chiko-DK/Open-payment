"use client";

import Link from 'next/link';

export default function Nav() {
  return (
    <aside className="w-64 bg-indigo-900 text-white p-6 space-y-6">
      <h1 className="text-2xl font-bold leading-tight">Lown<br /></h1>
      <nav className="space-y-3">
        <Link href="/" className="block hover:text-indigo-300">🏠 Home</Link>
        <Link href="/lender" className="block hover:text-indigo-300">✈️ Lender</Link>
        <Link href="/borrower" className="block hover:text-indigo-300">📥 Borrower</Link>
        <Link href="/transactions" className="block hover:text-indigo-300">📄 Transactions</Link>
        <Link href="/contracts" className="block hover:text-indigo-300">🔑 Contracts</Link>
        <Link href="/account" className="block hover:text-indigo-300">⚙️ Account</Link>
      </nav>
    </aside>
  );
}
