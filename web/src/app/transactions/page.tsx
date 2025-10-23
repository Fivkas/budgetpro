'use client';

import { useEffect, useState } from 'react';
import { getAuthHeader } from '@/utils/auth';

interface Category {
  id: number;
  name: string;
}
interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  userId: number;
  categoryId: number;
  createdAt: string;
  category?: { name: string };
}

export default function TransactionsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    userId: 1,
    categoryId: '',
  });

  const refresh = async () => {
    try {
      const [tRes, cRes] = await Promise.all([
        fetch(`${API_URL}/transactions`, {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          } as Record<string, string>,
        }),
        fetch(`${API_URL}/categories?userId=${form.userId}`, {
          headers: { ...getAuthHeader() } as Record<string, string>,
        }),
      ]);

      const [tData, cData] = await Promise.all([tRes.json(), cRes.json()]);
      setTransactions(Array.isArray(tData) ? tData : []);
      setCategories(Array.isArray(cData) ? cData : []);
    } catch (err) {
      console.error('❌ Failed to load data:', err);
    }
  };

  useEffect(() => {
    refresh().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Handlers
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      amount: Number(form.amount),
      type: form.type,
      userId: form.userId,
      categoryId: Number(form.categoryId),
    };

    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        } as Record<string, string>,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('❌ Create failed:', data);
        return;
      }

      setForm({ title: '', amount: '', type: 'expense', userId: form.userId, categoryId: '' });
      await refresh();
    } catch (err) {
      console.error('❌ Failed to create transaction:', err);
    }
  };

  const remove = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() } as Record<string, string>,
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error('❌ Delete failed:', errData);
        alert(errData.message || 'Failed to delete transaction');
        return;
      }

      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('❌ Error deleting transaction:', err);
    }
  };

  const money = (n: number) =>
    n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

  return (
    <main className="min-h-screen p-6 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <h1 className="text-3xl font-bold mb-6">💸 Transactions</h1>

      {/* Form */}
      <form
        onSubmit={submit}
        className="max-w-2xl mb-8 p-6 rounded-2xl shadow bg-white dark:bg-gray-800 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Title"
            required
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
          />
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={onChange}
            placeholder="Amount"
            required
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
          />
          <select
            name="type"
            value={form.type}
            onChange={onChange}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={onChange}
            required
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
        >
          ➕ Add
        </button>
      </form>

      {/* List */}
      <section className="max-w-3xl space-y-3">
        {transactions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>
        ) : (
          transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-4 rounded-xl shadow bg-white dark:bg-gray-800"
            >
              <div>
                <p className="font-semibold">{t.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t.category?.name ?? 'No Category'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`font-semibold ${
                    t.type === 'income' ? 'text-green-500' : 'text-red-400'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {money(Math.abs(t.amount))}
                </span>
                <button
                  onClick={() => remove(t.id)}
                  className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:opacity-80"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
