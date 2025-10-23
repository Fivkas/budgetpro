'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const current = stored === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(current);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      router.push('/auth/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <h1 className="text-3xl font-bold mb-6">📝 Register</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-4 transition-colors"
      >
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-all"
        >
          Register
        </button>
      </form>

      <p className="mt-4 text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <a href="/auth/login" className="text-blue-500 hover:underline">
          Login
        </a>
      </p>
    </main>
  );
}
