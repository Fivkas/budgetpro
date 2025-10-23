'use client';

import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { getAuthHeader } from '@/utils/auth';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category?: { name: string };
  createdAt: string;
}

export default function AnalyticsPage() {
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
        console.log('📊 Analytics fetched:', data);

        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error('❌ Invalid analytics data:', data);
          setTransactions([]);
        }
      } catch (err) {
        console.error('❌ Failed to fetch analytics:', err);
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [API_URL]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading analytics...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  // ✅ Always ensure it's an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

  const income = safeTransactions.filter((t) => t.type === 'income');
  const expense = safeTransactions.filter((t) => t.type === 'expense');

  const incomeByCategory = Object.values(
    income.reduce((acc, t) => {
      const cat = t.category?.name ?? 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map((val, i, arr) => ({
    name: Object.keys(
      income.reduce((acc, t) => {
        const cat = t.category?.name ?? 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
    )[i],
    value: val,
  }));

  const expenseByCategory = Object.entries(
    expense.reduce((acc, t) => {
      const cat = t.category?.name ?? 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const balanceByMonth = Object.entries(
    safeTransactions.reduce((acc, t) => {
      const month = new Date(t.createdAt).toLocaleString('default', {
        month: 'short',
      });
      const amount = t.type === 'income' ? t.amount : -Math.abs(t.amount);
      acc[month] = (acc[month] || 0) + amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([month, total]) => ({ month, total }));

  return (
    <main className="min-h-screen p-6 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <h1 className="text-3xl font-bold mb-6">📈 Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income Chart */}
        <div className="p-6 rounded-2xl shadow bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-green-500">Income by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {incomeByCategory.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Chart */}
        <div className="p-6 rounded-2xl shadow bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-red-500">Expenses by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseByCategory.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Balance by Month */}
        <div className="lg:col-span-2 p-6 rounded-2xl shadow bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-blue-500">Balance by Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={balanceByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
