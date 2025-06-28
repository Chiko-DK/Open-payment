"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', icon: '🏠', href: '/' },
  { label: 'Lender', icon: '✈', href: '/lender' },
  { label: 'Borrower', icon: '📥', href: '/borrower' },
  { label: 'Transactions', icon: '📄', href: '/transactions' },
  { label: 'Contracts', icon: '🔑', href: '/contracts' },
  { label: 'Account', icon: '⚙', href: '/account' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-800 min-h-screen p-4 text-white">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">L</span>
        </div>
        <span className="font-semibold text-lg">LowN</span>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ label, icon, href }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              pathname === href ? 'bg-slate-700 text-white' : 'hover:bg-slate-700 text-gray-300'
            }`}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}