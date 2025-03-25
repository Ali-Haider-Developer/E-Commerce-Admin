'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';

interface Counter {
  id: string;
  name: string;
  value: number;
}

export default function CountersPage() {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCounter, setNewCounter] = useState({ name: '', value: 0 });
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);

  useEffect(() => {
    fetchCounters();
  }, []);

  const fetchCounters = async () => {
    try {
      const response = await fetch('/api/counters');
      if (!response.ok) {
        throw new Error('Failed to fetch counters');
      }
      const data = await response.json();
      setCounters(data);
    } catch (error) {
      console.error('Error fetching counters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/counters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCounter),
      });

      if (!response.ok) {
        throw new Error('Failed to create counter');
      }

      const data = await response.json();
      setCounters([...counters, data]);
      setNewCounter({ name: '', value: 0 });
    } catch (error) {
      console.error('Error creating counter:', error);
    }
  };

  const handleUpdateCounter = async (counter: Counter) => {
    try {
      const response = await fetch('/api/counters', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(counter),
      });

      if (!response.ok) {
        throw new Error('Failed to update counter');
      }

      const data = await response.json();
      setCounters(counters.map(c => c.id === data.id ? data : c));
      setEditingCounter(null);
    } catch (error) {
      console.error('Error updating counter:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Counters</h1>
      </div>

      {/* Add New Counter Form */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Add New Counter
          </h3>
          <form onSubmit={handleAddCounter} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Counter Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newCounter.name}
                  onChange={(e) =>
                    setNewCounter({ ...newCounter, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="value"
                  className="block text-sm font-medium text-gray-700"
                >
                  Initial Value
                </label>
                <input
                  type="number"
                  id="value"
                  value={newCounter.value}
                  onChange={(e) =>
                    setNewCounter({
                      ...newCounter,
                      value: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Counter
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Counters List */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Active Counters
          </h3>
          <div className="mt-5">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Value
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {counters.map((counter) => (
                    <tr key={counter.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {counter.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {editingCounter?.id === counter.id ? (
                          <input
                            type="number"
                            value={editingCounter.value}
                            onChange={(e) =>
                              setEditingCounter({
                                ...editingCounter,
                                value: parseInt(e.target.value),
                              })
                            }
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        ) : (
                          counter.value
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {editingCounter?.id === counter.id ? (
                          <button
                            onClick={() => handleUpdateCounter(editingCounter)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingCounter(counter)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 