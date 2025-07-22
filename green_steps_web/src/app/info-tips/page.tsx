'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/app/components/ui/switch';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import RegionSelector from '@/app/components/RegionSelector';
import TipCard from '../components/TipCard';
import { FaLeaf, FaRecycle, FaGlobeAmericas, FaHandsHelping } from 'react-icons/fa';
import { useRouter } from "next/navigation";

type Tip = {
  _id: string;
  region: string;
  title: string;
  tip: string;
  createdAt: string;
  image?: string;
  likes?: number;
  category?: string; // e.g., "Home", "Travel", etc.
};

const TIPS_PER_PAGE = 4;

export default function InfoTipsPage() {
  const [region, setRegion] = useState<string>('Toronto');
  const [tips, setTips] = useState<Tip[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'date' | 'title'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [likeMap, setLikeMap] = useState<{ [id: string]: boolean }>({});
  const [editTip, setEditTip] = useState<Tip | null>(null);
  const [newTipTitle, setNewTipTitle] = useState('');
  const [newTipDescription, setNewTipDescription] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();

  const globalImage = 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e';
  const fallbackImage = '/images/fallback.jpg';

  useEffect(() => {
    fetchTips();
  }, [region]);

  const fetchTips = async () => {
    try {
      const res = await fetch(`/api/tips?region=${region}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setTips(data);
      setCurrentPage(1);
    } catch {
      setTips([]);
      showToast('error', 'Failed to fetch tips');
    }
  };

  // --- Toast helpers ---
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  // --- CRUD ---
  const handleAddOrUpdateTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTipTitle.trim() || !newTipDescription.trim()) {
      showToast('error', 'Both title and description are required!');
      return;
    }
    const method = editTip ? 'PUT' : 'POST';
    const url = '/api/tips';
    const body = editTip
      ? { _id: editTip._id, region, title: newTipTitle.trim(), tip: newTipDescription.trim() }
      : { region, title: newTipTitle.trim(), tip: newTipDescription.trim() };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setNewTipTitle('');
      setNewTipDescription('');
      setEditTip(null);
      fetchTips();
      showToast('success', editTip ? 'Tip updated!' : 'Tip added!');
    } catch {
      showToast('error', 'Failed to save tip');
    }
  };

  const handleDeleteTip = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tip?')) return;
    try {
      const res = await fetch('/api/tips', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id }),
      });
      if (!res.ok) throw new Error();
      fetchTips();
      showToast('success', 'Tip deleted!');
    } catch {
      showToast('error', 'Failed to delete tip');
    }
  };

  const handleEditTip = (tip: Tip) => {
    setEditTip(tip);
    setNewTipTitle(tip.title);
    setNewTipDescription(tip.tip);
  };

  // --- Like/Upvote (local only) ---
  const handleLike = (id: string) => {
    setLikeMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Bookmark ---
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('ecoBookmarks') || '[]');
    }
    return [];
  });

  const handleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const updated = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      localStorage.setItem('ecoBookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  // --- Search, Sort, Pagination ---
  const filteredTips = tips
    .filter(
      (tip) =>
        tip.title.toLowerCase().includes(search.toLowerCase()) ||
        tip.tip.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === 'date'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : a.title.localeCompare(b.title)
    );

  const totalPages = Math.ceil(filteredTips.length / TIPS_PER_PAGE);
  const paginatedTips = filteredTips.slice(
    (currentPage - 1) * TIPS_PER_PAGE,
    currentPage * TIPS_PER_PAGE
  );

  const topTips = [...filteredTips]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 2); // Show top 2

  // --- UI ---
  return (
    <>
      {/* Subtle SVG pattern overlay */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 800 600">
        <circle cx="400" cy="300" r="300" fill="#34d399" fillOpacity="0.15" />
        <circle cx="700" cy="100" r="100" fill="#10b981" fillOpacity="0.10" />
        <circle cx="100" cy="500" r="80" fill="#6ee7b7" fillOpacity="0.12" />
      </svg>

      {/* Hero Section */}
      <section className="relative z-10 py-10 text-center flex flex-col items-center w-full max-w-2xl mx-auto px-2 sm:px-4">
        <FaLeaf className="mx-auto text-green-500 text-5xl mb-2 animate-bounce" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-2 drop-shadow">Eco Tips Library</h1>
        <p className="text-lg md:text-xl text-green-700 max-w-xl mx-auto mb-4">Discover, share, and act on practical tips for a greener, more sustainable lifestyle. Every small step counts!</p>
        <a href="#add-tip" className="inline-block mt-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition">Share Your Own Tip</a>
      </section>

      {/* Why Eco Tips Section */}
      <section className="relative z-10 max-w-2xl w-full mx-auto py-6 px-2 sm:px-4">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Why Eco Tips?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white/80 rounded-lg p-5 flex flex-col items-center shadow">
            <FaRecycle className="text-green-500 text-3xl mb-2" />
            <span className="font-semibold text-green-800 mb-1">Reduce Waste</span>
            <span className="text-green-700 text-sm text-center">Simple actions to cut down on daily waste and pollution.</span>
          </div>
          <div className="bg-white/80 rounded-lg p-5 flex flex-col items-center shadow">
            <FaGlobeAmericas className="text-green-500 text-3xl mb-2" />
            <span className="font-semibold text-green-800 mb-1">Protect Our Planet</span>
            <span className="text-green-700 text-sm text-center">Help preserve natural resources for future generations.</span>
          </div>
          <div className="bg-white/80 rounded-lg p-5 flex flex-col items-center shadow">
            <FaHandsHelping className="text-green-500 text-3xl mb-2" />
            <span className="font-semibold text-green-800 mb-1">Community Impact</span>
            <span className="text-green-700 text-sm text-center">Inspire and learn from others in your local area.</span>
          </div>
          <div className="bg-white/80 rounded-lg p-5 flex flex-col items-center shadow">
            <FaLeaf className="text-green-500 text-3xl mb-2" />
            <span className="font-semibold text-green-800 mb-1">Live Healthier</span>
            <span className="text-green-700 text-sm text-center">Eco-friendly habits often mean a healthier lifestyle.</span>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="my-8 border-t border-green-300 max-w-2xl w-full mx-auto" />

      {/* Main Content (existing features) */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col gap-8">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 px-6 py-2 rounded shadow-lg text-white ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {toast.message}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-4 justify-center items-center">
          <RegionSelector onSelect={setRegion} />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-black dark:text-white">🌙 Dark Mode</span>
            <Switch checked={isDark} onCheckedChange={toggleTheme} />
          </div>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-between w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search eco tips..."
            className="p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 w-full md:w-1/2"
          />
          <div className="flex items-center gap-2">
            <label className="text-black dark:text-white">Sort by:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'date' | 'title')}
              className="p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            >
              <option value="date">Newest</option>
              <option value="title">Title</option>
            </select>
          </div>
          <div className="text-black dark:text-white text-sm">
            <b>{filteredTips.length}</b> tip{filteredTips.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Banner */}
        <div className="mb-4 rounded-2xl overflow-hidden shadow-lg w-full">
          <Image
            src={globalImage}
            alt="Eco-friendly environment"
            width={900}
            height={250}
            className="w-full h-56 object-cover rounded-2xl"
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />
        </div>

        {/* Add/Update Form */}
        <div id="add-tip" className="mb-4 p-6 bg-white/90 dark:bg-gray-700 rounded-xl shadow-md w-full">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            {editTip ? 'Update Your Eco Tip' : 'Add Your Own Eco Tip'}
          </h2>
          <form onSubmit={handleAddOrUpdateTip} className="flex flex-col gap-4">
            <div>
              <label htmlFor="tipTitle" className="block text-sm font-medium text-black dark:text-white mb-1">
                Tip Title
              </label>
              <input
                id="tipTitle"
                type="text"
                value={newTipTitle}
                onChange={(e) => setNewTipTitle(e.target.value)}
                placeholder={editTip ? 'Edit tip title' : 'Enter your eco tip title'}
                className="w-full p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label htmlFor="tipDescription" className="block text-sm font-medium text-black dark:text-white mb-1">
                Tip Description
              </label>
              <textarea
                id="tipDescription"
                value={newTipDescription}
                onChange={(e) => setNewTipDescription(e.target.value)}
                placeholder={editTip ? 'Edit tip description' : 'Enter your eco tip description'}
                className="w-full p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-green-600 dark:bg-green-700 text-white font-semibold rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition"
              >
                {editTip ? 'Update Tip' : 'Add Tip'}
              </button>
              {(editTip || newTipTitle || newTipDescription) && (
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition"
                  onClick={() => {
                    setEditTip(null);
                    setNewTipTitle('');
                    setNewTipDescription('');
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Top Tips */}
        {topTips.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-700 mb-2">🌟 Top Tips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topTips.map((tip) => (
                <div key={tip._id} className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow p-4">
                  <TipCard tip={tip} onUpdate={handleEditTip} onDelete={handleDeleteTip} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Bookmarked Tips */}
        {bookmarks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-2">🔖 My Bookmarked Tips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTips
                .filter((tip) => bookmarks.includes(tip._id))
                .map((tip) => (
                  <div key={tip._id} className="bg-blue-50 border-l-4 border-blue-400 rounded-lg shadow p-4 relative">
                    <TipCard tip={tip} onUpdate={handleEditTip} onDelete={handleDeleteTip} />
                    <button
                      className="absolute top-2 right-2 text-xl text-blue-600"
                      title="Remove Bookmark"
                      onClick={() => handleBookmark(tip._id)}
                    >
                      🔖
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Paginated Tips */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white text-center">
            All Eco Tips for {region}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paginatedTips.map((tip) => (
              <div key={tip._id} className="relative bg-white/90 dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col gap-2">
                <TipCard
                  tip={tip}
                  onUpdate={handleEditTip}
                  onDelete={handleDeleteTip}
                />
                <button
                  className={`absolute top-2 right-2 text-xl ${
                    likeMap[tip._id] ? 'text-green-600' : 'text-gray-400'
                  }`}
                  title={likeMap[tip._id] ? 'Unlike' : 'Like'}
                  onClick={() => handleLike(tip._id)}
                >
                  {likeMap[tip._id] ? '👍' : '👍'}
                </button>
                <button
                  className={`absolute top-2 right-10 text-xl ${
                    bookmarks.includes(tip._id) ? 'text-blue-600' : 'text-gray-400'
                  }`}
                  title={bookmarks.includes(tip._id) ? 'Remove Bookmark' : 'Bookmark'}
                  onClick={() => handleBookmark(tip._id)}
                >
                  🔖
                </button>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                &lt;
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div
        style={{
          background: "#166534",
          color: "#fff",
          borderRadius: "1.5rem",
          padding: "2rem 1.5rem 1.5rem 1.5rem",
          margin: "2.5rem 0 1.5rem 0",
          boxShadow: "0 2px 12px #0002",
          textAlign: "center",
          maxWidth: "100%",
        }}
      >
        <div style={{
          fontStyle: "italic",
          fontSize: "1.3rem",
          marginBottom: "1.2rem",
          fontFamily: "Georgia, serif"
        }}>
          “The greatest threat to our planet is the belief that someone else will save it.”
        </div>
        <div style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          — Robert Swan
        </div>
        <div style={{ color: "#b7e4c7", fontSize: "1rem" }}>
          Thank you for making a difference! 🌱
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem", marginBottom: "1rem" }}>
        <button
          style={{
            background: "#388e3c",
            color: "#fff",
            padding: "0.75rem 2rem",
            border: "none",
            borderRadius: "0.7rem",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 2px 8px #0001",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onClick={() => window.location.href = '/eco-tips'}
        >
          View My Eco Tips
        </button>
      </div>
    </>
  );
}