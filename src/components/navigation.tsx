"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
  { label: 'Home', icon: '🏠', href: '/' },
  { label: 'Lender', icon: '✈', href: '/lender', requiresRole: 'lender' },
  { label: 'Borrower', icon: '📥', href: '/borrower', requiresRole: 'borrower' },
  { label: 'Transactions', icon: '📄', href: '/transactions' },
  { label: 'Contracts', icon: '🔑', href: '/contracts' },
  { label: 'Account', icon: '⚙', href: '/account' },
];

export default function Nav() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<'lender' | 'borrower'>('borrower');

  // Listen for role changes from localStorage or other state management
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      // Try to get role from localStorage first
      const savedRole = localStorage.getItem('userRole') as 'lender' | 'borrower';
      if (savedRole) {
        setUserRole(savedRole);
      }

      // Listen for storage changes to sync across tabs/components
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'userRole' && e.newValue) {
          setUserRole(e.newValue as 'lender' | 'borrower');
        }
      };

      window.addEventListener('storage', handleStorageChange);
      
      // Custom event listener for role changes within the same tab
      const handleRoleChange = (e: CustomEvent) => {
        setUserRole(e.detail.role);
      };

      window.addEventListener('roleChanged', handleRoleChange as EventListener);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('roleChanged', handleRoleChange as EventListener);
      };
    }
  }, []);

  const isNavItemAccessible = (item: typeof navItems[0]) => {
    // If the item doesn't require a specific role, it's always accessible
    if (!item.requiresRole) return true;
    
    // If the item requires a role, check if user has that role
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
      <div className="flex items-center gap-2 mb-8">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">L</span>
        </div>
        <span className="font-semibold text-lg">LowN</span>
      </div>

      {/* Role Indicator */}
      <div className="mb-4 p-2 bg-slate-700 rounded-lg text-center">
        <div className="text-xs text-slate-400">Current Mode</div>
        <div className="font-semibold text-sm">
          {userRole === 'lender' ? '💰 LENDER' : '📥 BORROWER'}
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const { label, icon, href } = item;
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
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
              {!isAccessible && (
                <span className="ml-auto text-xs">🔒</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}