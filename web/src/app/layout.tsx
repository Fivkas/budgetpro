'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '@/utils/auth';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }

    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(newTheme);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    router.push('/auth/login');
  };

  return (
    <html lang="en" className={theme}>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 p-6 shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-8 text-center">💰 BudgetPro</h2>
            <nav className="space-y-4">
              <Link
                href="/"
                className={`block p-2 rounded ${
                  pathname === '/' ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/transactions"
                className={`block p-2 rounded ${
                  pathname.startsWith('/transactions') && !pathname.includes('analytics')
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : ''
                }`}
              >
                Transactions
              </Link>
              <Link
                href="/categories"
                className={`block p-2 rounded ${
                  pathname.startsWith('/categories') ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
              >
                Categories
              </Link>
              <Link
                href="/transactions/analytics"
                className={`block p-2 rounded ${
                  pathname.startsWith('/transactions/analytics')
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : ''
                }`}
              >
                Analytics
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={toggleTheme}
              className="w-full px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition"
            >
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold transition"
              >
                🚪 Logout
              </button>
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <ProtectedRoute>{children}</ProtectedRoute>
        </main>
      </body>
    </html>
  );
}
