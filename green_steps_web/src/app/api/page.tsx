'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@nextui-org/react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

type Tip = { _id: string; region: string; title: string; tip: string; createdAt: Date };
type RegionData = {
  tips: Tip[];
  facts: string[];
};

export default function Home() {
  const [ecoData, setEcoData] = useState<Record<string, RegionData>>({});
  const [region, setRegion] = useState<string>('');
  const [tips, setTips] = useState<Tip[]>([]);
  const [newTip, setNewTip] = useState({ title: '', tip: '' });
  const [editTip, setEditTip] = useState<Tip | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetch('/data/ecoTips.json')
      .then((res) => res.json())
      .then((data) => setEcoData(data))
      .catch((error) => console.error('Error loading ecoTips:', error));

    if (region) fetchTips();
  }, [region]);

  const fetchTips = async () => {
    const res = await fetch(`/api/tips?region=${region}`);
    const data = await res.json();
    setTips(data);
  };

  const handleAddOrUpdateTip = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editTip ? 'PUT' : 'POST';
    const url = '/api/tips';
    const body = editTip
      ? { id: editTip._id, title: newTip.title, tip: newTip.tip }
      : { region, title: newTip.title, tip: newTip.tip };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setNewTip({ title: '', tip: '' });
      setEditTip(null);
      fetchTips();
    } else {
      const error = await res.json();
      alert(error.error || 'Failed to save tip');
    }
  };

  const handleDeleteTip = async (id: string) => {
    if (confirm('Are you sure you want to delete this tip?')) {
      const res = await fetch('/api/tips', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchTips();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete tip');
      }
    }
  };

  const handleEditTip = (tip: Tip) => {
    setEditTip(tip);
    setNewTip({ title: tip.title, tip: tip.tip });
  };

  if (!region) {
    const firstRegion = Object.keys(ecoData)[0] || '';
    setRegion(firstRegion);
    return <p className="p-6 text-center">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-300 text-center">
        Eco Tips for a Sustainable {region}
      </h1>

      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        >
          {Object.keys(ecoData).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-black dark:text-white">🌙 Dark Mode</span>
          <Switch checked={theme === 'dark'} onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')} />
        </div>
      </div>

      <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
        <Image
          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e"
          alt="Eco-friendly environment"
          width={1200}
          height={400}
          className="w-full h-64 object-cover"
        />
      </div>

      <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Add Your Own Eco Tip</h2>
        <form onSubmit={handleAddOrUpdateTip} className="flex flex-col gap-4">
          <input
            type="text"
            value={newTip.title}
            onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
            placeholder="Tip title"
            className="p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-800"
            required
          />
          <textarea
            value={newTip.tip}
            onChange={(e) => setNewTip({ ...newTip, tip: e.target.value })}
            placeholder="Tip description"
            className="p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-800"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700"
          >
            {editTip ? 'Update Tip' : 'Add Tip'}
          </button>
        </form>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white text-center">All Eco Tips</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Tip</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tips.map((tip) => (
              <tr key={tip._id} className="border">
                <td className="p-2 border">{tip.title}</td>
                <td className="p-2 border">{tip.tip}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleEditTip(tip)}
                    className="mr-2 px-2 py-1 bg-blue-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTip(tip._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}