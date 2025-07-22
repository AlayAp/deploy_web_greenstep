'use client';

import { useState } from 'react';

export default function RegionSelector({ onSelect }: { onSelect: (region: string) => void }) {
  const [selected, setSelected] = useState('Toronto');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setSelected(region);
    onSelect(region);
  };

  return (
    <select
      value={selected}
      onChange={handleChange}
      className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    >
      <option value="Toronto">Toronto</option>
      <option value="Vancouver">Vancouver</option>
      <option value="Montreal">Montreal</option>
    </select>
  );
}