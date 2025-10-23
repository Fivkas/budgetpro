'use client';

import { useEffect, useState } from 'react';
import { getAuthHeader } from '@/utils/auth';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category?: { name: string };
  createdAt: string;
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${API_URL}/transactions`, {
          headers: { ...getAuthHeader() },
        });

        if (res.status === 401) {
          console.warn('🚪 Unauthorized — redirecting to login...');
          localStorage.removeItem('token');
          window.location.href = '/auth/login';
          return;
        }

        const data = await res.json();
        console.log('🔍 Transactions fetched:', data);

        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error('❌ Invalid data from API:', data);
          setTransactions([]);
        }
      } catch (err) {
        console.error('❌ Failed to fetch transactions:', err);
        setError('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [API_URL]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading transactions...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const incomeTotal = safeTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const expenseTotal = safeTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = incomeTotal - expenseTotal;

  const recent = [...safeTransactions]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);

  const money = (n: number) =>
    n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

  return (
    <main className="min-h-screen p-6 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl p-6 shadow bg-white dark:bg-gray-800">
          <h3 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Total Income
          </h3>
          <p className="mt-2 text-2xl font-bold text-green-500">
            +{money(incomeTotal)}
          </p>
        </div>
        <div className="rounded-2xl p-6 shadow bg-white dark:bg-gray-800">
          <h3 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Total Expenses
          </h3>
          <p className="mt-2 text-2xl font-bold text-red-400">
            -{money(expenseTotal)}
          </p>
        </div>
        <div className="rounded-2xl p-6 shadow bg-white dark:bg-gray-800">
          <h3 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Balance
          </h3>
          <p
            className={`mt-2 text-2xl font-bold ${
              balance >= 0 ? 'text-green-500' : 'text-red-400'
            }`}
          >
            {money(balance)}
          </p>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="rounded-2xl p-6 shadow bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        {recent.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recent.map((t) => (
              <li key={t.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t.category?.name ?? 'No Category'} •{' '}
                    {new Date(t.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`font-semibold ${
                    t.type === 'income' ? 'text-green-500' : 'text-red-400'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {money(Math.abs(t.amount))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}