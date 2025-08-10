"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// 1️⃣ Import Lucide icons
import {
  Home,
  HandCoins,
  Download,
  FileText,
  Key,
  Settings,
  Lock,
} from 'lucide-react';

// 2️⃣ Define nav items with icon components
const navItems = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Lender', icon: HandCoins, href: '/lender', requiresRole: 'lender' },
  { label: 'Borrower', icon: Download, href: '/borrower', requiresRole: 'borrower' },
  { label: 'Transactions', icon: FileText, href: '/transactions' },
  { label: 'Contracts', icon: Key, href: '/contracts' },
  { label: 'Account', icon: Settings, href: '/account' },
];

export default function Nav() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<'lender' | 'borrower'>('borrower');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('userRole') as 'lender' | 'borrower';
      if (savedRole) {
        setUserRole(savedRole);
      }

      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'userRole' && e.newValue) {
          setUserRole(e.newValue as 'lender' | 'borrower');
        }
      };

      const handleRoleChange = (e: CustomEvent) => {
        setUserRole(e.detail.role);
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('roleChanged', handleRoleChange as EventListener);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('roleChanged', handleRoleChange as EventListener);
      };
    }
  }, []);

  const isNavItemAccessible = (item: typeof navItems[0]) => {
    if (!item.requiresRole) return true;
    return item.requiresRole === userRole;
  };

  const handleRestrictedClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    if (!isNavItemAccessible(item)) {
      e.preventDefault();
      alert(`You need to be in ${item.requiresRole?.toUpperCase()} mode to access this page. Please switch your role in the Account page.`);
    }
  };

  return (
    <aside className="w-64 bg-slate-800 min-h-screen p-4 text-white">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">L</span>
        </div>
        <span className="font-semibold text-lg">LowN</span>
      </div>

      {/* Role Indicator */}
      <div className="mb-4 p-2 bg-slate-700 rounded-lg text-center">
        <div className="text-xs text-slate-400">Current Mode</div>
        <div className="font-semibold text-sm flex items-center justify-center gap-1">
          {userRole === 'lender' ? <HandCoins className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          {userRole.toUpperCase()}
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const { label, icon: Icon, href } = item;
          const isAccessible = isNavItemAccessible(item);
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={isAccessible ? href : '#'}
              onClick={(e) => handleRestrictedClick(e, item)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive && isAccessible
                  ? 'bg-slate-700 text-white'
                  : isAccessible
                  ? 'hover:bg-slate-700 text-gray-300'
                  : 'text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              {!isAccessible && <Lock className="ml-auto w-4 h-4 opacity-70" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
