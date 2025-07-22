'use client';
export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search eco tips..."
      className="w-full p-2 border rounded mb-6 text-black dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
    />
  );
}
