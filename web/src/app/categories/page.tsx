'use client';

import { useEffect, useState } from 'react';
import { getAuthHeader } from '@/utils/auth';

interface Category {
  id: number;
  name: string;
}

export default function CategoriesPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const USER_ID = 1;

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const load = async () => {
    try {
      const res = await fetch(`${API_URL}/categories?userId=${USER_ID}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      if (!res.ok) {
        console.error('❌ Failed to load categories', await res.text());
        setCategories([]);
        return;
      }

      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error loading categories:', err);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ name, userId: USER_ID }),
      });

      const created = await res.json();
      if (!res.ok) {
        alert(created.message || 'Failed to create category');
        return;
      }

      setName('');
      await load();
    } catch (err) {
      console.error('❌ Failed to add category:', err);
    }
  };

  const startEdit = (c: Category) => {
    setEditId(c.id);
    setEditName(c.name);
  };

  const saveEdit = async () => {
    if (!editId) return;

    try {
      const res = await fetch(`${API_URL}/categories/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ name: editName }),
      });

      const updated = await res.json();
      if (!res.ok) {
        alert(updated.message || 'Failed to update');
        return;
      }

      setEditId(null);
      setEditName('');
      await load();
    } catch (err) {
      console.error('❌ Failed to update category:', err);
    }
  };

  const remove = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() },
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to delete');
        return;
      }

      await load();
    } catch (err) {
      console.error('❌ Failed to delete category:', err);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <h1 className="text-3xl font-bold mb-6">🗂️ Categories</h1>

      {/* Add form */}
      <form
        onSubmit={add}
        className="max-w-xl mb-6 p-6 rounded-2xl shadow bg-white dark:bg-gray-800 flex gap-3"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category"
          required
          className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-700"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
        >
          Add
        </button>
      </form>

      {/* List */}
      <section className="max-w-xl space-y-3">
        {categories.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No categories yet.</p>
        ) : (
          categories.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl shadow bg-white dark:bg-gray-800 flex items-center justify-between"
            >
              {editId === c.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-700"
                  />
                  <button
                    onClick={saveEdit}
                    className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditName('');
                    }}
                    className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-medium">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(c)}
                      className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(c.id)}
                      className="px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </section>
    </main>
  );
}
