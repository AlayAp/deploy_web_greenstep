'use client';
export default function Pagination({
  current,
  total,
  onPageChange,
}: {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
      >
        &lt;
      </button>
      <span>
        {current} / {total}
      </span>
      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
}
